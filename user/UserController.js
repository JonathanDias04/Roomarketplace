const express = require("express");
const router = express.Router();
const User = require("./DBUsers");
const bcrypt = require("bcryptjs");
const Estado = require("./regiao/DBEstados");
const Cidade = require("./regiao/DBCidades");
const session = require("express-session");
const Notificacao = require("./DBNotificacoesProdutos");
const adminAuth = require("../middlewares/adminAuth");
const Produto = require("../produtos/DBprodutos");
const Categoria = require("../categorias/DBcategorias");
const TipoContatos = require("./contato/DBTiposContato");
const Contato = require("./contato/DBContatosUser");
const ImgProduto = require("../produtos/DBimgprodutos");


router.get("/admin/users/create", (req, res) => {
    Categoria.findAll().then(categorias => {
        Estado.findAll({order: [['ID_ESTADO', 'asc']]}).then(estado => {
            TipoContatos.findAll().then(tiposContatos => {
                res.render("users/create", {estados: estado, tiposContatos: tiposContatos, categorias: categorias});
            })
        });
    });
});

router.get("/admin/users/perfil", (req, res) => {
    Estado.findAll({order: [['ID_ESTADO', 'asc']]}).then(estado => {
        res.render("users/perfil", {estados: estado});
    });
});

let urlencodedParser = express.urlencoded({ extended: false })

router.post("/user/busca_cidades", urlencodedParser, (req, res) => {
    var id_estado = req.body.id_estado;
    Cidade.findAll({
        where: {
            FK_ESTADO: id_estado
        }
    }).then(cidades => {
        res.json(cidades);
    })
})

router.post("/users/create", (req, res) => {
    var usuario = req.body.usuario;
    var estado = req.body.estado;
    var cidade = req.body.cidade;
    var senha = req.body.senha;
    var email = req.body.email;
    var tipoContato1 = req.body.tipoContato1;
    var tipoContato2 = req.body.tipoContato2;
    var contato1 = req.body.contato1;
    var contato2 = req.body.contato2;

    User.findOne({where: {
        EMAIL_USUARIO: email
    }}).then(user => {
        console.log("chegou1")
        if(user == undefined) {

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(senha, salt)
            console.log("chegou")
            User.create({
                NICK_USUARIO: usuario,
                EMAIL_USUARIO: email,
                SENHA_USUARIO: hash,
                FK_CIDADE: cidade,

            }).then(() => {
                User.findOne({where: {EMAIL_USUARIO: email}}).then(user => {
                    Contato.create({
                        CONTATO: contato1,
                        FK_USUARIO: user.ID_USUARIO,
                        FK_TIPO_CONTATO: tipoContato1
                    }).then(() => {
                        Contato.create({
                            CONTATO: contato2,
                            FK_USUARIO: user.ID_USUARIO,
                            FK_TIPO_CONTATO: tipoContato2
                        }).then(() => {
                            res.redirect("/auth/login");
                        }).catch(error => {
                            console.log(error)
                        });
                    }).catch(error => {
                        console.log(error)
                    });
                })
            }).catch(error => {
                console.log(error)
                res.redirect("/admin/users/create")
            });

        } else {
            res.redirect("/admin/users/create")
        }
    }).catch(error => {
        console.log(error)
        res.redirect("/admin/users/create")
    })
});

router.get("/auth/login", (req, res) => {
    Categoria.findAll().then(categorias => {
        res.render("users/login", {categorias: categorias});
    })
});
router.post("/user/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {
        EMAIL_USUARIO: email
    }}).then(user => {
        if(user != undefined) {

            var correct = bcrypt.compareSync(password, user.SENHA_USUARIO);

            if(correct) {

                Cidade.findOne({where: {ID_CIDADE: user.FK_CIDADE}}).then(cidade => {
                    var id_estado =  cidade.FK_ESTADO;

                    req.session.usuarioData = {
                        id: user.ID_USUARIO,
                        email: user.EMAIL_USUARIO,
                        nick: user.NICK_USUARIO,
                        id_cidade: user.FK_CIDADE,
                        nome_cidade: cidade.NOME_CIDADE,
                        estado: id_estado
                    }
    
                    console.log(req.session.usuarioData)
                    res.redirect("/");

                }).catch(err => {
                    console.log(err);
                })
            } else {
                res.redirect("/auth/login")
            }

        } else {
            res.redirect("/auth/login")
        }
    }).catch(error => {
        console.log(error)
    })
});

router.get("/auth/logout", adminAuth, (req, res) => {
    req.session.usuarioData = undefined;
    res.redirect("/auth/login");
});

router.post("/produto/notificar", adminAuth, (req, res) => {
    var slug_produto = req.body.slug_produto;
    var produtoId = req.body.produtoId;
    var produto = req.body.produto;
    var usuario_produto = req.body.usuarioId;
    var usuario_interesse = req.session.usuarioData.nick;
    var id_usuario_interesse = req.session.usuarioData.id;
    console.log(id_usuario_interesse);
    Notificacao.create({
        DESCRICAO_NOTIFICACAO: usuario_interesse + " demonstrou interesse no seu produto: " + produto,
        FK_USER_PRODUTO: usuario_produto,
        FK_USER_INTERESSE: id_usuario_interesse,
        FK_PRODUTO: produtoId
    }).then(() => {
        res.redirect("/produto/visualizar/" + slug_produto);
    }).catch(err => {
        console.log(err)
    })
});

router.get("/user/perfil", adminAuth, (req, res) => {
    User.findOne({where: {ID_USUARIO: req.session.usuarioData.id}}).then(user => {
        Notificacao.findAll({
                where: { FK_USER_PRODUTO: req.session.usuarioData.id }, order: [['ID_NOTIFICACO', 'DESC']],
                include: [
                    {model: User, required: false},
                    {model: Produto, required: false}
                ],
        }).then(notificacoes => {
            console.log(notificacoes)
        Notificacao.findAll(
            {
                where: {
                    FK_USER_PRODUTO: req.session.usuarioData.id
                }, 
                include: [{model: User, required: false}, {model: Produto, required: false}],
                order: [['ID_NOTIFICACO', 'DESC']]
            }
        ).then(interessados => {
            console.log(interessados)
            Estado.findAll().then(estado => {
                Produto.findAll({where: {FK_USUARIO: req.session.usuarioData.id}}).then(produto => {
                    Categoria.findAll().then(categoria => {
                        Contato.findAll({include: [{model: TipoContatos, require:false}]}).then(contato => {
                            ImgProduto.findAll({ where: {FK_USUARIO: req.session.usuarioData.id}}).then(img => {
                                TipoContatos.findAll().then(tiposContatos => {
                                    res.render("users/perfil", {
                                        usuarioData: req.session.usuarioData,
                                        notificacoes: notificacoes,
                                        estados: estado,
                                        usuario: user,
                                        produtos: produto,
                                        categorias: categoria,
                                        interessados : interessados,
                                        contatos: contato,
                                        imgProduto: img,
                                        tiposContatos: tiposContatos
                                    })
                                });
                            })
                        })
                    });
                });
            });
        });
        });
    });
});

router.post("/user/perfil/editar", adminAuth, (req, res) => {
    var usuario = req.body.usuario;
    var estado = req.body.estado;
    var cidade = req.body.cidade;
    var contato1 = req.body.contato1;
    var contato2 = req.body.contato2;

    User.update({
        NICK_USUARIO: usuario,
        FK_CIDADE: cidade,
    },{ where: {ID_USUARIO: req.session.usuarioData.id}}).then(() => {
        Cidade.findOne({where: {ID_CIDADE: cidade}, atributes: ['NOME_CIDADE']}).then(nome_cidade => {
            req.session.usuarioData.id_cidade = cidade;
            req.session.usuarioData.nick = usuario;
            req.session.usuarioData.nome_cidade = nome_cidade.NOME_CIDADE;
            req.session.usuarioData.estado = estado;
            Contato.update({CONTATO: contato1},{ where: {FK_USUARIO: req.session.usuarioData.id, ORDEM_CONTATO: 1} }).then(() => {
                Contato.update({CONTATO: contato2},{ where: {FK_USUARIO: req.session.usuarioData.id, ORDEM_CONTATO: 2}}).then(() => {
                    res.redirect("/user/perfil");
                });
            });
        });
    });
});

router.post("/user/perfil/editar/senha", (req, res) => {
    var senha = req.body.senha;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(senha, salt)
    User.update({
        SENHA_USUARIO: hash
    }, { where: {
        ID_USUARIO: req.session.usuarioData.id
    }}).then(() => {
        res.redirect("/user/perfil");
    })
});

router.post('/user/perfil/contato', adminAuth, (req, res) => {
    var id_usuario = req.session.usuarioData.id;
    var contato = req.body.contato;
    var tipoContato = req.body.tipoContato;
    Contato.findAndCountAll({where: {FK_USUARIO: req.session.usuarioData.id}}).then(result => {
        var ordem_contato = result.count + 1;
        Contato.create({
            ORDEM_CONTATO: ordem_contato,
            CONTATO: contato,
            FK_USUARIO: id_usuario,
            FK_TIPO_CONTATO: tipoContato
        }).then(() => {
            res.redirect("/user/perfil")
        })
    })
})

module.exports = router;

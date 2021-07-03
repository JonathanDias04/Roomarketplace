const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const dateFormat = require('dateformat');
const { default: slugify } = require("slugify");
const adminAuth = require("../middlewares/adminAuth");
const fs = require('fs');

// MODEL
const Categoria = require("../categorias/DBcategorias");
const Produto = require("../produtos/DBprodutos");
const EstadoProduto = require("../produtos/EstadoProduto/DBEstadoProduto");
const User = require("../user/DBUsers");
const Cidade = require("../user/regiao/DBCidades");
const Estado = require("../user/regiao/DBEstados")
const Notificacao = require("../user/DBNotificacoesProdutos");
const TipoContatos = require("../user/contato/DBTiposContato");
const Contato = require("../user/contato/DBContatosUser");
const ImgProduto = require("./DBimgprodutos");

const multer = require("multer");
const multerConfig = require("../config/multer");

router.use(express.urlencoded({ extended: true }))
router.use(express.json()) 

router.post("/produtos/anunciar_produto", multer(multerConfig).array("file", 4),  (req, res) => {
    var titulo = req.body.titulo_produto;
    var descricao = req.body.descricao;
    var valor = req.body.preco;
    var condicao = req.body.condicao;
    var categoria = req.body.categoria;
    var usuario = req.session.usuarioData.id;
    var files = req.files;
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    console.log(estado);
    Produto.create({
        TITULO_PRODUTO: titulo,
        DESCRICAO_PRODUTO: descricao,
        VALOR_PRODUTO: valor,
        DATA_ATUALIZACAO: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
        SLUG_PRODUTO: slugify(titulo),
        FK_CONDICAO_PRODUTO: condicao,
        FK_CATEGORIA: categoria,
        FK_USUARIO: usuario,
        FK_CIDADE_PRODUTO: cidade,
        FK_ESTADO_PRODUTO: estado,
        CONDICAO_ANUNCIO: true
    }).then(() => {
        console.log("criou");
        Produto.findOne({where: {TITULO_PRODUTO: titulo, DESCRICAO_PRODUTO: descricao}}).then(produto => {
            files.forEach(file => {
                ImgProduto.create({
                    NOME_IMG: file.originalname,
                    KEY_IMG: file.filename,
                    SIZE_IMG: file.size,
                    FK_PRODUTO: produto.ID_PRODUTO,
                    FK_USUARIO: req.session.usuarioData.id
                }).then(() => {
                    res.redirect("/produto/visualizar/" + produto.SLUG_PRODUTO);
                })
            })
            
        })
    }).catch(error => {
        console.log(error);
    })
});

router.get("/produtos/pesquisar", (req, res) => {
    console.log("oi");
    var pesquisa = true;
    var categoria = req.query.categoria;
    var produto = req.query.produto_pesquisa;
    console.log(categoria);
    Categoria.findAll().then(categorias => {
        Produto.findAll({
            where: {
                TITULO_PRODUTO: {
                    [Op.like]: '%' + produto + '%'
                }
            },
            include: [
                {model: EstadoProduto, atributes: ['ESTADO_PRODUTO']},
                {model: Estado, required: false},
                {model: Cidade, required: false}
            ]
        }).then(produtos => {
            Cidade.findAll().then(cidades => {
                ImgProduto.findAll().then(img => {
                    if(typeof req.session.usuarioData !== 'undefined') {
                        User.findOne({ where: {ID_USUARIO: req.session.usuarioData.id} }).then(usuario => {
                            Notificacao.findAll({where: { FK_USER_PRODUTO: req.session.usuarioData.id }, order: [
                                ['ID_NOTIFICACO', 'DESC']
                            ],
                            include: [
                                {model: User, required: false},
                                {model: Produto, required: false}
                            ],}).then(notificacao => {
                                res.render("produtos/produtos", {imgProduto: img, cidades: cidades, produtos: produtos, categoria: categoria, categorias:categorias, pesquisa: pesquisa, usuarioData: req.session.usuarioData, usuario: usuario, notificacoes: notificacao})
                            })
                        })
                    } else {
                        res.render("produtos/produtos", {imgProduto: img, cidades: cidades, produtos: produtos, categoria: categoria, pesquisa: pesquisa, categorias:categorias})
                    }
                })
            }).catch(error => {
                console.log(error)
            });
        }).catch(error => {
            console.log(error)
        });
    });

});


router.get("/produtos/filtrar", (req, res) => {
    var min = req.query.min;
    var max = req.query.max;
    var ordem = req.query.ordem;
    var categoria = req.query.categoria;
    if(min != undefined) {
        /*req.session.min = req.params.min;
        var minSession = req.session.min;
        Produto.findAll({
            order: [
                ['VALOR_PRODUTO', 'ASC']
            ]
        }).then(produto => {
            console.log(produto);
            res.render("produtos", {produtos_min: produto, minSession: minSession})
        });*/
    }
    if(max != undefined){
        //req.session.max = req.params.max;
    }
    console.log("entrou");
    if(ordem != undefined) {
        console.log("entroumin")
        if(req.session.ordem == 1) {
            req.session.ordem = req.query.ordem;
            Produto.findAll({
                order: [
                    ['VALOR_PRODUTO', 'ASC']
                ]
            }).then(produto => {
                console.log(produto);
                res.render("produtos", {produtos: produto, categoria: categoria})
            }).catch(error => {
                console.log(error)
            });
        } else {
            req.session.ordem = req.query.ordem;
            Produto.findAll({
                order: [
                    ['VALOR_PRODUTO', 'DESC']
                ]
            }).then(produto => {
                console.log(produto);
                res.render("produtos", {produtos: produto, categoria: categoria})
                console.log("chegou aqui")
            }).catch(error => {
                console.log(error)
            });
        }
    }
    
    if(req.query.cidade != undefined){
        //req.session.cidade = req.body.cidade;
    }
});

router.get("/produto/new", adminAuth, (req, res) => {
    User.findOne({ where: {ID_USUARIO: req.session.usuarioData.id} }).then(usuario => {
        Categoria.findAll().then(categorias => {
            Notificacao.findAll({where: { FK_USER_PRODUTO: req.session.usuarioData.id }, order: [
                ['ID_NOTIFICACO', 'DESC']
            ],
            include: [
                {model: User, required: false},
                {model: Produto, required: false}
            ],}).then(notificacao => {
                Estado.findAll().then(estado => {
                    res.render("produtos/newProduto", {usuario: usuario, estados: estado, categorias: categorias, usuarioData: req.session.usuarioData, notificacoes: notificacao});
                })
            })
        })
    });
})

router.get("/produto/visualizar/:slug_produto", (req, res) => {
    var slug_produto = req.params.slug_produto;
    Categoria.findAll().then(categoria => {
        Produto.findOne({
            where: {SLUG_PRODUTO: slug_produto},
            include: [
                {model: EstadoProduto, atributes: ['ESTADO_PRODUTO']},
                {model: Estado, required: false},
                {model: Cidade, required: false}
            ]
        }).then(produto => {
            User.findOne({
                atributes: ['FK_USUARIO'],
                where: {
                    ID_USUARIO: produto.FK_USUARIO
                }, 
                include: [{model: Cidade, atributes: ['NOME_CIDADE', 'NICK_USUARIO']},
            ]
            }).then(user_produto => {
                Cidade.findOne({
                    atributes: ['NOME_CIDADE'],
                    where: {
                        NOME_CIDADE: user_produto.TB_CIDADE.NOME_CIDADE
                    },
                    include: [{model: Estado, atributes: ['UF_ESTADO']}]
                }).then(uf => {
                    ImgProduto.findAll({where: {FK_PRODUTO: produto.ID_PRODUTO}}).then(imgProduto => {
                        console.log(imgProduto);
                        if(typeof req.session.usuarioData !== 'undefined') {
                            User.findOne({ where: {ID_USUARIO: req.session.usuarioData.id} }).then(usuario => {
                                Notificacao.findAll({where: { FK_USER_PRODUTO: req.session.usuarioData.id }, order: [
                                    ['ID_NOTIFICACO', 'DESC'],
                                    ],
                                    include: [
                                        {model: Produto, required: false},
                                        {model: User, required: false}
                                    ]
                                }).then(notificacao => {
                                    console.log(notificacao)
                                    Contato.findAll({include: [{model: TipoContatos, require:false}]}).then(contato => {
                                        console.log(contato)
                                        Notificacao.findOne({ where: { FK_USER_INTERESSE: req.session.usuarioData.id, FK_PRODUTO: produto.ID_PRODUTO} }).then(result => {
                                            console.log(result)
                                            if(result === null) {
                                                res.render("produtos/pageProduto", {imgProduto: imgProduto, contatos: contato, interessados: notificacao, produto: produto, usuario: usuario, usuario_produto: user_produto, uf: uf, usuarioData: req.session.usuarioData, notificacoes: notificacao, categorias: categoria});
                                            } else {
                                                res.render("produtos/pageProduto", {imgProduto: imgProduto, contatos: contato, interessados: notificacao, produto: produto, usuario: usuario, usuario_produto: user_produto, uf: uf, usuarioData: req.session.usuarioData, notificacoes: notificacao, categorias: categoria, result_notif: true});
                                            }
                                        })
                                    })
                                    
                                });
                            });
                        } else {
                            Contato.findAll({include: [{model: TipoContatos, require:false}], where: {FK_USUARIO: produto.FK_USUARIO}}).then(contato => {
                                console.log(contato)
                                res.render("produtos/pageProduto", {imgProduto: imgProduto, produto: produto, usuario_produto: user_produto, uf: uf, categorias: categoria, contatos: contato});
                            });
                        }
                    });
                }).catch(error => {
                    console.log(error)
                })
            }).catch(error => {
                console.log(error)
            })
        }).catch(error => {
            console.log(error)
        })
    })
});

router.post("/produto/editar", multer(multerConfig).array("file", 4), (req, res) => {
    var id_usuario = req.body.id_usuario;
    var id_produto = req.body.id_produto;
    var titulo = req.body.titulo_produto;
    var preco = req.body.preco;
    var categoria = req.body.categoria;
    var condicao = req.body.condicao;
    var descricao = req.body.descricao;
    var data = new Date();
    var imgs = req.body.file;
    var files = req.files;
    console.log(files);
    Produto.update({ 
        TITULO_PRODUTO: titulo,
        DESCRICAO_PRODUTO: descricao,
        VALOR_PRODUTO: preco,
        DATA_ATUALIZACAO: data,
        SLUG_PRODUTO: slugify(titulo),
        FK_CATEGORIA: categoria,
        FK_CONDICAO_PRODUTO: condicao,
        FK_USUARIO: id_usuario,
    }, {
        where: {
            ID_PRODUTO: id_produto
        }
    }).then(() => {
        Produto.findOne({where: {
            ID_PRODUTO: id_produto
        }}).then(produto => {
            console.log(files+'maneiro')
            if(files != '') {
                ImgProduto.findAll({atributes: ['KEY_IMG'], where: {FK_PRODUTO: id_produto} }).then(img => {
                    const path = '../Roomarketplace/public/img/produtos/';
                    img.forEach(imgProduto => {
                        var imgPath = path + imgProduto.KEY_IMG;
                        fs.unlink(imgPath, (err) => {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log('ARQUIVOS REMOVIDOS');
                                ImgProduto.destroy({where: {KEY_IMG: imgProduto.KEY_IMG}}).then(() => {
                                    console.log('IMAGEM REMOVIDA DO BANCO');
                                })
                            }
                        });
                    });

                    files.forEach(file => {
                        ImgProduto.create({
                            NOME_IMG: file.originalname,
                            KEY_IMG: file.filename,
                            SIZE_IMG: file.size,
                            FK_PRODUTO: produto.ID_PRODUTO,
                            FK_USUARIO: req.session.usuarioData.id
                        }).then(() => {
                            res.redirect("/produto/visualizar/" + produto.SLUG_PRODUTO);
                        })
                    })
                })
            } else {
                res.redirect("/produto/visualizar/" + produto.SLUG_PRODUTO);
            }
            
        })
    })
})

router.post("/produto/deletar", adminAuth, (req, res) => {
    var id_produto = req.body.id_produto;
    ImgProduto.findAll({where: {FK_PRODUTO: id_produto}}).then(imgs => {
        imgs.forEach(img => {
            const path = '../Roomarketplace/public/img/produtos/';
            var imgPath = path + img.KEY_IMG;
            fs.unlink(imgPath, (err) => {
                if(err){
                    console.log(err)
                } else {
                    console.log('ARQUIVOS REMOVIDOS');
                }
            })

            ImgProduto.destroy({where: {KEY_IMG: img.KEY_IMG}}).then(() => {
                console.log('IMAGEM REMOVIDA DO BANCO');
                Notificacao.findAll({where: {FK_PRODUTO: id_produto}}).then(interesses => {
                    console.log(interesses)
                    interesses.forEach(interesse => {
                        console.log(interesses)
                        Notificacao.destroy({where: {
                            ID_NOTIFICACO: interesse.ID_NOTIFICACO
                        }}).then(() => {
                            console.log("interesse apagado")
                        })
                    })
                    Produto.destroy({
                        where: {
                            ID_PRODUTO: id_produto
                        }
                    }).then(() => {
                        res.redirect("/user/perfil");
                    })
                })
            })
        })
        
    })
})

router.post("/filtra/cidade", (req, res) => {
    var cidade = req.body.cidade;
    Produto.findAll(
        {where:{FK_CIDADE_PRODUTO: cidade},
        include: [
            {model: Cidade, required: false},
            {model: Estado, required: false}
        ]
    }).then(produtos => {
        ImgProduto.findAll().then(imgs => {
            res.json({produtos: produtos, imgs: imgs})
        })
    })
})

router.post("/produto/encerrarReabrirAnuncio", adminAuth, (req, res) => {
    var condicao = req.body.condicaoAnuncio;
    condicao = parseInt(condicao);
    var produto = req.body.id_produto;
    console.log(req.body);
    Produto.update({
        CONDICAO_ANUNCIO: condicao
    }, {
        where: {
            ID_PRODUTO: produto
        }
    }).then(() => {
        res.redirect("/user/perfil");
    })
})

module.exports = router;
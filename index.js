const express = require("express");
const app = express();
const connection = require("./database/database");
const router = express.Router();
const dateFormat = require('dateformat');
const session = require("express-session");
const { Op } = require("sequelize");
const { default: slugify } = require("slugify");
const multer = require("multer");
const bodyParser = require("body-parser");

const upload = multer({dest: "uploads/"})

// ViewEngine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// Session 
app.use(session({
    secret: "asdfasdgasdfgserwe",
    cookie: {
        maxAge: 7200000
    }
}));

app.get("/session", (req, res) => {
    req.session.data = true;
    if(req.session.data) {
        res.send("Sessão criada!");
    }
    else {
        res.send("Sessão criada!");
    }
});

app.get("/leitura", (req, res) => {
    res.json({
        data: req.session.data,
        usuario: req.session.usuarioData
    })
});

// MODEL
const Categoria = require("./categorias/DBcategorias");
const Produto = require("./produtos/DBprodutos");
const EstadoProduto = require("./produtos/EstadoProduto/DBEstadoProduto");
const Cidade = require("./user/regiao/DBCidades");
const Estado = require("./user/regiao/DBEstados");
const User = require("./user/DBUsers");
const Notificacao = require("./user/DBNotificacoesProdutos");
const Contatos = require("./user/contato/DBContatosUser");
const TipoContatos = require("./user/contato/DBTiposContato");
const Imgprodutos = require("./produtos/DBimgprodutos");

// CONTROLLER
const ProdutoController = require("./produtos/ProdutosController");
const UserController = require("./user/UserController");
app.use("/", ProdutoController);
app.use("/", UserController);

//DATABASE
connection.authenticate().then(() => {
    console.log("Conexão realizada")
}).catch((error) => {
    console.log(error)
});

//---------------- ROTAS ----------------------
app.get("/", (req, res) => {
    Categoria.findAll().then(categoria => {
            req.session.convidado = true;
            if(req.session.usuarioData !== undefined) {
                Notificacao.findAll({where: { FK_USER_PRODUTO: req.session.usuarioData.id }, include: [
                    {model: User, required: false},
                    {model: Produto, required: false}
                ],}).then(notificacao => {
                    console.log(notificacao)
                    User.findOne({ where: {
                        ID_USUARIO: req.session.usuarioData.id
                    }}).then(usuario => {     
                        res.render("indexView", {categorias: categoria, usuarioData: req.session.usuarioData, usuario: usuario, notificacoes: notificacao})
                    })
                })
            } else {
                res.render("indexView", {categorias: categoria})
            }
        
    }).catch((error) => {
        console.log(error)
    })
});

app.get("/:slug_categoria/produtos", (req, res) => {
    var slug = req.params.slug_categoria;
    Categoria.findAll().then(categorias => {
        Categoria.findOne({
            attributes: ['ID_CATEGORIA', 'NOME_CATEGORIA'],
            where: {
                SLUG_CATEGORIA: slug
            }
        }).then((categoria) => {
            Produto.findAll({
                where: {
                    FK_CATEGORIA: categoria.ID_CATEGORIA
                },
                order: [
                    ['VALOR_PRODUTO', 'DESC']
                ]
            }).then(produto => {
                console.log(categoria['NOME_CATEGORIA']);
                Imgprodutos.findAll().then(img => {
                    if(req.session.usuarioData !== undefined) {
                        User.findOne({ where: {ID_USUARIO: req.session.usuarioData.id} }).then(usuario => {
                            Notificacao.findAll({where: { FK_USER_PRODUTO: req.session.usuarioData.id }, include: [
                                {model: User, required: false},
                                {model: Produto, required: false}
                            ],}).then(notificacao => {
                                console.log(notificacao);
                                res.render("produtos/produtos", { produtos: produto, imgProduto: img, categoria: categoria['NOME_CATEGORIA'], usuarioData: req.session.usuarioData, usuario: usuario, notificacoes: notificacao, categorias: categorias})
                            })
                        })
                    } else {
                        res.render("produtos/produtos", { produtos: produto, imgProduto: img, categoria: categoria['NOME_CATEGORIA'], categorias: categorias})
                    }
                }).catch(error => {
                    console.log(error);
                })
            }).catch(error => {
                console.log(error);
            })
        }).catch(error => {
            console.log(error)
        })
    })
});

app.listen(5000, () => {
    console.log("O servidor está rodando")
});
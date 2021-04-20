const express = require("express");
const app = express();
const connection = require("./database/database");
const router = express.Router();
const dateFormat = require('dateformat');

// ViewEngine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// MODEL
const Categoria = require("./categorias/DBcategorias");
const Produto = require("./produtos/DBprodutos");
const EstadoProduto = require("./produtos/EstadoProduto/DBEstadoProduto");

//DATABASE
connection.authenticate().then(() => {
    console.log("Conexão realizada")
}).catch((error) => {
    console.log(error)
});

//---------------- ROTAS ----------------------
app.get("/", (req, res) => {
    Categoria.findAll().then(categoria => {
        console.log(categoria);
        res.render("indexView", {categorias: categoria})
    }).catch((error) => {
        console.log(error)
    })
});

app.post("/produto/anunciar_produto", (req, res) => {
    var titulo = 'computador';
    var descricao = 'computador maneiro';
    var valor = 10000;
    var condicao = 1;
    var categoria = 1;
    Produto.create({
        TITULO_PRODUTO: titulo,
        DESCRICAO_PRODUTO: descricao,
        VALOR_PRODUTO: valor,
        DATA_ATUALIZACAO: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
        FK_ESTADO_PRODUTO: condicao,
        FK_CATEGORIA: categoria
    }).then(() => {
        console.log("criou");
        res.send("oi")
    }).catch(error => {
        console.log("VISH MEU PARÇA");
    })
});

app.get("/produtos/:slug_categoria", (req, res) => {
    var slug = req.params.slug_categoria;
    Categoria.findOne({
        attributes: ['ID_CATEGORIA'],
        where: {
            SLUG_CATEGORIA: slug
        }
    }).then(categoria => {
        console.log(categoria)
        Produto.findAll({
            where: {
                FK_CATEGORIA: categoria['ID_CATEGORIA']
            }
        }).then(produto => {
            console.log(produto)
            res.render("produtos", { produtos_categoria: produto})
        }).catch(error => {
            console.log(error);
        })
    })
})

app.listen(5000, () => {
    console.log("O servidor está rodando")
});
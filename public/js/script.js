$(document).ready(function() {
    $('.js-example-basic-single').select2({
        theme: "classic"
    });
});

function search() {
    var search = document.getElementById('search');
    if (search.style.display === "none") {
        search.style.display = "flex";
        var btn_search = document.getElementById('btn-search');
        btn_search.style.display = "none";
    } else {
        search.style.display = "none";
    } 
}

function buscar_cidades(){
    var select = document.getElementById('id_regiao_estado');
	var value = select.options[select.selectedIndex].value;

    let ajax = new XMLHttpRequest();
    let params = 'id_estado='+value;
    ajax.open('POST', 'http://localhost:5000/user/busca_cidades');
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    ajax.onreadystatechange = function() {
        if(ajax.status === 200 && ajax.readyState === 4) {
            console.log(params)
            cidades = JSON.parse(ajax.responseText);
            console.log(cidades[0]["NOME_CIDADE"])
            var listCidades = document.getElementById("id_regiao_cidade");

            while (listCidades.length) {
                listCidades.remove(0);
            }

            for(i = 0; i < cidades.length; i++) {
                var opt0 = document.createElement("option");
                opt0.value = cidades[i]['ID_CIDADE'];
                opt0.text = cidades[i]['NOME_CIDADE'];
                listCidades.add(opt0, listCidades.options[0]);
            }
        }
    }
    ajax.send(params);
}

function buscar_cidades_editar(){
    var select = document.getElementById('editarEstado');
	var value = select.options[select.selectedIndex].value;

    let ajax = new XMLHttpRequest();
    let params = 'id_estado='+value;
    ajax.open('POST', 'http://localhost:5000/user/busca_cidades');
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    ajax.onreadystatechange = function() {
        if(ajax.status === 200 && ajax.readyState === 4) {
            console.log(params)
            cidades = JSON.parse(ajax.responseText);
            console.log(cidades[0]["NOME_CIDADE"])
            var listCidades = document.getElementById("editarcidade");

            while (listCidades.length) {
                listCidades.remove(0);
            }

            for(i = 0; i < cidades.length; i++) {
                var opt0 = document.createElement("option");
                opt0.value = cidades[i]['ID_CIDADE'];
                opt0.text = cidades[i]['NOME_CIDADE'];
                listCidades.add(opt0, listCidades.options[0]);
            }
        }
    }
    ajax.send(params);
}

function buscar_cidades_perfil(){
    var select = document.getElementById('id_regiao_estado');
	var value = select.options[select.selectedIndex].value;

    let ajax = new XMLHttpRequest();
    let params = 'id_estado='+value;
    ajax.open('POST', 'http://localhost:5000/user/busca_cidades');
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    ajax.onreadystatechange = function() {
        if(ajax.status === 200 && ajax.readyState === 4) {
            console.log(params)
            cidades = JSON.parse(ajax.responseText);
            console.log(cidades[0]["NOME_CIDADE"])
            var listCidades = document.getElementById("id_regiao_cidade");

            while (listCidades.length) {
                listCidades.remove(0);
            }

            for(i = 0; i < cidades.length; i++) {
                var opt0 = document.createElement("option");
                opt0.value = cidades[i]['ID_CIDADE'];
                opt0.text = cidades[i]['NOME_CIDADE'];
                listCidades.add(opt0, listCidades.options[0]);
            }
        }
    }
    ajax.send(params);
}

function interessados(interessados) {
    document.write(interessados + 'opa')
    var cont = 0;
    interessados.forEach(inter => {
        if(inter.FK_PRODUTO == id_produto) {
            cont++
        }
    });
    document.getElementById('interessados'+id_produto).innerHTML = cont;
}

function filtrarProdutos() {
    var listaProdutos = document.getElementById('listaProdutos');
    var cidade = document.getElementById('cidade');
    var optCidade = cidade.options[cidade.selectedIndex].value;
    var content = document.getElementById('content');

    listaProdutos.parentNode.removeChild(listaProdutos);

    var carrega = document.createElement('div');
    carrega.classList.add('d-flex', 'justify-content-center');
    carrega.id = 'spinner';
    var spinner = document.createElement('div');
    spinner.classList.add('spinner-border')
    var loading = document.createElement('span');
    loading.classList.add('visually-hidden');
    loading.innerHTML = 'Carregando...';

    spinner.appendChild(loading);
    carrega.appendChild(spinner)
    content.appendChild(carrega);

    $.ajax({
        url: "/filtra/cidade",
        dataType:'text',
        data: {cidade: optCidade},
        type: 'post'
    }).done(function(res) {
        let data = JSON.parse(res);
        var produtos = data.produtos;
        var imgs = data.imgs;
        
        var spinner = document.getElementById('spinner');
        spinner.parentNode.removeChild(spinner);
        var row = document.createElement('div');
        row.classList.add('row', 'mt-4', 'px-5');
        row.id = 'listaProdutos';
        content.appendChild(row);

        var lengthProdutos = Object.keys(produtos).length;
        if(lengthProdutos > 0) {
            $('#semProdutos').hide();
            produtos.forEach(produto => {
                var col = document.createElement('div');
                col.classList.add('col-lg-3')
    
                var a = document.createElement('a');
                a.href = "/produto/visualizar/" + produto.SLUG_PRODUTO;
                a.classList.add('text-dark')
    
                var divCard = document.createElement('div');
                divCard.classList.add('card', 'text-white', 'bg-dark', 'mb-3', 'ms-auto', 'mt-3', 'me-auto');
                divCard.style = 'max-width: 18rem;';
    
                var divImg = document.createElement('div');
                divImg.classList.add('divImgCard');
    
                var lengthImgs = Object.keys(imgs).length;
                for(let i = 0; i < lengthImgs; i++) {
                    if(imgs[i].FK_PRODUTO == produto.ID_PRODUTO) {
                        var imgProduto = document.createElement('img');
                        imgProduto.src = "/img/produtos/" + imgs[i].KEY_IMG;
                        imgProduto.classList.add('img-fluid', 'mx-auto');
                        imgProduto.style = "height:250px; width: 100%;";
                    }
                }
    
                var cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
    
                var titulo = document.createElement('h6');
                titulo.classList.add('texto_overflow', 'card-title')
                titulo.innerHTML = produto.TITULO_PRODUTO;
    
                var cidade = document.createElement('h6');
                cidade.classList.add('card-title', 'my-3');
                var icon = 
                "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-geo-alt-fill' viewBox='0 0 16 16'>"+
                "   <path d='M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z'/>"+
                "</svg>";
                cidade.innerHTML = icon + " " + produto.TB_CIDADE.NOME_CIDADE + " - " + produto.TB_ESTADO.UF_ESTADO;
    
                var preco = document.createElement('h5');
                preco.classList.add('card-text', 'text-success');
                preco.innerHTML = "R$ " + produto.VALOR_PRODUTO + ",00";
    
                row.appendChild(col);
                col.appendChild(a);
                a.appendChild(divCard);
                divCard.appendChild(divImg);
                divImg.appendChild(imgProduto);
                divCard.appendChild(cardBody);
                cardBody.appendChild(titulo);
                cardBody.appendChild(cidade);
                cardBody.appendChild(preco);
            })    
        } else {
            $('#semProdutos').show();
        }
            
    })

}

function login(e) { 
    e.preventDefault();

    var email = $('#email').val();
    var password = $('#password').val();

    $.ajax({
        url: "/user/authenticate",
        dataType:'text',
        data: {email: email, password: password},
        type: 'post'
    }).done(function(res) {
        var resposta = JSON.parse(res);

        if(resposta == "logado") {
            window.location.replace("/");
        } else if(resposta == "senha") {
            console.log("entrou")
            Swal.fire({
                title: 'Senha Inválida!',
                text: 'Senha digitada parece não estar correta!',
                icon: 'error',
                confirmButtonText: 'Fechar'
              })
        } else if(resposta == "email") {
            Swal.fire({
                title: 'E-mail Inválido!',
                text: 'E-mail digitado não existe!',
                icon: 'error',
                confirmButtonText: 'Fechar',
              })
        }
    })
}

function MostraModalProduto() {
    $.ajax({
        url: "/user/verificaLogin",
        dataType:'text',
        type: 'get'
    }).done(function(res) {
        var resposta = JSON.parse(res);

        if(resposta == "logado") {
            BuscaEstados(null);
            $('#novoProduto').modal('show');
        } else if(resposta == "deslogado") {
            console.log("entrou")
            Swal.fire({
                title: 'Login Necessário!',
                text: 'Para anunciar um produto, faça login ou crie uma conta!',
                icon: 'warning',
                confirmButtonText: 'Fechar'
            })
        }
    })
}

function BuscaEstados(estadoSelecionado) {
    $.ajax({
        url: "/user/buscaEstados",
        dataType:'text',
        type: 'get',
        success: function(res) {
            var estados = JSON.parse(res);
            if(estadoSelecionado == null) {
                var select = document.getElementById('id_regiao_estado');
            } else {
                var select = document.getElementById('editarEstado');
            }

            while(select.options.length) {
                select.options.remove(0);
            }

            if(estadoSelecionado == null) {
                var optionPadrao = document.createElement('option');
                optionPadrao.innerHTML = "Selecione um estado";
                select.appendChild(optionPadrao);
            }
            
            estados.forEach(estado => {
                var option = document.createElement('option');
                option.innerHTML = estado.NOME_ESTADO;
                option.value = estado.ID_ESTADO;
                if(estadoSelecionado == estado.ID_ESTADO) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        } 
    })
}

function sucessCallback(estados) {

}
  
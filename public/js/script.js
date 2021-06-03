// In your Javascript (external .js resource or <script> tag)
$(document).on("load", function() {
    $('.js-example-basic-single').select2();
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
  
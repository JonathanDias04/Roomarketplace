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

$(function(){
    $('.texto_overflow').succinct({
        size: 10
    });
});
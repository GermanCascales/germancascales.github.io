$(document).ready(function() {
    var oTable = $('#myTable').dataTable({
        "ajax": "data/malaga.txt",
        "columns": [
            { "data": "frecuencia", "sClass": "mdl-data-table__cell--non-numeric" },
            { "data": "asignacion", "sClass": "mdl-data-table__cell--non-numeric" },
            { "data": "pty", "sClass": "mdl-data-table__cell--non-numeric" },
            { "data": "text", "sClass": "mdl-data-table__cell--non-numeric" },
            { "data": "pi", "sClass": "mdl-data-table__cell--non-numeric" },
            { "data": "ps", "sClass": "mdl-data-table__cell--non-numeric" },
            { "data": "confirmada", "sClass": "mdl-data-table__cell--non-numeric" },
            { "data": "ubicacion", "sClass": "mdl-data-table__cell--non-numeric" },
            { "data": "pir", "sClass": "mdl-data-table__cell--non-numeric" },
            { "data": "grupo", "sClass": "mdl-data-table__cell--non-numeric" }
        ],
        paging: false,
        responsive: true,
        "language": {
                "url": "http://cdn.datatables.net/plug-ins/1.10.7/i18n/Spanish.json"
            }
    });
    //frecuencia,asignacion,pty,text,pi,ps,confirmada,ubicacion,pir,grupo

    $('#search').keyup(function(){
         oTable.fnFilter($(this).val());
    })
    
    var tab1 = document.getElementById('tab-1');
    tab1.addEventListener('click', function() {
        oTable.api().ajax.url("data/malaga.txt").load();
    }, false);
    
    var tab2 = document.getElementById('tab-2');
    tab2.addEventListener('click', function() {
        oTable.api().ajax.url("data/fuengirola.txt").load();
    }, false);
    
    var tab3 = document.getElementById('tab-3');
    tab3.addEventListener('click', function() {
        oTable.api().ajax.url("data/almayate.txt").load();
    }, false);
    
    var tab4 = document.getElementById('tab-4');
    tab4.addEventListener('click', function() {
        oTable.api().ajax.url("data/antequera.txt").load();
    }, false);
    
    var tab5 = document.getElementById('tab-5');
    tab5.addEventListener('click', function() {
        oTable.api().ajax.url("data/calahonda.txt").load();
    }, false);
    
    var tab6 = document.getElementById('tab-6');
    tab6.addEventListener('click', function() {
        oTable.api().ajax.url("data/marbella.txt").load();
    }, false);
    
} );
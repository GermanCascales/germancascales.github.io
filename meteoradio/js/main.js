$(document).ready(function() {
    var oTable = $('#myTable').dataTable({
        "ajax": "data/json.txt",
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
        oTable.api().ajax.url("data/json.txt").load();
    }, false);
    
    var tab2 = document.getElementById('tab-2');
    tab2.addEventListener('click', function() {
        oTable.api().ajax.url("data/json1.txt").load();
    }, false);
    
    var tab3 = document.getElementById('tab-3');
    tab3.addEventListener('click', function() {
        oTable.api().ajax.url("data/json.txt").load();
    }, false);
    
} );
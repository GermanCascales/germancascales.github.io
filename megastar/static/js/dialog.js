$(function () {
    $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        dialogClass: "no-close",
        maxHeight: 600,
        show: {
            effect: "puff",
            duration: 500
        },
        hide: {
            effect: "drop",
            duration: 500
        }
    });
    
    $("#dialogRadio").dialog({
        autoOpen: false,
        modal: true,
        dialogClass: "no-close",
        maxHeight: 600,
        show: {
            effect: "puff",
            duration: 500
        },
        hide: {
            effect: "drop",
            duration: 500
        }
    });
 
    $("#openerLyrics").click(function () {
        $("#dialog").dialog("open");
    });
    
    $("#openerRadio").click(function () {
        $("#dialogRadio").dialog("open");
    });
    
    $("#openerTemazoTortazo").click(function () {
        if (temazoTortazoActivo == 0) {
            $("#temazotortazo").html("<iframe src=\"https://www.lumicatch.com/viewer/l34257c8zEk1662\" frameborder=\"false\" scrolling=\"false\" style=\"width: 846px; height: 510px; z-index: 20;position: fixed;top: 50%;left: 50%; -webkit-transform: translate(-50%, -50%); -moz-transform: translate(-50%, -50%); -o-transform: translate(-50%, -50%); transform: translate(-50%, -50%);\"></iframe>");
            temazoTortazoActivo = 1;
        } else {
            $("#temazotortazo").html("");
            temazoTortazoActivo = 0;
        }
    });
     
    $("body").on("click", ".ui-widget-overlay", function () {
        $('#dialog').dialog("close");
        $('#dialogRadio').dialog("close");
    });
});
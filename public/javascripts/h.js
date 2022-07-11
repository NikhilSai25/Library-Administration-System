$(document).ready(function(){
    $("#changequote").on("submit",function(event){
        event.preventDefault();
        let value=$("#valuekashmir").val();

        $.ajax({
            url : "/ajax",
            method : "POST",
            contentType : "application/json",
            data : JSON.stringify({quote : value}),
            success : function(res){
                $("h1").html(`Quote : ${res.response}`);
            }
        })
    })
})
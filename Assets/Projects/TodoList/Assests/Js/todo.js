//check off Specific Todo by clicking
$("ul").on("click", "li", function(){
    $(this).toggleClass("completed")
    
});

//Click on X to delete Todo
$("ul").on("click", "span", function(event){
    $(this).parent().fadeOut(500, function(){
        $(this).remove();
    });
    event.stopPropagation();
});

$("input[type='text']").keypress(function(event){
    if(event.which === 13){
        //extracting value (new todo) from input
        var todoText = $(this).val();
        $(this).val("");
        // create a new Li and add to ul
        $("ul").append("<li><span><i class='fas fa-trash-alt'></i></span> " + todoText +"</li>")
    }
});


$(".fa-user-edit").click(function(){
    $("input[type='text']").fadeToggle();
});
$(function(){
   $("#faqSearch").click(function(){
       //alert(2)
       if($("#faqSearchKeyword").val()!=''){
           //if($(".back_index").is(":hidden")){
           //    alert(1)
           //    $(".back_index").hide();
           //    $(".news_index ").show();
           //    $(".save_index").show();
           //}else{
               $(".back_index").show();
               $(".news_index ").hide();
               $(".save_index").hide();
           //}

       }

   });
    $(".back_index").click(function(){
        $(".back_index").hide();
        $(".news_index ").show();
        $(".save_index").show();
    })
});
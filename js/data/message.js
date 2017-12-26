$(function(){
    $(".x-navigation li").each(function(i,obj){
        if($(obj).find("a").attr("href")=="message.html"){
            $(obj).addClass("active");
        }
    });
    $('.input-group-btn').click(function(){
        var searchVal=$("#faqSearchKeyword").val();
        var datas={};
        datas.title=searchVal;
        base.data_conn("v1/cms/messages",datas,getMessages,"get");
    });
    $(".back_index").click(function(){
        $("#faqSearchKeyword").val("");
        base.data_conn("v1/cms/messages",'',getMessage,"get");
    });
    //消息列表展示
    base.data_conn("v1/cms/messages","",getMessage,"get");
    function getMessages(e){
        if(e.data==''){
            $("#faqSearchKeyword").val("");
            $(".sucess").html("内容为空").show();
            setTimeout(function(){$(".sucess").html("操作成功").hide();},1000);
            //return;
        }
        getMessage(e)
    }
    function getMessage(e){
        var data= e.data,getData='',ptype;
        for(var i in data){
            switch(data[i].ptype){
                case 1:
                    ptype="IOS";
                    break;
                case 2:
                    ptype="安卓";
                    break;
                default :
                    ptype="安卓/IOS";

            }
            getData+='<tr id="'+data[i].id+'" ptype="'+data[i].ptype+'"><td>'+(parseInt(i)+1)+'</td><td class="title">'+data[i].title+'</td><td class="content">'+data[i].content+'</td><td class="url" datas="'+data[i].url+'">'+data[i].url+'</td><td>'+ptype+'</td><td class="push_time">'+data[i].push_time+'</td>';
            getData+='<td>'+data[i].gmt_create+'</td><td>'+data[i].gmt_modified+'</td><td class="state">'+(data[i].state==0?"草稿":"已发送")+'</td>';
            getData+='<td class="btnBox">';
            if(data[i].state==0){
                getData+='<button  type="button" class="btn btn-success sendM">发送</button>';
            }
            getData+='<button  type="button" class="btn btn-info editM">编辑</button><button  type="button" class="btn btn-info delM">删除</button></td>';
            getData+='</tr>';
        }
        $("#sortable").html(getData);
        $(".url").each(function(i,obj){
            if($(this).html()!=''){
                $(this).text($(this).attr("datas"));
            }
        });
        $('.page-content').css('height',$(document).height());
    }
//    删除消息
    $("#sortable").on("click",".delM",function(e){
        if(!confirm("确认删除吗？")){
            return;
        }
        var delId=$(this).parent().parent("tr").attr("id");
        base.data_conn("v1/cms/message/"+delId,null,delMessage,"delete");
        function delMessage(e){
            if(e.code==0){
                $(".sucess").show();
                setTimeout(function(){$(".sucess").hide();},1000);
                base.data_conn("v1/cms/messages","",getMessage,"get");
            }
        }
    });
//    编辑消息
    $("#sortable").on("click",".editM",function(){
        var time=$(this).parent().siblings(".push_time").html();
        var push_time=time.split(" ");
        var messageId=$(this).parent().parent("tr").attr("id");
        var data={
            title:$(this).parent().siblings(".title").html(),
            urls:$(this).parent().siblings(".url").text(),
            contents:$(this).parent().siblings(".content").html(),
            push_time:time,
            push_timedate:push_time[0],
            push_timet:push_time[1],
            state:($(this).parent().siblings(".state").html()=="草稿"?0:1),
            ptype:$(this).parent().parent("tr").attr("ptype")
        }
        data=JSON.stringify(data);
        localStorage.setItem("data",data);
        window.location="newsMessage.html?id="+messageId;
    });
//    发送消息
    $("#sortable").on("click",".sendM",function(e){
        if(!confirm("确认发送吗？")){
            return;
        }
        var sendId=$(this).parent().parent("tr").attr("id");
        var sendData={};
        sendData.ptype=$(this).parent().parent("tr").attr("ptype");
        base.data_conn("v1/cms/message/"+sendId,sendData,sendMessage,"put");
        function sendMessage(e){
            if(e.code==0){
                $(".sucess").show();
                setTimeout(function(){$(".sucess").hide();},1000);
                base.data_conn("v1/cms/messages","",getMessage,"get");
            }
        }
    });
});
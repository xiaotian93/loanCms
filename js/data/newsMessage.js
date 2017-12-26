$(function(){
    $('.timepicker24').timepicker({
        'defaultTime':false,
        'showMeridian':false
    });
    $(".x-navigation li").each(function(i,obj){
        if($(obj).find("a").attr("href")=="message.html"){
            $(obj).addClass("active");
        }
    });
    if(getUrlParam("id")==null){
        //新建消息
        //$('#reservation').val(moment().subtract('days', 1).format('YYYY-MM-DD'));
        clickBtn("v1/cms/message",addMessage,"post",0);
        var breadcrumb='';
        breadcrumb+='<li><a href="message.html">消息管理</a></li><li class="active">新建消息</li>';
        $(".breadcrumb").html(breadcrumb);
    }else{
        //编辑消息
        var breadcrumb='';
        breadcrumb+='<li><a href="message.html">消息管理</a></li><li class="active">编辑消息</li>';
        $(".breadcrumb").html(breadcrumb);
        var data=localStorage.getItem("data");
        data=JSON.parse(data);console.log(data)
        $(".title").val(data.title);
        $(".lianjie").val(data.urls);
        $(".content").val(data.contents);
        if(data.push_time!="null"){
            $(".push_timedate").val(data.push_timedate);
            $(".push_timet").val(data.push_timet==null?"":data.push_timet);
        }else{
            $(".push_timedate").val("");
            $(".push_timet").val("");
        }

        if(data.ptype==0){
            $(".bottom input").each(function(i,obj){
                $(obj).attr("checked","checked");
            })
        }else{
            $(".bottom input").each(function(i,obj){
                if($(obj).val()==data.ptype){
                    $(obj).attr("checked","checked");
                }
            })
        }
        clickBtn("v1/cms/message/update",editMessage,"post",data.state)
    }
    function clickBtn(path,backf,type,state){
        $(".addMessage").click(function(){
            var ptypes=0;
            $(".bottom input").each(function(i,obj){
                if($(obj).prop("checked")){
                    ptypes+=parseInt($(obj).val());
                }
            });
            var getData=new FormData();
            var push_time;
            push_time=$(".push_timedate").val()+" "+$(".push_timet").val();
            getData.append("title",$(".title").val());
            getData.append("url",$(".lianjie").val());
            getData.append("content",$(".content").val());
            getData.append("push_time",push_time);
            getData.append("state",state);
            getData.append("ptype",ptypes);
            if(getUrlParam("id")!=null){
                getData.append("id",getUrlParam("id"));
            }
            if($(".title").val()==''){
                alert("请输入标题");
            }else if($(".content").val()==''){
                alert("请输入内容");
            }else if(($(".title").val()!='')&&($(".content").val()!='')){
                base.data_send(path,getData,backf,type);
            }
        });
    }
    function addMessage(e){
        if(e.code==0){
            //console.log(e)
            $(".sucess").show();
            //$(".title").val("");
            //$(".lianjie").val("");
            //$(".content").val("");
            setTimeout(function(){
                $(".success").hide();
                window.location="message.html";
            },300)

        }else{
            alert("新建失败");
        }
    }
    function editMessage(e){
        if(e.code==0){
            $(".sucess").show();
            //$(".title").val("");
            //$(".lianjie").val("");
            //$(".content").val("");
            setTimeout(function(){
                $(".success").hide();
                window.location="message.html";
            },300)
        }else{
            alert("修改失败");
        }
    }
});
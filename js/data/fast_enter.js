$(function(){
    //对应tab选中
    $(".x-navigation li").each(function(i,obj){
        if($(obj).find("a").attr("href")=="fast_enter.html"){
            $(obj).addClass("active");
        }
    });
    //搜索产品
    $('.input-group-btn').click(function(){
        var searchVal=$("#faqSearchKeyword").val();
        var datas={};
        datas.title=searchVal;
        datas.ptype=3;
        //datas.gid=$(".enterList.active").attr("id");
        base.data_conn("v1/cms/entrance/"+$(".enterList.active").attr("id"),datas,getEnterlists,"get");
    });
    //搜索返回列表页
    $(".back_index").click(function(){
        $("#faqSearchKeyword").val("");
        base.data_conn("v1/cms/entrance/"+$(".enterList.active").attr("id"),null,getEnterlist,"get");
    });
    //对应入口选中
    if(getUrlParam("eid")!=null){
        $(".enterList").each(function(i,obj){
            $(obj).removeClass("active");
        })
        $("#"+getUrlParam("eid")).addClass("active");
    }
    //获取入口列表
    $(".enterList").click(function(){
        base.data_conn("v1/cms/entrance/"+$(this).attr("id"),null,getEnterlist,"get");
    });
   base.data_conn("v1/cms/entrance/"+$(".enterList.active").attr("id"),null,getEnterlist,"get");
    function getEnterlists(e){
        if(e.data==''){
            $("#faqSearchKeyword").val("");
            $(".sucess").html("内容为空").show();
            setTimeout(function(){$(".sucess").html("操作成功").hide();},1000);
            //return;
        }
        getEnterlist(e)
    }
    function getEnterlist(e){
        var data= e.data,getData='',num=1;
        console.log(data);
        for(var i in data){
            getData+='<tr id="'+data[i].id+'" gtype="'+data[i].gtype+'" online_date="'+data[i].online_date+'" offline_date="'+data[i].offline_date+'">';
            getData+='<td>'+(num++)+'</td><td class="title">'+data[i].title+'</td><td class="image" imgSave="'+data[i].image+'"><img src="'+(host+data[i].image)+'"/></td>';
            if(data[i].url==''){
                getData+='<td class="urls urlList">'+'列表'+'</td>';
            }else{
                getData+='<td class="urls" datas="'+data[i].url+'">'+data[i].url+'</td>';
            }

            getData+='<td class="gmt_create">'+data[i].gmt_create+'</td><td class="gmt_modified">'+data[i].gmt_modified+'</td><td class="state">'+(data[i].state==1?"上线":"下线")+'</td><td>'+data[i].clicktimes+'</td>';
            getData+='<td>';
            if(data[i].state==0){
                getData+='<button  type="button" class="btn btn-success upline">上线</button>';
            }else{
                getData+='<button  type="button" class="btn btn-warning downline">下线</button>';
            }
            getData+='<button  type="button" class="btn btn-info editP">编辑</button><button  type="button" class="btn btn-info delP">删除</button></td></tr>';
        }
        $("#sortables").html(getData);
        $(".urls").each(function(i,obj){
            if($(this).html()!="列表"){
                $(this).text($(this).attr("datas"));
            }
        });
        $('.page-content').css('height',$(document).height());
    }
//    新建入口列表信息
    $(".add").click(function(){
        var enterId=$(".enterList.active").attr("id");
        window.location="newsFast_enter.html?eid="+enterId;
    });
//    删除入口列表信息
    $("#loanEnter").on("click",".delP",function(){
        if(!confirm("确认删除吗？")){
            return;
        }
        var enter_id=$(this).parent().parent("tr").attr("id");
        var states=$(this).parent().siblings(".state").html();
        if(states=="下线"){
            base.data_conn("v1/cms/gallery/"+enter_id,null,delEnter,"delete");
        }else{
            alert("请调整为下线后再删除");
        }
        function delEnter(e){
            if(e.code==2000){
                $(".sucess").show();
                setTimeout(function(){$(".sucess").hide();},1000);
                var eids=$(".enterList.active").attr("id");
                base.data_conn("v1/cms/entrance/"+eids,null,getEnterlist,"get");
            }
        }
    });

//    编辑入口列表信息
    $("#loanEnter").on("click",".editP",function(){
        var editId=$(this).parent().parent("tr").attr("id");
        var eids=$(".enterList.active").attr("id");
        var data={
            title:$(this).parent().siblings(".title").html(),
            url:$(this).parent().siblings(".urls").text(),
            image:$(this).parent().siblings(".image").attr("imgSave"),
            online_date:$(this).parent().parent().attr("online_date"),
            offline_date:$(this).parent().parent().attr("offline_date"),
            gtype:$(this).parent().parent().attr("gtype"),
            state:($(this).parent().siblings(".state").html()=="下线"?0:1)
        };
        data=JSON.stringify(data);
        localStorage.setItem("data",data);
        console.log(data)
        window.location="newsFast_enter.html?eid="+eids+"&id="+editId;
    })
//上下线传参函数
    function clickEnter(datas,path,backfu,types,state){
            var getData=new FormData();
            var online_date=$(".online_date").val()+" "+$(".online_time").val();
            var offline_date=$(".offline_date").val()+" "+$(".offline_time").val();
            getData.append("title",$(datas).parent().siblings(".title").html());
            getData.append("eid",$(".enterList.active").attr("id"));
            getData.append("id",$(datas).parent().parent("tr").attr("id"));
            getData.append("image",$(datas).parent().siblings(".image").attr("imgSave"));
            getData.append("gtype",$(datas).parent().parent().attr("gtype"));
            getData.append("url",($(datas).parent().siblings(".urls").html()=="列表"?"":$(datas).parent().siblings(".urls").text()));

        if($(datas).parent().parent().attr("offline_date")!='null'){
            var curTime=new Date().getTime();
            var offTime=new Date($(datas).parent().parent().attr("offline_date")).getTime();
            if(curTime<offTime){
                getData.append("offline_date",'');
                getData.append("online_date",'');
            }else{
                getData.append("offline_date",$(datas).parent().parent().attr("offline_date"));
            }
        };
        if($(datas).parent().parent().attr("online_date")!='null'){
            getData.append("online_date",$(datas).parent().parent().attr("online_date"));
        }
            getData.append("state",state);
            base.data_send(path,getData,backfu,types);
    }
    //上线处理
    $("#loanEnter").on("click",".upline",function(){
        if(!confirm("确认上线吗？")){
            return;
        }
        clickEnter(this,"v1/cms/gallery/update/status",upline,"post",1);
    });
    function upline(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){$(".sucess").hide();},1000);
            base.data_conn("v1/cms/entrance/"+$(".enterList.active").attr("id"),null,getEnterlist,"get");        }
    }
//    下线处理
    $("#loanEnter").on("click",".downline",function(){
        if(!confirm("确认下线吗？")){
            return;
        }
        clickEnter(this,"v1/cms/gallery/update/status",downline,"post",0);
    });
    function downline(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){$(".sucess").hide();},1000);
            base.data_conn("v1/cms/entrance/"+$(".enterList.active").attr("id"),null,getEnterlist,"get");        }
    }

//    查询入口中列表详情页
    $("#loanEnter").on("click",".urlList",function(){
            var gid=$(this).parent("tr").attr("id");
            window.location="productLists.html?gid="+gid+"&eid="+$(".enterList.active").attr("id");
    });
});
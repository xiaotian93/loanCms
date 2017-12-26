$(function(){
    $(".x-navigation li").each(function(i,obj){
        if($(obj).find("a").attr("href")=="update.html"){
            $(obj).addClass("active");
        }
    });
    $(".x-navigation li").each(function(i,obj){
        if($(obj).find("a").attr("href")=="update.html"){
            $(obj).addClass("active");
        }
    });
    $('.input-group-btn').click(function(){
        var searchVal=$("#faqSearchKeyword").val();
        var datas={};
        datas.title=searchVal;
        base.data_conn("v1/cms/checkupdates/"+$(".update.active").attr("ptype"),datas,getsearchCheckupdates,"get");
    });
    if(getUrlParam("ptype")!=null){
        $(".update").each(function(i,obj){
            $(obj).removeClass("active");
        });
        $("#"+getUrlParam("ptype")).addClass("active");
    }
    $(".update").click(function(){
        base.data_conn("v1/cms/checkupdates/"+$(this).attr("ptype"),null,getCheckupdates,"get");
    });
    base.data_conn("v1/cms/checkupdates/"+$(".update.active").attr("ptype"),null,getCheckupdates,"get");
    function getsearchCheckupdates(e){

    }
    function getCheckupdates(e){
        var data= e.data,getData='',num=1;
        for(var i in data){
            getData+='<tr id="'+data[i].id+'" forceupdate="'+data[i].forceupdate+'" online_date="'+data[i].online_date+'" offline_date="'+data[i].offline_date+'" md="'+data[i].md5+'"><td>'+(num++)+'</td><td class="version_name">'+data[i].version_name+'</td><td class="version_code">'+data[i].version_code+'</td><td class="image" imgSave="'+data[i].image+'"><img src="'+host+data[i].image+'"/></td><td class="updatelog">'+data[i].updatelog+'</td>';
            getData+='<td class="apk_url" apk_url="'+data[i].apk_url+'">'+(data[i].apk_url==null?"无":host+data[i].apk_url)+'</td><td class="forceupdate">'+(data[i].forceupdate==1?"是":"否")+'</td>';
            getData+='<td>'+data[i].gmt_create+'</td><td>'+data[i].gmt_modified+'</td><td class="state">'+(data[i].state==0?"未上线":"已上线")+'</td>';
            getData+='<td>';
            if(data[i].state==0){
                getData+='<button  type="button" class="btn btn-success upline">上线</button>';
            }
            getData+='<button  type="button" class="btn btn-info editP">编辑</button><button  type="button" class="btn btn-info delP">删除</button></td></tr>';

        }
        $(".dataBody").html(getData);
        $('.page-content').css('height',$(document).height());
    }
//    新建版本管理
    $(".newsUpdate").click(function(){
        var update=$(".update.active").attr("ptype");
        window.location="newsUpdate.html?ptype="+update;
    })
//    删除版本管理
    $("#sortable").on("click",".delP",function(){
        if(!confirm("确认删除吗？")){
            return;
        }
        var delId=$(this).parent().parent("tr").attr("id");
        var states=$(this).parent().siblings(".state").html();
        //if(states=="未上线"){
            base.data_conn("v1/cms/checkupdate/"+delId,null,delProduct,"delete");
        //}else{
        //    alert("请调整为下线后再删除");
        //}
    });
    function delProduct(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){$(".sucess").hide();},1000);
            base.data_conn("v1/cms/checkupdates/"+$(".update.active").attr("ptype"),null,getCheckupdates,"get");
        }
    }
//编辑版本管理
    $("#sortable").on("click",".editP",function(){
        var editId=$(this).parent().parent("tr").attr("id");
        var data={
            version_name:$(this).parent().siblings(".version_name").html(),
            version_code:$(this).parent().siblings(".version_code").html(),
            updatelog:$(this).parent().siblings(".updatelog").html(),
            apk_url:$(this).parent().siblings(".apk_url").attr("apk_url"),
            forceupdate:($(this).parent().siblings(".forceupdate").html()=="是"?1:0),
            image:$(this).parent().siblings(".image").attr("imgSave"),
            online_date:$(this).parent().parent().attr("online_date"),
            offline_date:$(this).parent().parent().attr("offline_date"),
            md:$(this).parent().parent().attr("md")
        };
        data=JSON.stringify(data);
        localStorage.setItem("data",data);
        window.location="newsUpdate.html?id="+editId+"&ptype="+$(".update.active").attr("ptype");
    })
    //    上线处理
    //function clickProduct(datas,path,backfu,type,state){
    //    var getData=new FormData();
    //    getData.append("version_name",$(datas).parent().siblings(".version_name").html());
    //    getData.append("version_code",$(datas).parent().siblings(".version_code").html());
    //    getData.append("updatelog",$(datas).parent().siblings(".updatelog").html());
    //    getData.append("forceupdate",$(datas).parent().parent().attr("forceupdate"));
    //    getData.append("md5",$(datas).parent().parent().attr("md"));
    //    getData.append("id",parseInt($(datas).parent().parent().attr("id")));
    //    getData.append("image",$(datas).parent().siblings(".image").attr("imgSave"));
    //    if($(datas).parent().parent().attr("offline_date")!='null'){
    //        var curTime=new Date().getTime();
    //        var offTime=new Date($(datas).parent().parent().attr("offline_date")).getTime();
    //        if(curTime<offTime){
    //            getData.append("offline_date",'');
    //            getData.append("online_date",'');
    //        }else{
    //            getData.append("offline_date",$(datas).parent().parent().attr("offline_date"));
    //        }
    //    };
    //    if($(datas).parent().parent().attr("online_date")!='null'){
    //        getData.append("online_date",$(datas).parent().parent().attr("online_date"));
    //    }
    //    getData.append("ptype",$(".update.active").attr("ptype"));
    //    getData.append("state",state);
    //    //getData.append("deadline_to",40);
    //    console.log(getData);
    //    base.data_send(path,getData,backfu,type);
    //}
    $("#sortable").on("click",".upline",function(){
        if(!confirm("确认上线吗？")){
            return;
        }
        //clickProduct(this,"v1/cms/checkupdate/update",upline,"post",1);
        var data=new FormData();
        data.append("id",parseInt($(this).parent().parent().attr("id")));
        data.append("state","1");
        base.data_send("v1/cms/checkupdate/update/state",data,upline,"post");
    });
    function upline(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){$(".sucess").hide();},1000);
            base.data_conn("v1/cms/checkupdates/"+$(".update.active").attr("ptype"),null,getCheckupdates,"get");

        }
    }
//    下线处理
//    $("#sortable").on("click",".downline",function(){
//        clickProduct(this,"v1/cms/checkupdate/update",downline,"post",0);
//    });
//    function downline(e){
//        if(e.code==2000){
//            alert("操作成功");
//            base.data_conn("v1/cms/checkupdates/"+$(".update.active").attr("ptype"),null,getCheckupdates,"get");        }
//    }
});
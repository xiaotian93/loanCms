$(function(){
    //对应客户端选中
    if(getUrlParam("ptype")!=null){
        $(".update").each(function(i,obj){
            $(obj).removeClass("active");
            if($(obj).attr("ptype")==getUrlParam("ptype")){
                $(obj).addClass("active");
            }
        });
    }
    //当前tab选中
    $(".x-navigation li").each(function(i,obj){
        if($(obj).find("a").attr("href")=="banner.html"){
            $(obj).addClass("active");
        }
    });
    //搜索产品
    $('.input-group-btn').click(function(){
        var searchVal=$("#faqSearchKeyword").val();
        var datas={};
        datas.title=searchVal;
        datas.ptype=$(".active.update").attr("ptype");
        base.data_conn("v1/cms/banners",datas,bannerLists,"get");
    });
    //搜索返回列表页
    $(".back_index").click(function(){
        $("#faqSearchKeyword").val("");
        base.data_conn("v1/cms/banners?ptype="+$(".active.update").attr("ptype"),null,bannerList,"get");
    });
    //选择客户端对应列表
    $(".update").click(function(){
        var changeList={};
        changeList.ptype=$(this).attr("ptype");
        base.data_conn("v1/cms/banners",changeList,bannerList,"get");
    });
    base.data_conn("v1/cms/banners?ptype="+$(".active.update").attr("ptype"),null,bannerList,"get");
    function bannerLists(e){
        if(e.data==''){
            $("#faqSearchKeyword").val("");
            $(".sucess").html("内容为空").show();
            setTimeout(function(){$(".sucess").html("操作成功").hide();},1000);
            //return;
        }
        bannerList(e);
    }
    function bannerList(e){
        var data= e.data,getData='',num=1;
        for(var i in data){
            getData+='<tr id="'+data[i].id+'" interest_type="'+data[i].interest_type+'" online_date="'+data[i].online_date+'" offline_date="'+data[i].offline_date+'" ordinal="'+data[i].ordinal+'"><td>'+(num++)+'</td><td class="title">'+data[i].title+'</td><td class="image" imgSave="'+data[i].image+'"><img src="'+host+data[i].image+'"/></td>';
            getData+='<td class="urls" datas="'+data[i].url+'">'+data[i].url+'</td>';
            getData+='<td>'+data[i].gmt_create+'</td><td>'+data[i].gmt_modified+'</td><td class="state">'+(data[i].state==0?"下线":"上线")+'</td><td>'+data[i].clicktimes+'</td>';
            getData+='<td>';
            if(data[i].state==0){
                getData+='<button  type="button" class="btn btn-success upline">上线</button>';
            }else{
                getData+='<button  type="button" class="btn btn-warning downline">下线</button>';
            }
            getData+='<button  type="button" class="btn btn-info editBanner">编辑</button><button  type="button" class="btn btn-info delBanner">删除</button></td></tr>';
        }
        $("#sortable").html(getData);
        $(".urls").each(function(i,obj){
            $(this).text($(this).attr("datas"));
        });
        $('.page-content').css('height',$(document).height());
    }
//    删除banner
    $("#sortable").on("click",".delBanner",function(){
        if(!confirm("确认删除吗？")){
            return;
        }
        var delId=$(this).parent().parent("tr").attr("id");
        var states=$(this).parent().siblings(".state").html();
        if(states=="下线"){
            base.data_conn("v1/cms/banner/"+delId,null,delProduct,"delete");
        }else{
            alert("请调整为下线后再删除");
        }

    });
    function delProduct(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){$(".sucess").hide();},1000);
            base.data_conn("v1/cms/banners?ptype="+$(".active.update").attr("ptype"),null,bannerList,"get");
        }
    }
    //    编辑banner
    $("#sortable").on("click",".editBanner",function(){
        var editId=$(this).parent().parent("tr").attr("id");
        var data={
            title:$(this).parent().siblings(".title").html(),
            url:$(this).parent().siblings(".urls").text(),
            image:$(this).parent().siblings(".image").attr("imgSave"),
            online_date:$(this).parent().parent().attr("online_date"),
            offline_date:$(this).parent().parent().attr("offline_date"),
            state:($(this).parent().siblings(".state").html()=="下线"?0:1),
            ordinal:$(this).parent().parent().attr("ordinal")
        };
        data=JSON.stringify(data);
        localStorage.setItem("data",data);
        window.location="newsBanner.html?id="+editId+"&ptype="+$(".active.update").attr("ptype");
    })
//    修改贷款产品排序
    $(".ordinal").click(function(){
        var newArr=[];
        var arr=$("#sortable").sortable("toArray",{attribute:"id"});
        for(var i in arr){
            var data={};
            data.pid=arr[i];
            data.ordinal=parseInt(i)+1;
            newArr.push(data);
        }
        console.log(newArr);
        base.data_conn("v1/cms/banner/order",newArr,newsOrdinal,"put");
    })
    function newsOrdinal(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){$(".sucess").hide();},1000);
            base.data_conn("v1/cms/banners?ptype="+$(".active.update").attr("ptype"),null,bannerList,"get");
        }
    }
//    上线处理
    function clickProduct(datas,path,backfu,type,state){
        var getData=new FormData();
        getData.append("title",$(datas).parent().siblings(".title").html());
        getData.append("url",$(datas).parent().siblings(".urls").text());
        getData.append("id",parseInt($(datas).parent().parent().attr("id")));
        getData.append("image",$(datas).parent().siblings(".image").attr("imgSave"));
        getData.append("ptype",$(".active.update").attr("ptype"));
        if($(datas).parent().parent().attr("online_date")!='null'){
            getData.append("online_date",$(datas).parent().parent().attr("online_date"));
        }
        if($(datas).parent().parent().attr("offline_date")!='null'){
            var curTime=new Date().getTime();
            var offTime=new Date($(datas).parent().parent().attr("offline_date")).getTime();
            if(curTime<offTime){
                getData.append("offline_date",'');
                getData.append("online_date",'');
            }else{
                getData.append("offline_date",$(datas).parent().parent().attr("offline_date"));
            }
        }
        getData.append("state",state);
        getData.append("ordinal",$(datas).parent().parent().attr("ordinal"));
        base.data_send(path,getData,backfu,type);
    }
    $("#sortable").on("click",".upline",function(){
        if(!confirm("确认上线吗？")){
            return;
        }
        clickProduct(this,"v1/cms/banner/update",upline,"post",1);
    });
    function upline(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){$(".sucess").hide();},1000);
            base.data_conn("v1/cms/banners?ptype="+$(".active.update").attr("ptype"),null,bannerList,"get");
        }
    }
//    下线处理
    $("#sortable").on("click",".downline",function(){
        if(!confirm("确认下线吗？")){
            return;
        }
        clickProduct(this,"v1/cms/banner/update",downline,"post",0);
    });
    function downline(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){$(".sucess").hide();},1000);
            base.data_conn("v1/cms/banners?ptype="+$(".active.update").attr("ptype"),null,bannerList,"get");
        }
    }
//    新建banner
    $("#btn2").click(function(){
        window.location="newsBanner.html?ptype="+$(".active.update").attr("ptype");
    })
});
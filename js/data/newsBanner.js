$(function(){
    $('.timepicker24').timepicker({
        'defaultTime':false,
        'showMeridian':false
    });
    $(".x-navigation li").each(function(i,obj){
        if($(obj).find("a").attr("href")=="banner.html"){
            $(obj).addClass("active");
        }
    });
    if(getUrlParam("id")==null){
        //新建产品
        $(".originalImg").hide();
        $(".delImg").hide();
        var breadcrumb='';
        breadcrumb+='<li class=""><a href="index.html">banner图管理</a></li><li>'+(getUrlParam("ptype")==2?"安卓":"iOS")+'</li><li class="active">新建banner</li>';
        $(".breadcrumb").html(breadcrumb);
        //$('.reservation ').val(moment().subtract('days', 1).format('YYYY-MM-DD'));
        clickProduct("v1/cms/banner",addBanner,"post");
    }else{
        //    编辑产品
        //    图片处理
        $(".logoImg").hide();
        $(".delImg").click(function(){
            $(this).hide();
            $(".originalImg").hide();
            $(".logoImg").show().addClass("choseImg");
        });
        var breadcrumb='';
        breadcrumb+='<li class=""><a href="index.html">banner图管理</a></li><li>'+(getUrlParam("ptype")==2?"安卓":"iOS")+'</li><li class="active">编辑banner</li>';
        $(".breadcrumb").html(breadcrumb);
        var data=localStorage.getItem("data");
        data=JSON.parse(data);
        $(".title").val(data.title).attr({"state":data.state,"ordinal":data.ordinal});
        $(".lianjie").val(data.url);
        $(".originalImg").attr({"src":host+data.image,"imgSave":data.image});
        if(data.online_date!='null'){
            var online=data.online_date.split(" ");
            $(".online_date").val(online[0]);
            $(".online_time").val(online[1]);
        }
        if(data.offline_date!='null'){
            var offline=data.offline_date.split(" ");
            $(".offline_date").val(offline[0]);
            $(".offline_time").val(offline[1]);
        }
        clickProduct("v1/cms/banner/update",editBanner,"post");
    }
//    保存按钮点击事件
    function clickProduct(path,backfu,type){
        $(".saveProduct").click(function(){
            var getData=new FormData();
            var loan_limit=[];
            var online_date=$(".online_date").val()+" "+$(".online_time").val();
            var offline_date=$(".offline_date").val()+" "+$(".offline_time").val();console.log(typeof (transdate(offline_date)))
            getData.append("title",$(".title").val());
            getData.append("url",$(".lianjie").val());
            if(getUrlParam("id")!=null){
                getData.append("id",getUrlParam("id"));
                getData.append("state",$(".title").attr("state"));
                getData.append("ordinal",$(".title").attr("ordinal"));
            }else{
                getData.append("file",$(".logoImg")[0].files[0]);
            }
            if($(".logoImg").is(".choseImg")){
                getData.append("file",$(".logoImg")[0].files[0]);
            }else{
                getData.append("image",$(".originalImg").attr("imgSave"));
            }
            getData.append("online_date",online_date);
            getData.append("offline_date",offline_date);
            getData.append("ptype",getUrlParam("ptype"));
            if(($(".title").val()!='')&&($(".lianjie").val()!='')){
                base.data_send(path,getData,backfu,type);
            }else{
                alert("除选填条件外，其余条件不能为空");
            }

        })
    }
    function addBanner(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){
                $(".success").hide();
                window.location="banner.html?ptype="+getUrlParam("ptype");
            },200)
        }else{
            alert("新建失败");
        }
    }
    function editBanner(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){
                $(".success").hide();
                window.location="banner.html?ptype="+getUrlParam("ptype");
            },200)
        }else{
            alert("修改失败");
        }
    }

});

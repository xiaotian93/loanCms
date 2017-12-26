$(function(){
   $(".type").change(function(){
           var val=$(".type>option:selected").html();
           if(val=="落地页链接"){
               $(".type_a").show();
               $(".type_t").hide();
           }else{
               $(".type_a").hide();
               $(".type_t").show();
           }
       }
   );
    $('.timepicker24').timepicker({
        'defaultTime':false,
        'showMeridian':false
    });
    $(".x-navigation li").each(function(i,obj){
        if($(obj).find("a").attr("href")=="fast_enter.html"){
            $(obj).addClass("active");
        }
    });
//    api
    function clickEnter(path,backfu,types){
        $(".saveEnter").click(function(){
            if($(".type>option:selected").val()==2){
                $(".urlContent").val("");
            }
            var getData=new FormData();
            var online_date=$(".online_date").val()+" "+$(".online_time").val();
            var offline_date=$(".offline_date").val()+" "+$(".offline_time").val();
            getData.append("title",$(".title").val());
            getData.append("eid",getUrlParam("eid"));
            if(getUrlParam("id")==null){
                getData.append("file",$(".file")[0].files[0]);

            }else{
                getData.append("id",getUrlParam("id"));
                getData.append("state",$(".title").attr("state"));
            }
            if($(".file").is(".choseImg")){
                getData.append("file",$(".file")[0].files[0]);
            }else{
                getData.append("image",$(".originalImg").attr("imgSave"));
            }
            getData.append("gtype",parseInt($(".type>option:selected").val()));
            getData.append("url",$(".urlContent").val());
            getData.append("online_date",online_date);
            getData.append("offline_date",offline_date);
            if(($(".title").val()!='')){
                base.data_send(path,getData,backfu,types);
            }else{
                alert("除选填条件外，其余条件不能为空");
            }
        })
    }

    if(getUrlParam("id")==null){
        //    添加快速入口列表信息
        $(".originalImg").hide();
        $(".delImg").hide();
        $('#reservation ').val(moment().subtract('days', 1).format('YYYY-MM-DD'));
        clickEnter("v1/cms/gallery",addEnter,"post");
        var breadcrumb='';
        breadcrumb+='<li><a href="fast_enter.html?eid='+getUrlParam("eid")+'">快速入口'+getUrlParam("eid")+'</a></li><li class="active">新建入口产品</li>';
        $(".breadcrumb").html(breadcrumb);
    }else{
    //    编辑快速入口列表信息
        $(".file").hide();
        $(".delImg").click(function(){
            $(this).hide();
            $(".originalImg").hide();
            $(".file").show().addClass("choseImg");
        });
        var breadcrumb='';
        breadcrumb+='<li><a href="fast_enter.html?eid='+getUrlParam("eid")+'">快速入口'+getUrlParam("eid")+'</a></li><li class="active">编辑入口产品</li>';
        $(".breadcrumb").html(breadcrumb);
        var data=localStorage.getItem("data");
        data=JSON.parse(data);
        $(".title").val(data.title).attr("state",data.state);
        $(".originalImg").attr({"src":host+data.image,"imgSave":data.image});
        var obj = $(".type>option");
        for(i=0;i<obj.length;i++){
            if(obj[i].value == data.gtype)
                obj[i].selected = true;
        }
        if(data.url=="列表"){
            $(".urlContent").val('');
            $(".type_a").hide();
            $(".type_t").show();
        }else{
            $(".urlContent").val(data.url);
        }
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
        clickEnter("v1/cms/gallery/update",exidEnter,"post");
    }

    function addEnter(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){
                $(".success").hide();
                window.location="fast_enter.html?eid="+getUrlParam("eid");
            },200)

        }else{
            alert("新建失败");
        }
    }
    function exidEnter(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){
                $(".success").hide();
                window.location="fast_enter.html?eid="+getUrlParam("eid");
            },200)

        }else{
            alert("修改失败");
        }
    }

});
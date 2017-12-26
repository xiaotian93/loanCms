$(function(){
    $('.timepicker24').timepicker({
        'defaultTime':false,
        'showMeridian':false
    });
    if(getUrlParam("ptype")==1){
        $(".apkBox").hide();
    }
    $(".x-navigation li").each(function(i,obj){
        if($(obj).find("a").attr("href")=="update.html"){
            $(obj).addClass("active");
        }
    });
    if(getUrlParam("id")==null){
        $(".originalImg").hide();
        $(".delImg").hide();
        $(".originalApk").hide();
        $(".delApk").hide();
        $('#reservation ').val(moment().subtract('days', 1).format('YYYY-MM-DD'));
        clickProduct("v1/cms/checkupdate",addCheckupdate,"post");
        var breadcrumb='';
        breadcrumb+='<li><a href="update.html?ptype='+getUrlParam("ptype")+'">'+(getUrlParam("ptype")==1?"IOS":"安卓")+'</a></li><li class="active">新建版本更新</li>';
        $(".breadcrumb").html(breadcrumb);
    }else{
        var breadcrumb='';
        breadcrumb+='<li><a href="update.html?ptype='+getUrlParam("ptype")+'">'+(getUrlParam("ptype")==1?"IOS":"安卓")+'</a></li><li class="active">编辑版本更新</li>';
        $(".breadcrumb").html(breadcrumb);
        $(".logoImg").hide();
        $(".delImg").click(function(){
            $(this).hide();
            $(".originalImg").hide();
            $(".logoImg").show().addClass("choseImg");
        });
        $(".apk").hide();
        //$("#box").show();
        $(".delApk").click(function(){
            $(this).hide();
            $(".originalApk").hide();
            $(".apk").show().addClass("choseApk");
        });
        var data=localStorage.getItem("data");
        data=JSON.parse(data);
        console.log(data)
        $(".version_name").val(data.version_name);
        $(".version_code").val(data.version_code);
        $(".updatelog").val(data.updatelog);
        $(".apk_url").val(data.apk_url);
        $(".originalImg").attr({"src":host+data.image,"imgSave":data.image});
        $(".loan_limit").val(data.loan_limit);
        $(".passing_rate").val(data.passing_rate);
        $(".originalApk").html(host+data.apk_url).attr("apk_url",data.apk_url);
        $("#box").html(data.md);
        if(data.forceupdate==1){
            $(".forceupdate").iCheck('check');
        }else{
            $(".forceupdate").removeAttr("checked");
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
        clickProduct("v1/cms/checkupdate/update",editCheckupdate,"post");
    }
    function clickProduct(path,backfu,type){
        $(".saveProduct").click(function(){
            var getData=new FormData();
            var loan_limit=[];
            var online_date=$(".online_date").val()+" "+$(".online_time").val();
            var offline_date=$(".offline_date").val()+" "+$(".offline_time").val();
            getData.append("version_name",$(".version_name").val());
            getData.append("version_code",$(".version_code").val());
            getData.append("updatelog",$(".updatelog").val());
            if(getUrlParam("id")!=null){
                getData.append("id",getUrlParam("id"));
            }else{
                getData.append("file",$(".logoImg")[0].files[0]);
                getData.append("apk",$(".apk")[0].files[0]);
            }
            if($(".logoImg").is(".choseImg")){
                getData.append("file",$(".logoImg")[0].files[0]);
            }else{
                getData.append("image",$(".originalImg").attr("imgSave"));
            }
            if($(".apk").is(".choseApk")){
                getData.append("apk",$(".apk")[0].files[0]);
            }else{
                getData.append("apk_url",$(".originalApk").attr("apk_url"));
            }
            getData.append("md5",$("#box").html());
            getData.append("ptype",getUrlParam("ptype"));
            //getData.append("apk_url",$(".apk_url").val());
            getData.append("online_date",online_date);
            getData.append("offline_date",offline_date);
            if($(".forceupdate").prop("checked")){
                getData.append("forceupdate",1)
            }else{
                getData.append("forceupdate",0)
            }

            console.log(getData);
            //alert($(".forceupdate").attr("checked"))

            if(($(".version_name").val()!='')&&($(".version_code").val()!="")&&($(".updatelog").val()!='')){
                base.data_send(path,getData,backfu,type);
            }else{
                alert("除选填条件外，其余条件不能为空");
            }
        })
    }
    function addCheckupdate(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){
                $(".success").hide();
                window.location="update.html?ptype="+getUrlParam("ptype");
            },200)
        }else{
            alert("新建失败");
        }

    }
    function editCheckupdate(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){
                $(".success").hide();
                window.location="update.html?ptype="+getUrlParam("ptype");
            },200)
        }else{
            alert("编辑失败");
        }

    }

//    md5
    document.getElementById("apk").addEventListener("change", function () {
        var fileReader = new FileReader(),
            box = document.getElementById('box'),
            blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,
            file = document.getElementById("apk").files[0],
            chunkSize = 2097152,
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            bs = fileReader.readAsBinaryString,
            spark = bs ? new SparkMD5() : new SparkMD5.ArrayBuffer();

        fileReader.onload = function (ee) {
            spark.append(ee.target.result);
            currentChunk++;

            if (currentChunk < chunks) {
                loadNext();
            } else {
                box.innerText =spark.end();
            }
        };

        function loadNext() {
            var start = currentChunk * chunkSize, end = start + chunkSize >= file.size ? file.size : start + chunkSize;
            if (bs) fileReader.readAsBinaryString(blobSlice.call(file, start, end));
            else fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }

        loadNext();
    });

});
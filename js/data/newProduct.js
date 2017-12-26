$(function(){
    $(".x-navigation li").each(function(i,obj){
        if($(obj).find("a").attr("href")=="ziliao.html"){
            $(obj).addClass("active");
        }
    });
    //上传流程图片
    $("#filename").change(function(){
        var fileName,form=new FormData();
        fileName = $(this).val();
        fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length-4);
        form.append("file",$(this)[0].files[0]);
        //console.log(filenameArr+"=="+$.inArray(fileName,filenameArr)+"=="+fileName)
        if($.inArray(fileName,filenameArr)>-1){

            if(!confirm("是否覆盖同名图片？")){
                return;
            }
        }
        base.data_send("v2/cms/product/uploadFlow",form,uploadFlow,"post");
        function uploadFlow(e){
            if(e.code==0){
                $(".sucess").show();
                setTimeout(function(){
                    $(".sucess").hide();
                },200);
                base.data_conn("v2/cms/product/flow/list","",getFlowlist,"get");
            }
        }
    });
    //获取流程图片
    var filenameArr=[];
    base.data_conn("v2/cms/product/flow/list","",getFlowlist,"get");
    function getFlowlist(e){
        if(e.code==0&& e.data!=''){
            var data= e.data,imgFlow='';
            for(var i in data){
                imgFlow+='<div class="imgBox" des="'+data[i].name+'" img_id="'+data[i].id+'"><img src="'+(host+data[i].imageUrl)+'" alt=""/></div>';
                filenameArr.push(data[i].name);
            }
            $(".img_lable").html(imgFlow);
        }else if(e.code!=0){
            alert("图片加载失败");
        }else if(e.data==''){

        }
    }
    if(getUrlParam("id")==null){
        //产品利率与贷款期限单位一致
        $(".interest_type").change(function(){
            var type=$(".interest_type option:selected").val();
            var deadline_types=$(".deadline_type>option");
            for(var i=0;i<deadline_types.length;i++){
                if(deadline_types[i].value == type){
                    deadline_types[i].selected = true;
                }
            }
            $(".deadline_type").selectpicker("refresh");
        });
        //新建产品
        $(".originalImg").hide();
        $(".delImg").hide();
        clickProduct("v2/cms/product/add",addProduct,"post");
    }else{
    //    编辑产品
    //    图片处理
        $(".logoImg").hide();
        $(".imgWord").hide();
        $(".delImg").click(function(){
            $(this).hide();
            $(".originalImg").hide();
            $(".logoImg").show().addClass("choseImg");
            $(".imgWord").show();
        });
        var editId=getUrlParam("id");
        var data=localStorage.getItem("data");
        data=JSON.parse(data);console.log(data)
        $(".title").val(data.title).attr({"state":data.state,"ordinal":data.ordinal,"ptype":data.ptype});
        $(".lianjie").val(data.url);
        $(".description").val(data.description);
        $(".interest_rate").val(parseFloat(data.interest_rate.substring(2)));
        $(".loan_limit_from").val(data.loan_limit_from);
        $(".loan_limit_to").val(data.loan_limit_to);
        $(".passing_rate").val(data.passing_rate);
        $(".product_tag").val(data.product_tag);
        $(".deadline_from").val(data.deadline_from);
        $(".deadline_to").val(data.deadline_to);
        $(".originalImg").attr({"src":host+data.image,"imgSave":data.image});
        $(".Requirements").val(data.condition=="null"?"":data.condition.replace("↵"," \n "));
        $(".flow").val(data.material=='null'?"":data.material.replace("↵"," \n "));
        $(".apply_success").val(data.successCount);
        $(".tagsinput").val(data.accountDeadlines.toString());
        //console.log(typeof data.flowImages)
        var flowImagesArr=data.flowImages.split(",");console.log(flowImagesArr)
        for(var j in flowImagesArr){
            $(".imgBox").each(function(i,obj){
                if($(obj).attr("img_id")==flowImagesArr[j]){
                    imgData='<div class="imgBox_chose fa fa-times" img_id="'+$(this).attr("img_id")+'"><img src="'+$(this).find("img").attr("src")+'" alt=""/><span>'+$(this).attr("des")+'</span></div>';
                    $(".img_lable_chose").append(imgData);
                    $(this).attr("click_one",true);
                    imgData='';
                }
            })
        }
        //客户端区分
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
        //是否分期
        if(data.instalment==1){
            $(".instalment").attr("checked","checked");
        }
        //利息类型选择
        var obj = $(".interest_type>option");
        for(i=0;i<obj.length;i++){
            if(obj[i].value == data.interest_type)
                obj[i].selected = true;
        }
            //放款期限类型
        var deadline_types=$(".deadline_type>option");
        for(i=0;i<deadline_types.length;i++){
            if(deadline_types[i].value == data.deadlineType)
                deadline_types[i].selected = true;
        }
            clickProduct("v2/cms/product/update",editProduct,"post");
            var breadcrumb='';
            breadcrumb+='<li class=""><a href="ziliao.html">资料库</a></li><li class="active">编辑产品</li>';
            $(".breadcrumb").html(breadcrumb);
    }
//    保存按钮点击事件
    function clickProduct(path,backfu,type){
        $(".saveProduct").click(function(){
            var ptypes= 0,accountDeadlines=[],flowImageIds=[];
            $(".bottom input").each(function(i,obj){
                if($(obj).prop("checked")){
                    ptypes+=parseInt($(obj).val());
                }
            });
            $("span[class=tag]").each(function(i,obj){
                accountDeadlines.push(parseInt($.trim($(obj).find("span").text())));
            });
            $(".imgBox_chose").each(function(i,obj){
                flowImageIds.push(parseInt($(obj).attr("img_id")));
            });
            //console.log(accountDeadlines,flowImageIds)
            var getData=new FormData();
            var loan_limit=[],loan_deadline=[];
            //var limit=$(".loan_limit").val();
            var online_date=$(".online_date").val()+" "+$(".online_time").val();
            var offline_date=$(".offline_date").val()+" "+$(".offline_time").val();
            //loan_limit=limit.split("-");
            var deadline=$(".deadline").val();
            //if(deadline.match("-")){
            //    loan_deadline=deadline.split("-");
                getData.append("deadlineFrom",parseInt($(".deadline_from").val()));
                getData.append("deadlineTo",parseInt($(".deadline_to").val()));
            //}else{
            //    getData.append("deadlineFrom",0);
            //    getData.append("deadlineTo",parseInt(deadline));
            //}
            if($(".instalment").prop("checked")){
                getData.append("instalment",1)
            }else{
                getData.append("instalment",0)
            }
            getData.append("accountDeadlines",accountDeadlines);
            getData.append("flowImageIds",flowImageIds);
            getData.append("ptype",ptypes==3?0:ptypes);
            getData.append("title",$(".title").val());
            getData.append("url",$(".lianjie").val());
            getData.append("descriptions",$(".description").val());
            getData.append("interestRate",parseFloat($(".interest_rate").val()));
            getData.append("interestType",parseInt($(".interest_type>option:selected").val()));
            getData.append("deadlineType",parseInt($(".deadline_type>option:selected").val()));
            getData.append("successCount",$(".apply_success").val());
            getData.append("condition",$(".Requirements").val());
            getData.append("material",$(".flow").val());
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
            getData.append("loanLimitFrom",parseInt($(".loan_limit_from").val()));
            getData.append("loanLimitTo",parseInt($(".loan_limit_to").val()));
            getData.append("passingRate",parseFloat($(".passing_rate").val()));
            getData.append("tag",$(".product_tag").val());
            $(".tag").each(function(i,obj){
                if((parseInt($.trim($(obj).find("span").text()))<$(".deadline_from").val())||(parseInt($.trim($(obj).find("span").text()))>$(".deadline_to").val())){
                    alert("期限值需在放款期限内");
                    return;
                }else{
                    return;
                }
            });
            if(($(".title").val()!='')&&($(".lianjie").val()!='')&&($(".description").val()!='')){
                base.data_send(path,getData,backfu,type);
            }else{
                alert("除选填条件外，其余条件不能为空");
            }
        })
    }
    //申请流程选择事件
    var imgData='';
    function imgClick(data){
        $(".img_lable").on("click",data,function(){
            var that=this;
            if($(that).attr("click_one")=="true"){
                $(".sucess").show().html("该流程已存在");
                setTimeout(function(){
                    $(".sucess").hide();
                },1000);
                return;
            }
            imgData='<div class="imgBox_chose fa fa-times" img_id="'+$(that).attr("img_id")+'"><img src="'+$(that).find("img").attr("src")+'" alt=""/><span>'+$(that).attr("des")+'</span></div>';
            $(".img_lable_chose").append(imgData);
            $(that).attr("click_one",true);
            imgData='';
        });
    }
    imgClick(".imgBox");
    //删除已选流程
    $(".img_lable_chose").on("click",".imgBox_chose",function(){
       if(!confirm("是否删除?")){
           return;
       }
        var that=this;
        $(that).remove();
        $(".imgBox[img_id="+$(that).attr("img_id")+"]").attr("click_one",false);
    });
    function addProduct(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){
                $(".sucess").hide();
                window.location="ziliao.html";
            },200)
        }else{
            alert("新建失败");
        }
    }
    function editProduct(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){
                $(".success").hide();
                window.location="ziliao.html";
            },200)
        }else{
            alert("修改失败");
        }
    }

});

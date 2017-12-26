$(function(){
    $('.timepicker24').timepicker({
        'defaultTime':false,
        'showMeridian':false
    });
    $(".x-navigation li").each(function(i,obj){
        if($(obj).find("a").attr("href")=="fast_enter.html"){
            $(obj).addClass("active");
        }
    });
    var breadcrumb='';
    breadcrumb+='<li><a href="fast_enter.html?eid='+getUrlParam("eid")+'">快速入口'+getUrlParam("eid")+'</a></li><li class="active">产品列表</li>';
    $(".breadcrumb").html(breadcrumb);
    $('.input-group-btn').click(function(){
        var searchVal=$("#faqSearchKeyword").val();
        var datas={};
        datas.title=searchVal;
        //datas.gid=$(".enterList.active").attr("id");
        base.data_conn("v1/cms/gallerys/"+getUrlParam("gid"),datas,productLists,"get");
    });
    $(".back_index").click(function(){
        $("#faqSearchKeyword").val("");
        base.data_conn("v1/cms/gallerys/"+getUrlParam("gid"),null,productList,"get");
    });
    //获取贷款产品列表
    if(getUrlParam("ptype")!=null){
        $(".update").each(function(i,obj){
            $(obj).removeClass("active");
            if($(obj).attr("ptype")==getUrlParam("ptype")){
                $(obj).addClass("active");
            }
        });
    }
    var pData={};
    pData.ptype=$(".active.update").attr("ptype");
    base.data_conn("v1/cms/gallerys/"+getUrlParam("gid"),pData,productList,"get");
    $(".update").click(function(){
        var changeList={};
        changeList.ptype=$(this).attr("ptype");
        base.data_conn("v1/cms/gallerys/"+getUrlParam("gid"),changeList,productList,"get");
    });

    function productLists(e){
        if(e.data==''){
            $("#faqSearchKeyword").val("");
            $(".sucess").html("内容为空").show();
            setTimeout(function(){$(".sucess").html("操作成功").hide();},1000);
            //return;
        }
        productList(e);
    }
    function productList(e){
        var data= e.data.list,getData='',num= 1,interest_types,ptype;
        $(".newsEnterlist").attr("listId", e.data.listId);
        for(var i in data){
            switch (data[i].loanProduct.interestType){
                case 1:
                    interest_types="日息";
                    break;
                case 2:
                    interest_types="月息";
                    break;
                case 3:
                    interest_types="年息";
                    break;
            }
            switch(data[i].loanProduct.ptype){
                case 1:
                    ptype="iOS";
                    break;
                case 2:
                    ptype="安卓";
                    break;
                default :
                    ptype="安卓/iOS";
            }
            getData+='<tr id="'+data[i].id+'" interest_type="'+data[i].loanProduct.interestType+'" online_date="'+data[i].onlineDate+'" offline_date="'+data[i].offlineDate+'" productId="'+data[i].productId+'" listId="'+data[i].listId+'"><td>'+(num++)+'</td><td class="title">'+data[i].loanProduct.title+'</td><td class="image" imgSave="'+data[i].loanProduct.image+'"><img src="'+host+data[i].loanProduct.image+'"/></td><td class="description">'+data[i].loanProduct.descriptions+'</td>';
            getData+='<td class="interest_rate">'+interest_types+data[i].loanProduct.interestRate+"%"+'</td><td class="loan_limit">'+(data[i].loanProduct.loanLimitFrom+'-'+data[i].loanProduct.loanLimitTo)+'</td><td class="deadline">'+(data[i].loanProduct.deadlineFrom==0?data[i].loanProduct.deadlineTo:(data[i].loanProduct.deadlineFrom+'-'+data[i].loanProduct.deadlineTo))+(data[i].loanProduct.deadlineType==1?"（日）":"（月）")+'</td><td class="passing_rate">'+data[i].loanProduct.passingRate+"%"+'</td><td class="tag">'+data[i].loanProduct.tag+'</td><pre><td>'+ptype+'</td><td class="urls" datas="'+data[i].loanProduct.url+'">'+data[i].loanProduct.url+'</td></pre>';
            getData+='<td>'+data[i].loanProduct.gmtCreate+'</td><td>'+data[i].loanProduct.gmtModified+'</td><td class="state">'+(data[i].status==0?"下线":"上线")+'</td><td>'+data[i].loanProduct.clicktimes+'</td>';
            getData+='<td>';
            if(data[i].status==0){
                getData+='<button  type="button" class="btn btn-success upline">上线</button>';
            }else{
                getData+='<button  type="button" class="btn btn-warning downline">下线</button>';
            }
            getData+='<button  type="button" class="btn btn-info delP">删除</button>';
            if(data[i].offlineDate!=null||data[i].onlineDate!=null){
                getData+='<button  type="button" class="glyphicon glyphicon-time editP btn btn-info" style="font-size: 14px"></button></td></tr>';
            }else{
                getData+='<button  type="button" class="glyphicon glyphicon-time editP btn btn-info" style="opacity: 0.5;font-size: 14px"></button></td></tr>';
            }
        }
        $("#sortables").html(getData);
        $(".urls").each(function(i,obj){
            $(this).text($(this).attr("datas"));
        });
        $('.page-content').css('height',$(document).height());
    }
//    删除贷款产品
    var searchVal;
    $("#sortables").on("click",".delP",function(){
        searchVal=$("#faqSearchKeyword").val();
        if(!confirm("确认删除吗？")){
            return;
        }
        var delId=$(this).parent().parent("tr").attr("id");
        var states=$(this).parent().siblings(".state").html();
        if(states=="下线"){
            base.data_conn("v2/cms/product/list/data/delete/"+delId,null,delProduct,"delete");
        }else{
            alert("请调整为下线后再删除");
        }
        function delProduct(e){
            if(e.code==0){
                $(".sucess").show();
                setTimeout(function(){$(".sucess").hide();},1000);
                if(searchVal==''){
                    //alert(1)
                    base.data_conn("v1/cms/gallerys/"+getUrlParam("gid")+"?ptype="+$(".active.update").attr("ptype"),"",productList,"get");
                }else{
                    //alert(2)
                    var datas={};
                    datas.title=searchVal;
                    //base.data_conn("v1/cms/product?ptype=1",datas,productList,"get");
                }


            }
        }
    });
//    贷款产品定时
    var editId,productId,ontime,offtime,listIds;
    $("#sortables").on("click",".editP",function(){
        $(".online_date").val("");
        $(".online_time").val("");
        $(".offline_date").val("");
        $(".offline_time").val("");
        editId=$(this).parent().parent("tr").attr("id");
        productId=$(this).parent().parent("tr").attr("productId");
        ontime=$(this).parent().parent("tr").attr("online_date");
        offtime=$(this).parent().parent("tr").attr("offline_date");
        listIds=$(this).parent().parent("tr").attr("listId");
        if(ontime!='null'){
            $(this).css("opacity",1);
            var online=ontime.split(" ");
            $(".online_date").val(online[0]);
            $(".online_time").val(online[1]);
        }
        if(offtime!='null'){
            $(this).css("opacity",1);
            var offline=offtime.split(" ");
            $(".offline_date").val(offline[0]);
            $(".offline_time").val(offline[1]);
        }
        $(".timing").show();
    });
    $(".timeSure").click(function(){
        var form=new FormData();
        var online_dates=$(".online_date").val()+" "+$(".online_time").val();
        var offline_dates=$(".offline_date").val()+" "+$(".offline_time").val();
        form.append("listId",listIds);
        form.append("productId",productId);
        form.append("id",editId);
        form.append("onlineDate",online_dates);
        form.append("offlineDate",offline_dates);
        base.data_send("v2/cms/product/list/data/update",form,timeProduct,"post");
    });
    $(".timeDel").click(function(){
        $(".timing").hide();
    });
    function timeProduct(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){$(".sucess").hide();},2000);
            $(".timing").hide();
            //$(".editP").css("opacity",1);
            base.data_conn("v1/cms/gallerys/"+getUrlParam("gid")+"?ptype="+$(".active.update").attr("ptype"),"",productList,"get");

        }
    }
//    修改贷款产品排序
    $(".ordinal").click(function(){
        var newArr=[];
        var arr=$("#sortables").sortable("toArray",{attribute:"id"});
        for(var i in arr){
            var data={};
            data.id=arr[i];
            data.rank=parseInt(i)+1;
            newArr.push(data);
        }
        console.log(newArr);
        base.data_conn("v2/cms/product/list/data/rank",newArr,newsOrdinal,"put");
    });
    function newsOrdinal(e){
        if(e.code==0){
            $(".sucess").show();
            setTimeout(function(){$(".sucess").hide();},2000);
            base.data_conn("v1/cms/gallerys/"+getUrlParam("gid")+"?ptype="+$(".active.update").attr("ptype"),"",productList,"get");
        }
    }
//    上线处理
    $("#sortables").on("click",".upline",function(){
        searchVal=$("#faqSearchKeyword").val();
        if(!confirm("确认上线吗？")){
            return;
        }
        var editId=$(this).parent().parent("tr").attr("id");
        var productId=$(this).parent().parent("tr").attr("productId");
        var form=new FormData();
        listIds=$(this).parent().parent("tr").attr("listId");
        form.append("listId",listIds);
        form.append("productId",productId);
        form.append("id",editId);
        form.append("status",1);
        base.data_send("v2/cms/product/list/data/update",form,upline,"post");
        function upline(e){
            if(e.code==0){
                $(".sucess").show();
                setTimeout(function(){$(".sucess").hide();},1000);
                if(searchVal==''){
                    base.data_conn("v1/cms/gallerys/"+getUrlParam("gid")+"?ptype="+$(".active.update").attr("ptype"),"",productList,"get");
                }else{
                    var datas={};
                    datas.title=searchVal;
                    base.data_conn("v1/cms/product?ptype=1",datas,productList,"get");
                }

            }
        }
    });

//    下线处理
    $("#sortables").on("click",".downline",function(){
        searchVal=$("#faqSearchKeyword").val();
        if(!confirm("确认下线吗？")){
            return;
        }
        var editId=$(this).parent().parent("tr").attr("id");
        var productId=$(this).parent().parent("tr").attr("productId");
        listIds=$(this).parent().parent("tr").attr("listId");
        var form=new FormData();
        form.append("listId",listIds);
        form.append("productId",productId);
        form.append("id",editId);
        form.append("status",0);
        base.data_send("v2/cms/product/list/data/update",form,downline,"post");
        function downline(e){
            if(e.code==0){
                $(".sucess").show();
                setTimeout(function(){$(".sucess").hide();},1000);
                if(searchVal==''){
                    base.data_conn("v1/cms/gallerys/"+getUrlParam("gid")+"?ptype="+$(".active.update").attr("ptype"),"",productList,"get");
                }else{
                    var datas={};
                    datas.title=searchVal;
                    base.data_conn("v1/cms/product?ptype=1",datas,productList,"get");
                }


            }
        }
    });
//    新建入口列表数据
    $(".newsEnterlist").click(function(){
        //window.location="newsProduct.html?gid="+getUrlParam("gid")+"&pid="+getUrlParam("eid");
        window.location="addList.html?listId="+$(this).attr("listId")+"&ptype="+$(".active.update").attr("ptype")+"&gid="+getUrlParam("gid")+"&eid="+getUrlParam("eid");
    })
});
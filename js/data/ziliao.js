$(function(){
    $(".x-navigation li").each(function(i,obj){
        if($(obj).find("a").attr("href")=="ziliao.html"){
            $(obj).addClass("active");
        }
    });
    base.data_conn("v2/cms/product/list",null,productList,"get");
    function productList(e){
        console.log(e)
        var data= e.data,getData='',num= 1,interest_types,ptype;
        for(var i in data){
            switch(data[i].interestType){
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
            switch(data[i].ptype){
                case 1:
                    ptype="IOS";
                    break;
                case 2:
                    ptype="安卓";
                    break;
                case 0:
                    ptype="安卓/IOS";
                    break;
            }
            getData+='<tr id="'+data[i].id+'" interest_type="'+data[i].interestType+'" state="'+data[i].state+'" ordinal="'+data[i].ordinal+'" ptype="'+data[i].ptype+'" accountDeadlines="'+data[i].accountDeadlines+'" condition="'+data[i].condition+'" flowImages="'+data[i].flowImageIds+'" material="'+data[i].material+'">';
            getData+='<td>'+(num++)+'</td><td class="title">'+data[i].title+'</td><td class="image" imgSave="'+data[i].image+'"><img src="'+host+data[i].image+'"/></td><td class="description">'+data[i].descriptions+'</td>';
            getData+='<td class="interest_rate" interest_rate="'+data[i].interestRate+'">'+interest_types+data[i].interestRate+'%'+'</td><td class="loan_limit" limitF="'+data[i].loanLimitFrom+'" limitT="'+data[i].loanLimitTo+'">'+(data[i].loanLimitFrom+'-'+data[i].loanLimitTo)+'</td><td class="instalment" instalment="'+data[i].instalment+'">'+(data[i].instalment==1?"是":"否")+'</td><td class="deadline" deadlineType="'+data[i].deadlineType+'" deadlineF="'+data[i].deadlineFrom+'" deadlineT="'+data[i].deadlineTo+'">'+((data[i].deadlineFrom==0?data[i].deadlineTo:(data[i].deadlineFrom+'-'+data[i].deadlineTo))+(data[i].deadlineType==1?"(日)":"(月)"))+'</td><td class="passing_rate">'+data[i].passingRate+'%'+'</td><td class="successCount">'+data[i].successCount+'</td><td class="product_tag">'+data[i].tag+'</td><pre><td class="urls" datas="'+data[i].url+'">'+data[i].url+'</td><td >'+ptype+'</td></pre>';
            getData+='<td>'+data[i].gmtCreate+'</td><td>'+data[i].gmtModified+'</td><td>'+data[i].clicktimes+'</td>';
            getData+='<td>';
            getData+='<button  type="button" class="btn btn-info editP">编辑</button><button  type="button" class="btn btn-info delP">删除</button></td></tr>';
        }
        $("#sortable").html(getData);
        //$("#sortable").html(getData).text();
        $(".urls").each(function(i,obj){
            $(this).text($(this).attr("datas"));
        });
        $('.page-content').css('height',$(document).height());
    }
    //    编辑贷款产品
    $("#sortable").on("click",".editP",function(){
        var editId=$(this).parent().parent("tr").attr("id");
        var data={
            title:$(this).parent().siblings(".title").html(),
            url:$(this).parent().siblings(".urls").text(),
            description:$(this).parent().siblings(".description").html(),
            interest_rate:$(this).parent().siblings(".interest_rate").html(),
            loan_limit_from:$(this).parent().siblings(".loan_limit").attr("limitF"),
            loan_limit_to:$(this).parent().siblings(".loan_limit").attr("limitT"),
            passing_rate:$(this).parent().siblings(".passing_rate").html(),
            product_tag:$(this).parent().siblings(".product_tag").html(),
            deadline_from:$(this).parent().siblings(".deadline").attr("deadlineF"),
            deadline_to:$(this).parent().siblings(".deadline").attr("deadlineT"),
            image:$(this).parent().siblings(".image").attr("imgSave"),
            interest_type:$(this).parent().parent().attr("interest_type"),
            //state:$(this).parent().parent().attr("state"),
            //ordinal:$(this).parent().parent().attr("ordinal"),
            ptype:$(this).parent().parent().attr("ptype"),
            accountDeadlines:$(this).parent().parent().attr("accountDeadlines"),
            flowImages:$(this).parent().parent().attr("flowImages"),
            condition:$(this).parent().parent().attr("condition"),
            material:$(this).parent().parent().attr("material"),
            instalment:$(this).parent().siblings(".instalment").attr("instalment"),
            successCount:$(this).parent().siblings(".successCount").html(),
            deadlineType:$(this).parent().siblings(".deadline").attr("deadlineType")
        };
        data=JSON.stringify(data);
        localStorage.setItem("data",data);
        window.location="newsProduct.html?id="+editId;
    })
    //    删除贷款产品
    var searchVal;
    $("#sortable").on("click",".delP",function(){
        searchVal=$("#faqSearchKeyword").val();
        if(!confirm("确认删除吗？")){
            return;
        }
        var delId=$(this).parent().parent("tr").attr("id");
        //var states=$(this).parent().siblings(".state").html();
        //if(states=="下线"){
            base.data_conn("v2/cms/product/delete/"+delId,null,delProduct,"delete");
        //}else{
        //    alert("请调整为下线后再删除");
        //}
        function delProduct(e){
            if(e.code==0){
                $(".sucess").show();
                setTimeout(function(){$(".sucess").hide();},1000);
                if(searchVal==''){
                //    alert(1)
                base.data_conn("v2/cms/product/list",null,productList,"get");
                }else{
                //    alert(2)
                    var datas={};
                    datas.title=searchVal;
                    base.data_conn("v2/cms/product/list",datas,productLists,"get");
                }
            }else if(e.code==1){
                $(".sucess").html(e.message).show();
                setTimeout(function(){
                    $(".sucess").html("").hide();
                },1000)
            }
        }
    });
//搜索列表
    $('.input-group-btn').click(function(){
        var searchVal=$("#faqSearchKeyword").val();
        var datas={};
        datas.title=searchVal;
        base.data_conn("v2/cms/product/list",datas,productLists,"get");
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
    //返回产品列表页
    $(".back_index").click(function(){
        $("#faqSearchKeyword").val("");
        base.data_conn("v2/cms/product/list",null,productList,"get");
    });
});
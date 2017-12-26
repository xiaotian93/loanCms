$(function(){
    var productIds=[];
    var num=0;
    //$(".dataBody").on("click", ".checks", function(){
    //    var checkbox  = $(this).find("input[type='checkbox']");
    //    var isChecked = checkbox.checked;
    //
    //    //
    //    if (isChecked) {
    //        checkbox.attr("checked","false");
    //    } else {
    //        checkbox.attr("checked","true");
    //    }
    //})
    $('.input-group-btn').click(function(){
        var searchVal=$("#faqSearchKeyword").val();
        var datas={};
        datas.title=searchVal;
        base.data_conn("v2/cms/product/list",datas,productLists,"get");
    });
    $(".back_index").click(function(){
        $("#faqSearchKeyword").val("");
        base.data_conn("v2/cms/product/list","",productList,"get");
    });
    //搜索列表
    function productLists(e){
        if(e.data==''){
            $("#faqSearchKeyword").val("");
            $(".sucess").html("内容为空").show();
            setTimeout(function(){$(".sucess").html("操作成功").hide();},1000);
            //return;
        }
        productList(e);
    }
    //产品导入
    $('.check_btn').click(function(){
        var nums=0;
        productIds=[];
        $(".checks input").each(function(i,obj){
            if(obj.checked==true){
                var productId=$(obj).parent("td").parent("tr").attr("id");
                productIds.push(productId);
                ++nums;
                //$('.check_num').html(num++);
            }
        });
        if(!confirm("是否确认导入"+nums+"个产品？")){
            return;
        }
        var formdata=new FormData();
        formdata.append("listId",getUrlParam("listId"));
        formdata.append("productIds",productIds);
        if(getUrlParam("ptype")!=undefined){
            formdata.append("ptype",getUrlParam("ptype"));
        }
        base.data_send("v2/cms/product/list/data/add",formdata,addProduct,"post");
    });
    function addProduct(e){
        if(e.code==0){
            $(".sucess").show();
            if(getUrlParam("listId")==1||getUrlParam("listId")==4){
                setTimeout(function(){
                    window.location="index.html?listId="+getUrlParam("listId");
                },200);
                $(".x-navigation li").each(function(i,obj){
                    if($(obj).find("a").attr("href")=="index.html"){
                        $(obj).addClass("active");
                    }
                })
            }else if(getUrlParam("listId")==2||getUrlParam("listId")==5){
                setTimeout(function(){
                    window.location="loanTotals.html?listId="+getUrlParam("listId");
                },200);

            }else{
                setTimeout(function(){
                    window.location="productLists.html?ptype="+getUrlParam("ptype")+"&gid="+getUrlParam("gid")+"&eid="+getUrlParam("eid");

                },200);
            }
        }else{
            alert("添加失败");
        }
    }
    $('.quanxuan').click(function(){
        if(this.checked==true){
            $(".checks input").each(function(i,obj){
                obj.checked=true;
            });
            $('.check_numbox').show();
            $('.check_num').html($(".checks input").length);
            num=$(".checks input").length
        }else{
            $(".checks input").each(function(i,obj){
                obj.checked=false;
                $('.check_numbox').hide();
                num=0;
            })
        }

    });
    $('#sortable').on("click",".checks input",function(){
        if(this.checked==true){
            $('.check_numbox').show();
            $('.check_num').html(++num);
        }else{
            $('.check_num').html(--num);
            if(num==0){
                $('.check_numbox').hide();
            }
        }
    });
//    资料库列表
    var ptype_ziliao={};
    ptype_ziliao.ptype=getUrlParam("ptype");
    base.data_conn("v2/cms/product/list",ptype_ziliao,productList,"get");
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
            getData+='<tr id="'+data[i].id+'" interest_type="'+data[i].interestType+'" state="'+data[i].state+'" productId="'+data[i].productId+'" ptype="'+data[i].ptype+'"><td class="checks"><input type="checkbox" name="check"/></td><td class="title">'+data[i].title+'</td><td class="image" imgSave="'+data[i].image+'"><img src="'+host+data[i].image+'"/></td><td class="description">'+data[i].descriptions+'</td>';
            getData+='<td class="interest_rate" interest_rate="'+data[i].interestRate+'">'+interest_types+data[i].interestRate+'%'+'</td><td class="loan_limit">'+(data[i].loanLimitFrom+'-'+data[i].loanLimitTo)+'</td><td class="deadline">'+(data[i].deadlineFrom==0?data[i].deadlineTo:(data[i].deadlineFrom+'-'+data[i].deadlineTo))+(data[i].deadlineType==1?"（日）":"（月）")+'</td><td class="passing_rate">'+data[i].passingRate+'%'+'</td><td class="tag">'+data[i].tag+'</td><td class="urls" datas="'+data[i].url+'">'+data[i].url+'</td><td >'+ptype+'</td>';
            getData+='</tr>';

        }
        $("#sortable").html(getData);
        //$("#sortable").html(getData).text();
        $(".urls").each(function(i,obj){
            $(this).text($(this).attr("datas"));
        });
        $('.page-content').css('height',$(document).height());
    }
//    返回上一页
    $(".x-navigation li").each(function(i,obj){
    if(getUrlParam("listId")==1||getUrlParam("listId")==4){
        var breadcrumb='';
        breadcrumb+='<li><a href="index.html?listId='+getUrlParam("listId")+'">首页贷款产品管理</a></li><li>'+(getUrlParam("listId")=="1"?"安卓":"iOS")+'</li><li class="active">新增产品</li>';
        $(".breadcrumb").html(breadcrumb);
        if($(obj).find("a").attr("href")=="index.html"){
            $(obj).addClass("active");
        }
    }else if(getUrlParam("listId")==2||getUrlParam("listId")==5){
        var breadcrumb='';
        breadcrumb+='<li><a href="loanTotals.html?listId='+getUrlParam("listId")+'">贷款大全产品管理</a></li><li>'+(getUrlParam("listId")=="2"?"安卓":"iOS")+'</li><li class="active">新增产品</li>';
        $(".breadcrumb").html(breadcrumb);
        if($(obj).find("a").attr("href")=="loanTotals.html"){
            $(obj).addClass("active");
        }
    }else{
        var breadcrumb='';
        breadcrumb+='<li><a href="fast_enter.html?eid='+getUrlParam("eid")+'">快速入口'+getUrlParam("eid")+'</a></li><li><a href="productLists.html?gid='+getUrlParam("gid")+'&eid='+getUrlParam("eid")+'&ptype='+getUrlParam("ptype")+'">产品列表</a></li><li>'+(getUrlParam("ptype")=="2"?"安卓":"iOS")+'</li><li class="active">新增产品</li>';
        $(".breadcrumb").html(breadcrumb);
        if($(obj).find("a").attr("href")=="fast_enter.html"){
            $(obj).addClass("active");
        }
    }
    })


});
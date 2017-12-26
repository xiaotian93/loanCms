$(function(){
    var data={};
    data.type=$(".active").attr("type");
    console.log(data.type);
    base.data_conn("v1/cms/behaviour",data,getData,"get");
    //var getTable
    function getData(e){
        var getTable='';var dates= e.data;
        if(dates!=''){
            for(var i in dates){
                if(data.type!="banner"){
                    getTable+='<tr><td>'+(dates[i].createTime.split(" "))[0]+'</td><td>'+dates[i].loanProduct.title+'</td>';
                    if(getUrlParam("type")=="complete"){
                        getTable+='<td>'+dates[i].showNum+'</td><td>'+dates[i].clickNum+'</td><td>'+(Math.round((dates[i].clickNum/dates[i].showNum) * 10000)/100).toFixed(2)+'</td>';
                    }else{
                        getTable+='<td>'+dates[i].clickNum+'</td>';
                    }
                    getTable+='<td>'+dates[i].applyNum+'</td><td>'+(Math.round((dates[i].applyNum/dates[i].clickNum) * 10000)/100).toFixed(2)+'</td><td>'+dates[i].shareNum+'</td></tr>';
                }else{
                    console.log(dates[i].banner)
                    getTable+='<tr><td>'+(dates[i].createTime.split(" "))[0]+'</td><td>'+dates[i].banner.title+'</td>';
                    getTable+='<td>'+dates[i].clickNum+'</td><td>'+dates[i].applyNum+'</td><td>'+(Math.round((dates[i].applyNum/dates[i].clickNum) * 10000)/100).toFixed(2)+'</td><td>'+dates[i].shareNum+'</td></tr>';
                }
            }
        }else{
            alert("暂无数据")
        }


$(".dataBody").html(getTable)
    }
});
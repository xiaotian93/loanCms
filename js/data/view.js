$(function() {
	$("#version").selectpicker('refresh');
	get_list();
	function get_list (){
		var path = "/v1/cms/feedback";
		base.data_conn(path,'',function(data){
			getData(data);
		})
	}

	$("#view-list").on("click",".view-del",function(){
		if(!confirm("确认删除吗？")){
			return;
		}
		var id = $(this).attr("data-id");
		console.log(id)
		var path = "/v1/cms/feedback/"+id;
		base.data_conn(path,"",function(data){
			if(data.code==0){
				$(".sucess").show();
				setTimeout(function(){$(".sucess").hide();},1000);
				get_list();
			}else{
				alert("删除失败")
			}
		},"delete")
	})
//	意见搜索
	var formdata={};
	$('#reportrange').on('hide.daterangepicker', function() {
		var dates=$('.dates').html().split(' - ');
		formdata.startTime=dates[0];
		formdata.endTime=dates[1];
	});
	$("#version").change(function(){
		formdata.ptype=MultiSelect($("#version>option"));
	});

	$(".search_btn").click(function(){
console.log(formdata.ptype)
		formdata.id=$(".view_id").val();
		formdata.phone=$(".view_phone").val();
		//formdata.append("debug","true");
		base.data_conn("v1/cms/feedback",formdata,searchList,"get");
	})
	function searchList(e){
		getData(e)
	}
	function MultiSelect(data){
		var   selectedValue   =   0;
		var   objSelect   =   data;
		for(var   i   =   0;   i   <   objSelect.length;   i++)
		{
			if   (objSelect[i].selected   ==   true)
				selectedValue   +=   parseInt(objSelect[i].value)   ;
		}
		return selectedValue;
	}
//	data
	function getData(data){
		if(data.code != 0){
			console.log(data);
			return;
		}
		var lists = data.data;
		var html = "";
		for(var l in lists){
			var list = lists[l];
			html += "<tr>";
			html += "<td>"+ (parseInt(l)+1) +"</td>";
			if(list.user==null){
				html += "<td>"+ (list.uid) +"</td>";
				html+="<td>"+list.phone+"</td>";
				html+="<td>未认证</td>";
			}else{
				html += "<td>"+ (list.user.phone_number==undefined?list.uid:list.user.phone_number) +"</td>";
				html+="<td>"+list.phone+"</td>";
				html+="<td>"+(list.user.name==null?'未认证':list.user.name)+"</td>"
			}
			html+="<td>"+list.id+"</td>";
			//html+="<td>"+list.phone+"</td>"
			html += "<td>"+ list.gmt_create +"</td>";
			if(list.user==null){
				html+="<td>未注册</td>";
				//html+="<td>未注册</td>";
			}else{
				html+="<td>"+list.user.gmt_create+"</td>";
			}
			html+="<td>"+(list.ptype==1?'IOS':'安卓')+"</td>";
			html += "<td>"+ list.version_name +"</td>";
			html += "<td>"+ list.content +"</td>";
			html += '<td> <button type="button" class="btn btn-info view-del" data-id='+ list.id +'>删除</button> </td>';
		}
		// console.log(html)
		$("#view-list").html(html);
		$('.page-content').css('height',$(document).height());
	}

});
// using jQuery
url1 = 'http://bhargavreddi.pythonanywhere.com';
url2 = 'http://127.0.0.1:8000';
url_link = url2;
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function addHeader(){
	$.ajaxSetup({
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});
}
function getDepartments()
{
	$.getJSON(url_link+"/api/get_departments/",
                    function (data) {
			$.each(data, function (index, element) {
				$('#department').append(
                                "<option>" + element.name +"</option>"
                            );
			});	
                    });
}
function getRegulations()
{
	$.getJSON(url_link+"/api/get_regulations/",
                    function (data) {
			$.each(data, function (index, element) {
				$('#regulation').append(
                                "<option>" + element.regulation +"</option>"
                            );
			});	
                    });
}
function sendFile()
{
	var data = new FormData($('form#upload').get(0));
	$.ajax({
    	url: url_link + "/api/list_student_register/",
    	type: 'POST',
    	data: data,
    	cache: false,
    	processData: false,
    	contentType: false,
    	success: function(data) {
        alert('success');
    	}
});
}
function sendData(image_id,user_id,user_name) {
    addHeader();
	$.ajax({
		url: url_link+'/api/images/',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({

			image_id:image_id,
			user_id : user_id
		}),
		dataType: 'json'
	});
	var color = $(".glyphicon-thumbs-up").css("color");
	if(color=="rgb(0, 0, 255)")
	{
		$(".glyphicon-thumbs-up").css("color","black");
		var x =parseInt($("#json").html());
		$("#json").html(x-1);
		$("#user"+user_id).remove();
	}
	else {
		$(".glyphicon-thumbs-up").css("color", "blue");
		var x =parseInt($("#json").html());
		$("#json").html(x+1);
		$('#user_liked').append(
			"<a href=\"/profile/"+user_id+"\" id=\"user"+user_id+"\">"+"<li class=\"list-group-item\"><h3 align=\"left\">" + user_name + "</h3></li></a>"
		);
	}
}
function clickComment(image_id,user_id,nameUser){
	addHeader();
	var text = $("#comment").val();
	var comment_id = "";
	$.ajax({
		url: url_link+'/api/comments/',
		type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({

            image_id:image_id,
			user_id : user_id,
            comment : text
        }),
		success:function (data) {
			comment_id = data;
			var division = "<div class=\"alert alert-success alert-dismissible\" role=\"alert\">";
			var button = "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\" onclick=\"deleteComment("+comment_id+")\"><span aria-hidden=\"true\">&times;</span></button>";
			var data = "<p><strong>"+nameUser+"</strong></p>"+text+"</div>";
			$('#comments').append(
				division+button+data
			);
		},
        dataType: 'json'
    });
    $('#comment').val('');
}
function search()
{
	var context = $("#search_user").val();
	if(context =="" || context == null)
		return;
	window.location.replace(url_link+"/search/"+context+"/");
}
function follow(user_id,follower_id) {
	if(user_id == follower_id)
	{
		alert("You Cannot Follow yourself");
		return;
	}
	addHeader();
	$.ajax({
		url: url_link+'/api/follow/',
		type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({

            follow_id:follower_id,
			user_id : user_id
        }),
        dataType: 'json'
    });
	if($("#follow_button").html() == 'Follow')
	{
		$("#follow").html(
			"<button type=\"button\"  class=\"btn btn-warning btn-lg\" onclick=\"follow('{{ user.id }}','{{ profile_id }}')\" id=\"follow_button\">Unfollow</button> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;"
		);
	}
	else
	{
		$("#follow").html(
			"<button type=\"button\"  class=\"btn btn-success btn-lg\" onclick=\"follow('{{ user.id }}','{{ profile_id }}')\" id=\"follow_button\">Follow</button> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;"
		);
	}
}
function deleteComment(id)
{
	addHeader();
	$.ajax({
		url: url_link+'/api/comment/delete/',
		type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            comment_id:id
        }),
        dataType: 'json'
    });
}

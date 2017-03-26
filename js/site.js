// using jQuery
url1 = 'https://mvgrexamcell.pythonanywhere.com';
url2 = 'http://127.0.0.1:8000';
url_link = url2;
exam_id = null;
time = null;
date = null;
capacity = 0;
dhcapacity = 0;
classroom_count = 0;
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
function sendRegisterStudents()
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
	if(data.status == 'success')
		alert('success');
	else
		alert('failed');
        window.opener = self;
        window.close();
    	}
});
}

function sendStudentList()
{
	var data = new FormData($('form#upload').get(0));
	$.ajax({
    	url: url_link + "/api/upload_student_list/",
    	type: 'POST',
    	data: data,
    	cache: false,
    	processData: false,
    	contentType: 'false',
    	success: function(data) {
	if(data.status == 'success')
		alert('success');
	else
		alert('failed');
        window.opener = self;
        window.close();
    	}
});
}

function sendTimetable()
{
	var data = new FormData($('form#upload').get(0));
	$.ajax({
    	url: url_link + "/api/upload_timetable/",
    	type: 'POST',
    	data: data,
    	cache: false,
    	processData: false,
    	contentType: false,
    	success: function(data) {
	if(data.status == 'success')
		alert('success');
	else
		alert('failed');
        window.opener = self;
        window.close();
    	}
});
}

function sendFacultyTimetable()
{
	var data = new FormData($('form#upload').get(0));
	$.ajax({
    	url: url_link + "/api/upload_faculty_timetable/",
    	type: 'POST',
    	data: data,
    	cache: false,
    	processData: false,
    	contentType: false,
    	success: function(data) {
	if(data.status == 'success')
		alert('success');
	else
		alert('failed');
        window.opener = self;
        window.close();
    	}
});
}
function setExamId(id)
{
	exam_id = id;
}

function removeTimetable()
{
	if (exam_id == null)
	{
		alert('Select Examination');
		return;
	}
	$.getJSON(url_link+"/api/delete_timetable/"+exam_id,
                    function (data) {
				if(data.status == 'success')
					alert('success');
				else
					alert('failed');
            			window.opener = self;
        			window.close();
			});	
	
}

function removeRegisterStudents()
{
	if (exam_id == null)
	{
		alert('Select Examination');
		return;
	}
	$.getJSON(url_link+"/api/delete_register_students/"+exam_id,
                    function (data) {
				if(data.status == 'success')
					alert('success');
				else
					alert('failed');
            			window.opener = self;
			        window.close();
			});	
}


function getExaminationTiming(id)
{
	exam_id = id;
	$.getJSON(url_link+"/api/getTimings/" + id + "/",
                    function (data) {
			$.each(data.time_list, function (index, element) {
			$('#time').append("<li><a href=\"javascript:settime('"+element.time+"')\">"  + element.time  +"</a></li>");
			});
                    });
}
function settime(t)
{
	time = t;
}
function checkExam()
{
	if(exam_id == null)
	{
		alert('Select Examination');
		return;
	}
	if(time == null)
	{
		alert('Select Time');
		return;
	}
	date = document.getElementById('datepicker').value;
	if(date == null || date == '')
	{
		alert('Select Date');
		return;
	}
	date_array = date.split("/");
	$.getJSON(url_link+"/api/checkExam/" + exam_id + "/" + date_array[2] + "/" + date_array[0] + "/" + date_array[1] + "/",
                    function (data) {
			if (data.status == 'true')
			window.location = "view_classroom.html?exam_id="+exam_id+"&date="+date+"&time="+time;
			else
			alert('No Exams Scheduled');
                    });
}
function getCapacity(exam_id,date,time)
{
	date_array = date.split("/");
	time_array = time.split(":");
	link = url_link+"/api/getCapacity/" + exam_id + "/" + date_array[2] + "/" + date_array[0] + "/" + date_array[1] + "/" + time_array[0] + "/" + time_array[1] + "/";
        $.getJSON(link,function (data) {
			capacity = data.capacity;
			dhcapacity = data.dhcapacity;
			$("#capacity").text(capacity);
			$("#dhcapacity").text(dhcapacity);
                    });
	
}
function sendClassrooms(exam_id,date,time)
{
	selected_capacity = 0;
	selected_dhcapacity = 0;
	classroom_list = new Array();
	drawinghall_list = new Array();
	index = 0;
	dindex = 0;
	for(i=1;i<=classroom_count;i++)
	{
		if($("#"+i).is(":checked")){
		    //do something
		  
		    size = parseInt($("#"+i).val());
		    if(size == 56 && (dhcapacity - selected_dhcapacity) > 0)
		    {
			drawinghall_list[dindex++] =  $("#"+i).text();
			selected_dhcapacity += size;
		    }
		    else
			if(selected_capacity < capacity)
			{
		    	selected_capacity += size;
			classroom_list[index++] =  $("#lb"+i).text();
			}
		    if (selected_capacity >= capacity && selected_dhcapacity >= dhcapacity)
			break;
		}
	}
	$("#capacity").text((capacity-selected_capacity));
        $("#dhcapacity").text((dhcapacity-selected_dhcapacity));
	if (selected_capacity >= capacity && selected_dhcapacity >= dhcapacity)
	{
		obj = new Object();
		obj.classrooms = classroom_list;
		obj.drawinghalls = drawinghall_list;
		size = index;
		data = JSON.stringify(obj);
		date_array = date.split("/");
		time_array = time.split(":");
		link = url_link+"/api/arrangeStudents/" + exam_id + "/" + date_array[2] + "/" + date_array[0] + "/" + date_array[1] + "/" + time_array[0] + "/" + time_array[1] + "/";
		$.ajax({
		url: link,
		type: 'POST',
		data: data,
		dataType: "json",
		contentType: "application/json",
		success: function(data) {
		if(data.status == 'success')
			window.location = "view_menu.html?exam_id="+exam_id+"&date="+date+"&time="+time;
		else
			alert('failed');
		}
		});
	}
	else
		alert('Select More Classrooms');
}
function getClassrooms(exam_id,date,time)
{
	date_array = date.split("/");
	time_array = time.split(":");
	link = url_link+"/api/getClassrooms/" + exam_id + "/" + date_array[2] + "/" + date_array[0] + "/" + date_array[1] + "/" + time_array[0] + "/" + time_array[1] + "/";
	$.getJSON(link,
                    function (data) {
			classroom_count = data.number;
			count = 1
			$.each(data.classroom_list, function (index, element) {
			$('#cls_list').append("<div class=\"checkbox\">&nbsp; &nbsp;<h3><input type=\"checkbox\" id = \""+count+"\" value=\""+element.size+"\"><label id=\"lb"+count+"\">"+element.classroom+"</label></h3></div>");
			count++;
			});
			$('#cls_list').append("<br><br><div><button type=\"button\" class=\"btn btn-success\" id=\"submit\" onClick=\"sendClassrooms(exam_id,date,time);\">Next</button></div><br><br>");
                    });
}
function retrieveClassrooms(exam_id,date,time)
{
	date_array = date.split("/");
	time_array = time.split(":");
	link = url_link+"/api/retreiveClassrooms/" + exam_id + "/" + date_array[2] + "/" + date_array[0] + "/" + date_array[1] + "/" + time_array[0] + "/" + time_array[1] + "/";
	    $.getJSON(link,
                    function (data) {
			$.each(data.classroom_list, function (index, element) {
				$('#exams').append("<li><a href=\"javascript:generateHallPlan('"+element.size+"','"+element.classroom+"')\">" + element.classroom +"</a></li>");
			});	
                    });
}
function room36(classroom)
{
	student_list = new Array();
	for(i=0;i<6;i++)
	 student_list[i] = new Array();
	date_array = date.split("/");
	time_array = time.split(":");
	link = url_link+"/api/studentsClassroom/" + exam_id + "/" + date_array[2] + "/" + date_array[0] + "/" + date_array[1] + "/" + time_array[0] + "/" + time_array[1] + "/" + classroom + "/" ;
	    $.getJSON(link,
                    function (data) {
			index_1 = 0;
			
			index_2 = 0;
			$.each(data.student_list, function (index, element) {
				regno = element.regno;
				if(regno == "100"){
					student_list[index_1][index_2] = "Left Empty";	
					
				}
				else
				student_list[index_1][index_2] = regno;
				index_1 = (index_1 + 1)%6;
				if(index_1 == 0)
					index_2++;
			});	
			print_script = "<table width=\"100%\">";
			for(i=0;i<6;i++)
				print_script += "<tr><td>"+student_list[i][0]+"</td><td>"+student_list[i][1]+"</td><td></td><td>"+student_list[i][2]+"</td><td>"+student_list[i][3]+"</td><td></td><td>"+student_list[i][4]+"</td><td>"+student_list[i][5]+"</td></tr>";
			print_script += "</table>";
			$('#display').html(print_script);

                    });
}
function room56(classroom)
{
	student_list = new Array();
	for(i=0;i<14;i++)
	 student_list[i] = new Array();
	date_array = date.split("/");
	time_array = time.split(":");
	link = url_link+"/api/studentsClassroom/" + exam_id + "/" + date_array[2] + "/" + date_array[0] + "/" + date_array[1] + "/" + time_array[0] + "/" + time_array[1] + "/" + classroom + "/" ;
	    $.getJSON(link,
                    function (data) {
			index_1 = 0;
			
			index_2 = 0;
			$.each(data.student_list, function (index, element) {
				regno = element.regno;
				if(regno == "100"){
					student_list[index_1][index_2] = "Left Empty";	
					
				}
				else
				student_list[index_1][index_2] = regno;
				index_1 = (index_1 + 1)%14;
				if(index_1 == 0)
					index_2++;
			});	
			print_script = "<table width=\"100%\">";
			for(i=0;i<14;i++)
				print_script += "<tr><td>"+student_list[i][0]+"</td><td></td><td>"+student_list[i][1]+"</td><td></td><td>"+student_list[i][2]+"</td><td></td><td>"+student_list[i][3]+"</td></tr>";
			print_script += "</table>";
			$('#display').html(print_script);

                    });
}
function room24(classroom)
{
	student_list = new Array();
	for(i=0;i<6;i++)
	 student_list[i] = new Array();
	date_array = date.split("/");
	time_array = time.split(":");
	link = url_link+"/api/studentsClassroom/" + exam_id + "/" + date_array[2] + "/" + date_array[0] + "/" + date_array[1] + "/" + time_array[0] + "/" + time_array[1] + "/" + classroom + "/" ;
	    $.getJSON(link,
                    function (data) {
			index_1 = 0;
			
			index_2 = 0;
			$.each(data.student_list, function (index, element) {
				regno = element.regno;
				if(regno == "100"){
					student_list[index_1][index_2] = "Left Empty";	
					
				}
				else
				student_list[index_1][index_2] = regno;
				index_1 = (index_1 + 1)%6;
				if(index_1 == 0)
					index_2++;
			});	
			print_script = "<table width=\"100%\">";
			for(i=0;i<6;i++)
				print_script += "<tr><td>"+student_list[i][0]+"</td><td>"+student_list[i][1]+"</td><td></td><td></td><td></td><td></td><td>"+student_list[i][2]+"</td><td>"+student_list[i][3]+"</td></tr>";
			print_script += "</table>";
			$('#display').html(print_script);

                    });
}
function isArranged()
{
	if(exam_id == null)
	{
		alert('Select Examination');
		return;
	}
	if(time == null)
	{
		alert('Select Time');
		return;
	}
	date = document.getElementById('datepicker').value;
	if(date == null || date == '')
	{
		alert('Select Date');
		return;
	}
	date_array = date.split("/");
	time_array = time.split(":");
	$.getJSON(url_link+"/api/isArranged/" + exam_id + "/" + date_array[2] + "/" + date_array[0] + "/" + date_array[1] + "/" + time_array[0] + "/" + time_array[1],
                    function (data) {
			if (data.status == 'true')
			window.location = "view_menu.html?exam_id="+exam_id+"&date="+date+"&time="+time;
			else
			alert('No Exams Scheduled');
                    });
}
function isSetAllocated(exam_id,date,time)
{
	date_array = date.split("/");
	time_array = time.split(":");
	link = url_link+"/api/isSetAllocated/" + exam_id + "/" + date_array[2] + "/" + date_array[0] + "/" + date_array[1] + "/" + time_array[0] + "/" + time_array[1] + "/";
	$.getJSON(link,
                    function (data) {
			alert(data.status);
                    });
}
function generateHallPlan(size,classroom)
{
	alert(size);
	if(size == 36)
		room36(classroom);
	else if(size == 24)
		room24(classroom);
	else if(size == 56)
		room56(classroom);
}
function setSubjects(exam_id,date,time)
{
	date_array = date.split("/");
	time_array = time.split(":");
	link = url_link+"/api/retreiveSubjects/" + exam_id + "/" + date_array[2] + "/" + date_array[0] + "/" + date_array[1] + "/" + time_array[0] + "/" + time_array[1] + "/";
	    $.getJSON(link,
                    function (data) {
			$.each(data.subject_list, function (index, element) {
				$('#subjects').append("<li><a href=\"javascript:generateSeatingPlan('"+element.subject_code+"','"+element.subject_name+"')\">" + element.subject_code + "    " +element.subject_name +"</a></li>");
			});	
                    });
}
function generateSeatingPlan(size,classroom)
{
}

//Variabile

var currentDate = new Date();
//login
function login_info() {
	var username = $('#username').val();
	var password = $('#password').val();
	/*$.post("/login", {username: username, password: password}, function(){alert('daaa, a mers')}).fail(function() {
    	alert( "error" );
  	});*/
  	$("li#logare").html("<a href='#myPopup' data-rel='popup'>Iesire din cont</a>");
  	$('div#myPopup').hide();
}
//end Login

//poll form data
function poll_info()
{
    var title = $('#pollTitle').val();
    var desc = $('#pollDesc').val();
    var endDate = $('#endDate').val();
    var category = [];
    var county = [];

    $("input:checkbox[name=category]:checked").each(function(){
    category.push($(this).val());
    });

    $("input:checkbox[name=judet]:checked").each(function(){
    county.push($(this).val());
    });

    $.ajax({
		url: '/addPoll',
		type: 'POST',
		data: JSON.stringify({'title': title, 'desc': desc, 'endDate':endDate, 'category':category, county:county}),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		async: false,
		success: function(msg) {
		alert(msg);
		}
	});
}

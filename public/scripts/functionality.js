var currentDate = new Date();
var currentUser;

$( document ).ready(function() {
    Captcha();
    $.post('/getUser', function(res) {
        currentUser = res;
    });
});

//login
function login_info() {
    var data = {};
	data.username = $('#username').val();
	data.password = $('#password').val();
	$.post('/login', data).fail(function() {
    });

    $('#username').val('');
    $('#password').val('');
  	$("li#logare").html("<a href='#myPopup' data-rel='popup'>Iesire din cont</a>");
  	$('div#myPopup').hide();
}
//end Login
//harta

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

// register

function registerUser() {
    if(ValidCaptcha()) {
        var data = {};
        data.firstName = $('#firstName').val();
        data.lastName = $('#lastName').val();
        data.email = $('#email').val();
        data.cnp = $('#cnp').val();
        data.userName = $('#username1').val();
        data.password = $('#password11').val();
        data.password2 = $('#password22').val();
        data.roleId = $('input[name=inlineButton]:checked').val();


        $.post('/register', data).fail(function(){
            alert('Error');
        });
    } else {
        alert('Invalid captcha!');
    }
}

function Captcha(){
	var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
	var i;
	for (i=0;i<6;i++){
		var a = alpha[Math.floor(Math.random() * alpha.length)];
		var b = alpha[Math.floor(Math.random() * alpha.length)];
		var c = alpha[Math.floor(Math.random() * alpha.length)];
		var d = alpha[Math.floor(Math.random() * alpha.length)];
		var e = alpha[Math.floor(Math.random() * alpha.length)];
		var f = alpha[Math.floor(Math.random() * alpha.length)];
		var g = alpha[Math.floor(Math.random() * alpha.length)];
	}
	var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' '+ f + ' ' + g;
	document.getElementById("mainCaptcha").value = code;
}
function ValidCaptcha(){
	var string1 = removeSpaces(document.getElementById('mainCaptcha').value);
	var string2 = removeSpaces(document.getElementById('txtInput').value);
	if (string1 == string2){
		return true;
	}
	else{
		return false;
	}
}
function removeSpaces(string){
	return string.split(' ').join('');
}
// end register
//Variabile
var polls, filterList = [], idx = 0, pollsListFiltred = [];
var currentDate = new Date();
var countyList = ['Arad', 'Arges','Bacau','Bihor','Bistrita-Nasaud'];
//login
function login_info() {
	var username = $('#username').val();
	var password = $('#password').val();
	/*$.post("/login", {username: username, password: password}, function(){alert('daaa, a mers')}).fail(function() {
    	alert( "error" );
  	});*/
  	$("li#logare").html("<a href='#myPopup' data-rel='popup'>Iesire din cont</a>");
  	$('div#myPopup').hide();
  	$('div#myPopup-screen').removeClass("in ui-overlay-b ui-popup-screen");
}
//end Login
//harta
function filter_by_county(id) {
	$.get('/pollsList?id=' + id)
	.done(function(data) { 
		return data;
	})
	.fail(function() {
    	alert( "error" );
  	});

  	polls = put_id($.parseJSON(data));
}

//Pentru test
polls = [{category: 'SP' , subject: 'Spital judetean' , description: 'Primarul orasului Bihor vrea sa deschida sectia pentru urologie in spitalul judetean. ' , startDate: '03/20/2017' , endDate: '04/30/2017' },
		{category: 'SC' , subject: 'Scoala primara', description:'sdfsdfs sfsd', startDate: '04/12/2017' , endDate: '04/15/2017' },
		{category: 'DR', subject: 'Drumuri europene' , description: 'dfdfd' , startDate: '04/12/2017' , endDate: '06/22/2017'},
		{category: 'SP', subject: 'Spital central' , description: 'afdfsf dsfsd' , startDate: '04/21/2017' , endDate: '05/03/2017' }];

function put_id(data) {
	var index = 0;
	for (var i = 0; i < data.length; ++i) 
		data[i].id = "poll-no-" + index++;
}

//Category Filter
function add_cat(id) {
	if (filterList.indexOf(id) == -1){
		filterList[idx] = id
		++idx;
	} else {
		for( var k = 0; k < filterList.length; ++k){
			if (filterList[k] === id) {
				filterList.splice(k,1);
				--idx;
			}
		}
	}
}

function create_polls_list() {
	put_id(polls);
	var html = '<ol>';
	var p = 0;
	var index = 0;
	for (var i = 0; i < polls.length; ++i) {
		for(var j = 0; j < filterList.length; ++j)
			if (polls[i].category === filterList[j]) {
				html += '<li id="'+ polls[i].id + '"><h4>' + polls[i].subject + '</h4></li>';
				html += '<a href="#pollPopup" data-rel="popup" onclick="create_poll('+ "'" + polls[i].id + "'" +')">';
				html += '<p>' + polls[i].description + '</p>';
				html += '</a>';
				pollsListFiltred[p++] = polls[i];
			}
	}
	html += '</ol>';
	$("div#poll-list").html(html);
}

function create_poll(id) {
	var html = '<div>';
	for (var i = 0; i < pollsListFiltred.length; ++i) 
		if (pollsListFiltred[i].id === id) {
			html += '<h4>' + pollsListFiltred[i].subject + '</h4>';			
			html += '<p>' + pollsListFiltred[i].description + '</p>';
			pollsListFiltred[i].endDate = new Date(pollsListFiltred[i].endDate);
			if (pollsListFiltred[i].endDate >= currentDate) {				
				html += '<p style="color:red;">Mai sunt <b>' + from_milis_to_days(pollsListFiltred[i].endDate - currentDate) + '</b> zile pana la inchiderea votului.</p>';
				html += '<p>Sunteti de acord?</p>';
				html += '<div id="vote">';
				html += '<button id="da" class="btn btn-default" style="width:50%" onclick="submit_vote(id)">DA</button>';
				html += '<button id="nu" class="btn btn-default" style="width:50%" onclick="submit_vote(id)">NU</button>';
				html += '</div>';
			} else { 
				html += '<p>Votul s-a incheiat.</p>';
				html += '<span>Rezultatul votului este:' + /*procent*/ '100% DA -' /*procent*/ + '0% NU</span><br>';
			}
			
		}
	$("div#poll-vote").html(html);
}
function from_milis_to_days(date) {
	//86400000 milisecounds in a day
	var days = Math.round(date / 86400000);
	console.log(days);
	return days;
}

function submit_vote(id) {
	var vot;
	if (id === 'da')
		vot = 0;
	else
		vot = 1;
	$("div#vote").html('<p class="text-center"><b>Va multumim!</b></p>');
	$.post('votes/add', function(vot){
		console.log('Vot trimis cu succes.');
	});
}

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

//Variabile
var polls, filterList = [], idx = 0, pollsListFiltred = [];
var currentDate = new Date();
var countyList = ['Arad', 'Arges','Bacau','Bihor','Bistrita-Nasaud'];
//login
function login_info() {
	var username = $('#username').val();
	var password = $('#password').val();
	$.post("/login", {username: username, password: password}, function(){alert('daaa, a mers')}).fail(function() {
    	alert( "error" );
  	});
}
//end Login
//harta
function filter_by_county(id) {
	$.get('/polls/' + id)
	.done(function(data) { 
		return data;
	})
	.fail(function() {
    	alert( "error" );
  	});
  	polls = put_id($.parseJSON(data));
}

//Pentru test
polls = [{category: 'SP' , subject: 'Spital judetean' , description: 'laassjfbs sjbsj b bsjb js jsjb sbsbdsb sbdj sbjd bsjsbj sbj ' , startDate: '20/03/2017' , endDate: 'Wed Dec 22 2010 16:16:07 GMT+0000' },
		{category: 'SC' , subject: 'Scoala primara', description:'sdfsdfs sfsd', startDate: '12/04/2017' , endDate: '15/04/2017' },
		{category: 'DR', subject: 'Drumuri europene' , description: 'dfdfd' , startDate: '12/04/2017' , endDate: '22/06/2017'},
		{category: 'SP', subject: 'Spital central' , description: 'afdfsf dsfsd' , startDate: '21/04/2017' , endDate: '03/05/2017' }];

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
				html += '<li id="'+ polls[i].id + '" class="classForPolls" ><h4>' + polls[i].subject + '</h4></li>';
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
			/*if (pollsListFiltred[i].endDate >= currentDate) {*/
				html += '<p style="color:red;">Mai sunt <b>' + pollsListFiltred[i].endDate - currentDate + '</b> zile pana la inchiderea votului.</p>';
				html += '<p>Sunteti de acord?</p>';
				html += '<button id="da" class="btn btn-default" style="width:50%" onclick="submit_vote(id)">DA</button>';
				html += '<button id="nu" class="btn btn-default" style="width:50%" onclick="submit_vote(id)">NU</button>';
			/*} else { */
				html += '<p>Votul s-a incheiat.</p>';
				html += '<span>Rezultatul votului este:' + /*procent*/ '% DA -' /*procent*/ + '% NU</span><br>';
			/*}*/
			
		}
	$("div#poll-vote").html(html);
}

function submit_vote(id) {
	var vot;
	if (id === 'da')
		vot = 0;
	else
		vot = 1;
	$.post('votes/add', function(vot){
		console.log('Vot trimis cu succes.');
	});
}

//poll form data
function poll_info()
{
    var title = $('#pollTitle').val();
    var desc = $('pollDesc').val();
    var category = [];
    var county = [];

    $("input:checkbox[name=category]:checked").each(function(){
    category.push($(this).val());
    });

    $("input:checkbox[name=judet]:checked").each(function(){
    county.push($(this).val());
    });

    $.post("/addPoll", {Titlu: title, Description: desc, Categories:category, Counties: county}, function(){alert('daaa, a mers')}).fail(function() {
    	alert( "error" );
  	});
}

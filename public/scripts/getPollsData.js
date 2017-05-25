var polls, filterList = [], idx = 0, pollsListFiltred = [];
var currentDate = new Date();
$.draw ;

$( document ).ready(function() {

    $.urlParam = function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results[1] || 0;
    }

    function filter_by_county(id) {
        $.get('/pollsList?id=' + id)
        .done(function(data) {
            $.draw(data);
        })
        .fail(function() {
            alert("error");
        });
    };

    $.draw =function(data) {
        polls = data;
        var html = '<ol>';
        var p = 0;
        for (var i = 0; i < polls.length; ++i) {
            html += '<li id="'+ polls[i]._id + '"><h4>' + polls[i].subject + '</h4></li>';
            html += '<a href="#pollPopup" data-rel="popup" onclick="create_poll('+ "'" + polls[i]._id + "'" +')">';
            html += '<p>' + polls[i].description + '</p>';
            html += '</a>';
            pollsListFiltred[p++] = polls[i];
        }
        html += '</ol>';
        $('div#poll-list').html(html);
    }

    filter_by_county($.urlParam('region'));

});

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
    if(filterList.length === 0)
        $.draw(polls);
}

function create_polls_list() {
    var html = '<ol>';
    var p = 0;
    for(var i = 0; i < polls.length; ++i)
        polls[i].checked = false;
    for (var i = 0; i < polls.length; ++i) {
        for(var j = 0; j < filterList.length; ++j)
            for(var k = 0; k < polls[i].tags.length; ++k)
                if (polls[i].tags[k] === filterList[j] && !polls[i].checked) {
                    polls[i].checked = true;
                    html += '<li id="'+ polls[i]._id + '"><h4>' + polls[i].subject + '</h4></li>';
                    html += '<a href="#pollPopup" data-rel="popup" onclick="create_poll('+ "'" + polls[i]._id + "'" +')">';
                    html += '<p>' + polls[i].description + '</p>';
                    html += '</a>';
                    pollsListFiltred[p++] = polls[i];
                }
    }
    html += '</ol>';
    $("div#poll-list").html(html);
    
}
//in popup
function create_poll(id) {
    var html = '<div>';
    for(var i = 0; i < pollsListFiltred.length; ++i)
        pollsListFiltred[i].checked = false;
    for (var i = 0; i < pollsListFiltred.length; ++i) 
        if (pollsListFiltred[i]._id === id && !pollsListFiltred[i].checked) {
            pollsListFiltred[i].checked = true;
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
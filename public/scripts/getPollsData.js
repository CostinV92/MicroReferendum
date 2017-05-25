var polls, filterList = [], idx = 0, pollsListFiltred = [];
var currentDate = new Date();
$.draw ;
var currentUser;

$( document ).ready(function() {

    $.urlParam = function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results[1] || 0;
    }
    $.post('/getUser', function(res) {
        currentUser = res;
    });

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
    if(currentUser.roleId && currentUser.roleId === 1) {//adim
        for( var i = 0; polls.length; ++i){
            var time = new Date(polls[i].endDate);
            if(polls[i]._id === id){ 
             var html = '<div style="background:#F9F9F9; color:black; padding:20px;"><form id="adminPoll">'+
                '<div class="/*col-xs-6 */no-pad">' +
                'Titlu: <input type="text" id="pollTitle" value='+ polls[i].subject  +' disabled>'+
                '</div>'+
                '<div class="/*col-xs-of*/fset-1 /*col-xs-5"*/ style="padding-left: 0px !important;padding-right: 0px !important;">'+
                'Data de incheiere a votarii:  '+ time.getDate() +'.0' +time.getMonth()+ '.' + time.getFullYear() +
                '<br>Alegeti o data noua  ' +
                    '<input type="date" name="endVote" style="line-height: 10px !important;" id="endDate" disabled>'+
                '</div>'+
                '<span>Descriere:  <span> <textarea id="pollDesc" rows="5" cols="50" disabled>' + polls[i].description + '</textarea>'+
                '<div class="/*col-xs-12*/ row" style="margin-top: 30px;">'+
                'Categoria veche/Categoriile vechi: ';
                for(var k = 0; k < polls[i].tags.length; ++k)
                    html +=  polls[i].tags[k] + ' ';
                html += '<br>Categoria noua/Categoriile noi: <br>' +
                    '<input style="float:left;margin-left:25px;" type="checkbox" class="messageCheckbox" value="Drumuri" name="category" id="DR" onclick="add_cat(name)" disabled>' +
                    '<label>Transporturi</label>'+
                    '<input style="float:left;margin-left:25px;" type="checkbox" class="messageCheckbox" value="Spitale" name="category" id="SP" onclick="add_cat(name)" disabled>' +
                    '<label>Santate</label>' +
                    '<input style="float:left;margin-left:25px;" type="checkbox" class="messageCheckbox" value="Scoli" name="category" id="SC" onclick="add_cat(name)" disabled>' +
                    '<label>Educatie</label>' +
                    '<input style="float:left;margin-left:25px;" type="checkbox" class="messageCheckbox" value="Aparare" name="category" id="AP" onclick="add_cat(name)" disabled>' +
                    '<label>Aparare</label>' +
                    '<input style="float:left;margin-left:25px;" type="checkbox" class="messageCheckbox" value="Agricultura" name="category" id="AG" onclick="add_cat(name)" disabled> ' +
                    '<label>Agricutura</label>' +
                    '<input style="float:left;margin-left:25px;" type="checkbox" class="messageCheckbox" value="Sport" name="category" id="SP" onclick="add_cat(name)" disabled>' +
                    '<label>Sport</label>' +
                    '<input style="float:left;margin-left:25px;" type="checkbox" class="messageCheckbox" value="Spatii verzi" name="category" id="SV" onclick="add_cat(name)" disabled' +
                    '<label>Spatii Verzi</label>' +
                    '<input style="float:left;margin-left:25px;" type="checkbox" class="messageCheckbox" value="Economie" name="category" id="EC" onclick="add_cat(name)" disabled>' +
                    '<label>Economie</label>' +
                    '<input style="float:left;margin-left:25px;" type="checkbox" class="messageCheckbox" value="Altele" name="category" id="AL" onclick="add_cat(name)" disabled>' +
                    '<label>Altele</label>' +
                '</div>' +
                '<div class="/*col-xs-12*/">' +
                    '<div class="/*col-xs-3 */row" style="margin-top: 30px;">'+
                    'Judetul actual:  ';
                for(var j = 0; j < polls[i].region.length; ++j)
                    html +=  polls[i].region[j] + ' ';
                html += '<br>Noul judet/noile judete:<br>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="B" name="judet" value="B"disabled>' +
                        '<label>Bucuresti</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="BH" name="judet" value="BH"disabled>' +
                        '<label>Bihor</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="AR" name="judet" value="AR"disabled>' +
                        '<label>Arad</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="TM" name="judet" value="TM"disabled>' +
                        '<label>Timisoara</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="CS" name="judet" value="CS"disabled>' +
                        '<label>Caras-Severin</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="MH" name="judet" value="MH"disabled>' +
                        '<label>Mehedinti</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="GJ" name="judet" value="GJ"disabled>' +
                        '<label>Gorj</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="HD" name="judet" value="HD"disabled>' +
                        '<label>Hunedoara</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="AB" name="judet" value="AB"disabled>' +
                        '<label>Alba-Iulia</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="CJ" name="judet" value="CJ"disabled>' +
                        '<label>Cluj-Napoca</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="SJ" name="judet" value="SJ" disabled>' +
                        '<label>Salaj</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="SM" name="judet" value="SM" disabled>' +
                        '<label>Satu Mare</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="MM" name="judet" value="MM" disabled>' +
                        '<label>Maramures</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="BN" name="judet" value="BN" disabled>' +
                        '<label>Bistrita-Nasaud</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="MS" name="judet" value="MS" disabled>' +
                        '<label>Mures</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="SB" name="judet" value="SB" disabled>' +
                        '<label>Sibiu</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="VL" name="judet" value="VL" disabled>' +
                        '<label>Valcea</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="DJ" name="judet" value="DJ" disabled>' + 
                        '<label>Dolj</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="OT" name="judet" value="OT" disabled>' +
                        '<label>Olt</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="TR" name="judet" value="TR" disabled>' +
                        '<label>Teleorman</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="AG" name="judet" value="AG" disabled>' +
                        '<label>Arges</label>' +
                    '</div>' +
                    '<div class="/*col-xs-3 */row" style="margin-top: 30px;">' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="BV" name="judet" value="BV" disabled>' +
                        '<label>Brasov</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="HR" name="judet" value="HR" disabled>' +
                        '<label>Harghita</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="SV" name="judet" value="SV" disabled>' +
                        '<label>Suceava</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="CV" name="judet" value="CV" disabled>' +
                        '<label>Covasna</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="DB" name="judet" value="DB" disabled>' +
                        '<label>Dambovita</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="GR" name="judet" value="GR" disabled>' +
                        '<label>Giurgiu</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="IF" name="judet" value="IF" disabled>' +
                        '<label>Ilfov</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="PH" name="judet" value="PH" disabled>' +
                        '<label>Prahova</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="NT" name="judet" value="NT" disabled>' +
                        '<label>Neamt</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="BC" name="judet" value="BC" disabled>' +
                        '<label>Bacau</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="VN" name="judet" value="VN" disabled>' +
                        '<label>Vrancea</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="BZ" name="judet" value="BZ" disabled>' +
                        '<label>Buzau</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="IL" name="judet" value="IL" disabled>' +
                        '<label>Ialomita</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="CL" name="judet" value="CL" disabled>' +
                        '<label>Calarasi</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="BR" name="judet" value="BR" disabled>' +
                        '<label>Braila</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="GL" name="judet" value="GL" disabled>' +
                        '<label>Galati</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="VS" name="judet" value="VS" disabled>' +
                        '<label>Vaslui</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="IS" name="judet" value="IS" disabled>' +
                        '<label>Iasi</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="BT" name="judet" value="BT" disabled>' +
                        '<label>Botosani</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="TL" name="judet" value="TL" disabled>' +
                        '<label>Tulcea</label>' +
                        '<input style="float:left;margin-left:25px;" type="checkbox" id="CT" name="judet" value="CT" disabled>' +
                       ' <label>Constanta</label>' +
                    '</div>' +
                '</div>' +
                '<div id="butoane-CRUD" style="float:right;margin-bottom:50px;">' +
                    '<button onclick="editPoll()">Editeaza</button><!-- devine salveaza cu onclick="poll_info()"-->' +
                    '<button onclick="deletePoll('+ polls[i]._id +'">Sterge</button><!-- devine renunta si inchide popup-ul-->' +
                '</div>' +
            '</form></div>'
            break;
            }
        }
        $("div#poll-vote").html(html);
    }
    else {
        var html = '<div>';
        var counter = 0;
        var checked = 0;
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
                        if(!currentUser.roleId)
                            html += 'Trebuie sa fii autentificat pentru a putea vota!';
                        else {
                            for(var l = 0; l < currentUser.votedOn.length; ++l)
                                if(currentUser.votedOn[l] === pollsListFiltred[i]._id) {
                                    html += 'Deja ati votat. Va multumim!';
                                    counter++;
                                }
                            if(counter === 0 && checked == 0){
                                checked ++;
                                html += '<p>Sunteti de acord?</p>';
                                html += '<div id="votes">';
                                html += '<button id="da" class="btn btn-default" style="width:50%" onclick="submit_vote(id,'+"'"+pollsListFiltred[i]._id+"'"+')">DA</button>';
                                html += '<button id="nu" class="btn btn-default" style="width:50%" onclick="submit_vote(id,'+"'"+pollsListFiltred[i]._id+"'"+')">NU</button>';
                            }
                        }
                    html += '</div>';
                } else { 
                    html += '<p>Votul s-a incheiat.</p>';
                    html += '<span>Rezultatul votului este:' + /*procent*/ '100% DA -' /*procent*/ + '0% NU</span><br>';
                }
                
            }
        $("div#poll-vote").html(html);
    }
    
}

function from_milis_to_days(date) {
    //86400000 milisecounds in a day
    var days = Math.round(date / 86400000);
    return days;
}

function submit_vote(id, pollId) {
    var vot;
    if (id === 'da')
        vot = 1;
    else
        vot = 0;
    $("div#votes").html('<p class="text-center"><b>Va multumim!</b></p>');
    $.post('vote', { poll_id: pollId , vote: vot }, function(vot){
        console.log('Vot trimis cu succes.');
    });
}

function editPoll() {
   event.preventDefault();
   $('input').removeAttr("disabled"); // Element(s) are now enabled.
   $('textarea').removeAttr("disabled");
   $('#butoane-CRUD').html("<button onclick='poll_info()'>Salveaza</button><button onclick='closePoll()'>Renunta</button>");
}

function deletePoll(id) {
    for(var i = 0; polls.length; ++i){
        polls.splice(i,1);
        polls.length--;
    }
    $.post('/deletePoll', { _id: id }, function(){
        console.log('Succes');
    });
}

function closePoll() {
    $('div#poll-vote').hide();
}
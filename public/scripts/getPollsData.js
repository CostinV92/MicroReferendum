$( document ).ready(function() {

    $.urlParam = function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results[1] || 0;
    }

    function filter_by_county(id) {
        $.get('/pollsList?id=' + id)
        .done(function(data) {
            draw_data(data);
        })
        .fail(function() {
            alert("error");
        });
    };

    function draw_data(data) {
        polls = put_id(data);
        var html = '<ol>';
        var p = 0;
        for (var i = 0; i < polls.length; ++i) {
            html += '<li id="'+ polls[i].id + '"><h4>' + polls[i].subject + '</h4></li>';
            html += '<a href="#pollPopup" data-rel="popup" onclick="create_poll('+ "'" + polls[i].id + "'" +')">';
            html += '<p>' + polls[i].description + '</p>';
            html += '</a>';
            pollsListFiltred[p++] = polls[i];
        }
        html += '</ol>';
        $('div#poll-list').html(html);
    }

    function put_id(data) {
        var index = 0;
        for (var i = 0; i < data.length; ++i) 
            data[i].id = "poll-no-" + index++;
        return data;
    }

    filter_by_county($.urlParam('region'));
});
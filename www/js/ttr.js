// Initialize your app
var myApp = new Framework7({
    modalTitle: 'TTR Tracker'
});

var jsStrings;

var todoData = localStorage.td7Data ? JSON.parse(localStorage.td7Data) : [];
var appSettings = localStorage.ttrAppSettings ? JSON.parse(localStorage.ttrAppSettings) : [];

// Export selectors engine
var $$ = Framework7.$;

document.addEventListener("resume", onResume, false);

function onResume() {
    loadJsStrings();
    $('.player-name').attr("placeholder", jsStrings.player.name_placeholder);
}

function loadJsStrings(){
    jsStrings = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': 'ttr-' + getLanguage() + '.json',
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
}

function loadSettings(){
    var tempChecked;
    var tempCount;
    if (localStorage != null
        && localStorage.ttrAppSettings != null
        && JSON.parse(localStorage.ttrAppSettings) != null)
    {
        tempChecked = JSON.parse(localStorage.ttrAppSettings).isCountTrains;
        tempCount =  JSON.parse(localStorage.ttrAppSettings).numTrains;
    } else{
        tempChecked = true
        tempCount =  45;
    }
    $('.popup-settings input[name="isCountTrains"]').prop('checked', tempChecked);
    $('.popup-settings #num-trains').val(tempCount);

}

$(function(){
    var appLaunchCount = window.localStorage.getItem('launchCount');
    if(appLaunchCount){
    }else{
        window.localStorage.setItem('launchCount',1);
        appSettings = {
            isCountTrains: true,
            numTrains: 45
        };
        localStorage.ttrAppSettings = JSON.stringify(appSettings);
    }
    loadSettings();
    loadJsStrings();

    todoData = localStorage.td7Data ? JSON.parse(localStorage.td7Data) : [];
    appSettings = localStorage.ttrAppSettings ? JSON.parse(localStorage.ttrAppSettings) : [];

    $("[data-localize]").localize("ttr", { language : getLanguage()} );
    $('.player-name').attr("placeholder", jsStrings.player.name_placeholder);
});

// Add views
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$$('.popup').on('open', function () {
    $$('body').addClass('with-popup');
});
$$('.popup-player').on('opened', function () {
    $$(this).find('input[name="title"]').focus();
});
$$('.popup').on('close', function () {
    $$('body').removeClass('with-popup');
    $$(this).find('input[name="title"]').blur().val('');
});

$$('.popup-players').on('open', function(){
   $$('player-name').focus();
});

// Popup colors
$$('.popup .color').on('click', function () {
    $$('.popup .color.selected').removeClass('selected');
    $$(this).addClass('selected');
});

// Add Player
$$('.popup .add-task').on('click', function () {
    var title = $$('.popup input[name="title"]').val().trim();
    if (title.length === 0) {
        return;
    }
    var color = $$('.popup .color.selected').attr('data-color');
    todoData.push({
        title: title,
        color: color,
        checked: '',
        id: (new Date()).getTime(),
        score: 0
        ,trains: appSettings.numTrains
    });
    localStorage.td7Data = JSON.stringify(todoData);
    buildPlayerListHtml();

    myApp.closeModal('.popup');
});

// Save Settings
$$('.popup-settings .save-settings').on('click', function () {
    var isCountTrains = ($$('.popup-settings input[name="isCountTrains"]').is(':checked'));
    if (!isCountTrains){
        myApp.confirm(jsStrings.dialog.you_sure,
            function(){
                $$('.train-count').hide();
                extendedSaveSettings();
                myApp.closeModal('.popup-settings');
            }, function(){
                $$('.train-count').showinline();
                $('.popup-settings input[name="isCountTrains"]').prop('checked', true);
            }, jsStrings.dialog.whoa);
    } else {
        myApp.confirm(jsStrings.dialog.midgame_change,
            function(){
                resetRemainingTrains();
                clearAllScores();
                $$('.train-count').showinline();
                extendedSaveSettings();
                myApp.closeModal('.popup-settings');
            }, function(){
                $('.popup-settings input[name="isCountTrains"]').prop('checked', false);
            }, jsStrings.dialog.whoa);
    }


});

function extendedSaveSettings(){
    var numTrains = $$('.popup-settings #num-trains').val();
    var isCountTrains = ($$('.popup-settings input[name="isCountTrains"]').is(':checked'));

    appSettings = {
        isCountTrains: isCountTrains,
        numTrains: numTrains
    };

    var temp;
    if (localStorage != null
        && localStorage.ttrAppSettings != null
        && JSON.parse(localStorage.ttrAppSettings) != null
        && JSON.parse(localStorage.ttrAppSettings).numTrains != null)
    {
        temp = JSON.parse(localStorage.ttrAppSettings).numTrains;
    } else {
        temp = -1;
    }

    if (temp !== numTrains) {
        resetRemainingTrains();
        clearAllScores();
    }
    localStorage.ttrAppSettings = JSON.stringify(appSettings);
    myApp.closeModal('.popup-settings');
};

// Build Player HTML
var todoItemTemplate = $$('#todo-item-template').html();
function buildPlayerListHtml() {
    loadJsStrings();
    var html = '';
    for (var i = 0; i < todoData.length; i++) {
        var todoItem = todoData[i];
        var trainsLeftYo = todoItem.trains || 0;
        html += todoItemTemplate
                    .replace(/{{title}}/g, todoItem.title)
                    .replace(/{{color}}/g, todoItem.color)
                    .replace(/{{checked}}/g, todoItem.checked)
                    .replace(/{{score}}/g, todoItem.score || 0)
                    .replace(/{{trains}}/g, trainsLeftYo + ' ' + jsStrings.info.trains_left)
                    .replace(/{{id}}/g, todoItem.id);
    }
    $$('.todo-items-list ul').html(html);
    if (!appSettings.isCountTrains){
        $$('.train-count').hide();
    } else {
        $$('.train-count').showinline();
    }
    bindPlayerClick();
}
// Build HTML on App load
buildPlayerListHtml();

// Build Settings Popup
function buildSettingsPopup(){
    var isCountTrains = appSettings.isCountTrains;
    if (isCountTrains){
        $$('.popup-settings input[name="isCountTrains"]').attr('checked', 'checked');
    } else{
        document.getElementById("isCountTrains").checked = false;
    }
    var numTrains = appSettings.numTrains;
    $$('.popup-settings #num-trains').val(numTrains);
}
buildSettingsPopup();

// Delete item
$$('.todo-items-list').on('delete', '.swipeout', function () {
    var id = $$(this).attr('data-id') * 1;
    var index;
    for (var i = 0; i < todoData.length; i++) {
        if (todoData[i].id === id) index = i;
    }
    if (typeof(index) !== 'undefined') {
        todoData.splice(index, 1);
        localStorage.td7Data = JSON.stringify(todoData);
    }
});

// Update app when manifest updated
// http://www.html5rocks.com/en/tutorials/appcache/beginner/
// Check if a new cache is available on page load.
window.addEventListener('load', function (e) {
    FastClick.attach(document.body);
    window.applicationCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
            // Browser downloaded a new app cache.
            myApp.confirm('A new version of TTR Tracker is available. Do you want to load it right now?', function () {
                window.location.reload();
            });
        } else {
            // Manifest didn't changed. Nothing new to server.
        }
    }, false);
}, false);

function changePoints(dis, score){
    myApp.actions(
        [
            [
                {text:jsStrings.dialog.played_trains, label:true},
                {text:'1 '+ jsStrings.info.train +' (+1)', onClick:function(){
                    score += 1;
                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 1)){
                        changeDaScoreYo(dis, score);
                    }
                }},
                {text:'2 '+ jsStrings.info.trains +' (+2)', onClick:function(){
                    score += 2;
                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 2)){
                        changeDaScoreYo(dis, score);
                    }
                }},
                {text:'3 '+ jsStrings.info.trains +' (+4)', onClick:function(){
                    score += 4;
                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 3)){
                        changeDaScoreYo(dis, score);
                    }
                }},
                {text:'4 '+ jsStrings.info.trains +' (+7)', onClick:function(){
                    score += 7;
                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 4)){
                        changeDaScoreYo(dis, score);
                    }
                }},
                {text:'5 '+ jsStrings.info.trains +' (+10)', onClick:function(){
                    score += 10;
                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 5)){
                        changeDaScoreYo(dis, score);
                    }
                }},
                {text:'6 '+ jsStrings.info.trains +' (+15)', onClick:function(){
                    score += 15;
                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 6)){
                        changeDaScoreYo(dis, score);
                    }
                }},
                {text:'&gt; 6 '+ jsStrings.info.trains, onClick:function(){
                    myApp.actions(
                        [
                            [
                                {text:jsStrings.dialog.played_trains, label:true},
                                {text:'7 '+ jsStrings.info.trains +' (+18)', onClick:function(){
                                    score += 18;
                                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 7)){
                                        changeDaScoreYo(dis, score);
                                    }
                                }},
                                {text:'8 '+ jsStrings.info.trains +' (+21)', onClick:function(){
                                    score += 21;
                                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 8)){
                                        changeDaScoreYo(dis, score);
                                    }
                                }},
                                {text:'9 '+ jsStrings.info.trains +' (+27)', onClick:function(){
                                    score += 27;
                                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 9)){
                                        changeDaScoreYo(dis, score);
                                    }
                                }},
                                {text:jsStrings.info.custom, red:true, onClick:function(){
                                    myApp.actions(
                                        [
                                            [
                                                {text:jsStrings.dialog.points_adjust, label:true},
                                                {text:jsStrings.info.add_points, onClick:function(){
                                                    myApp.prompt(jsStrings.dialog.how_many_add, function(num){
                                                        num = num || 0;
                                                        score += parseInt(num, 10);
                                                        changeDaScoreYo(dis, score);
                                                    }, null, 'number')
                                                }},
                                                {text:jsStrings.info.sub_points, red:true, onClick:function(){
                                                    myApp.prompt(jsStrings.dialog.how_many_sub, function(num){
//                                                        myApp.confirm(jsStrings.dialog.you_sure_sub, function(){
                                                            num = num || 0;
                                                            score -= parseInt(num, 10);
                                                            if (score < 0) score = 0;
                                                            changeDaScoreYo(dis, score);
//                                                            disableTrainCounting();
//                                                        })
                                                    }, null, 'number')
                                                }}
                                            ],
                                            [
                                                { text:jsStrings.info.go_back, bold:true, onClick: function(){
                                                    $$(dis).click();
                                                }}
                                            ]
                                        ]);
                                }}
                            ],
                            [
                                { text:jsStrings.info.go_back, bold:true, onClick: function(){
                                    $$(dis).click();
                                }}
                            ]
                        ]);
                }},
                {text: jsStrings.info.custom + ' (+/-)', red:true, onClick:function(){
                    myApp.actions(
                        [
                            [
                                {text:jsStrings.dialog.points_adjust, label:true},
                                {text:jsStrings.info.add_points, onClick:function(){
                                    myApp.prompt(jsStrings.dialog.how_many_add, function(num){
                                        num = num || 0;
                                        score += parseInt(num, 10);
                                        changeDaScoreYo(dis, score);
                                    }, null, 'number')
                                }},
                                {text:jsStrings.info.sub_points, red:true, onClick:function(){
                                    myApp.prompt(jsStrings.dialog.how_many_sub, function(num){
//                                        myApp.confirm(jsStrings.dialog.you_sure_sub, function(){
                                            num = num || 0;
                                            score -= parseInt(num, 10);
                                            if (score < 0) score = 0;
                                            changeDaScoreYo(dis, score);
//                                            disableTrainCounting();
//                                        })
                                    }, null, 'number')
                                }}
                            ],
                            [
                                { text:jsStrings.info.go_back, bold:true, onClick: function(){
                                    $$(dis).click();
                                }}
                            ]
                        ]);
                }}
            ],
            [
                { text:jsStrings.settings.cancel, bold:true}
            ]
        ]);
}

function changeDaScoreYo(el, newVal){
    $$(el).attr('data-score', newVal);
    $$(el).find('.item-score').text(newVal);

    var id = $$(el).parents('li').attr('data-id') * 1;
    for (var i = 0; i < todoData.length; i++) {
        if (todoData[i].id === id) {
            todoData[i].score = newVal;
            localStorage.td7Data = JSON.stringify(todoData);
        }
    }
}

function changeDaMothaTruckinTrainCountFoRealz(el, numTrainsRemoved){
    var localeVar = jsStrings.info.trains_left;
    var id = $$(el).parents('li').attr('data-id') * 1;
    for (var i = 0; i < todoData.length; i++) {
        if (todoData[i].id === id) {
            if (todoData[i].trains - numTrainsRemoved < 0){
                myApp.alert(jsStrings.dialog.neg_trains, jsStrings.dialog.whoa);
                return false;
            }
            var newCount = todoData[i].trains - numTrainsRemoved;
            if (newCount < 0) newCount = 0;
            if (newCount == 1) {localeVar = jsStrings.info.train_left; }

            todoData[i].trains = newCount;
            localStorage.td7Data = JSON.stringify(todoData);
        }
    }
    var newTrainLabel = newCount + ' ' + localeVar;
    $$(el).find('.train-count').text(newTrainLabel);
    return true;
}

$$('.clear-scores').on('click', function(){
    myApp.confirm(jsStrings.dialog.you_sure_clear, function(){
        resetRemainingTrains();
        clearAllScores();
        myApp.closeModal('.popup-settings');
    }, null, jsStrings.dialog.whoa);
});

function clearAllScores(){
    for (var i = 0; i < todoData.length; i++) {
        todoData[i].score = 0;
    }
    localStorage.td7Data = JSON.stringify(todoData);
    buildPlayerListHtml();
}

function resetRemainingTrains(){
    for (var i = 0; i < todoData.length; i++) {
        todoData[i].trains = appSettings.numTrains * 1;
    }
    localStorage.td7Data = JSON.stringify(todoData);
}

function bindPlayerClick(){
    $$('.player-data').on('click', function(){
        var dis = $$(this);
        var score = parseInt($$(this).attr('data-score'));
        changePoints(dis, score);
    });
}

function disableTrainCounting(){
    $$('.train-count').hide();
    appSettings = {
        isCountTrains: false,
        numTrains: appSettings.numTrains
    };
    localStorage.ttrAppSettings = JSON.stringify(appSettings);
    buildSettingsPopup();
}

function getLanguage() {
    if (navigator.language != undefined) {
        if (navigator.language.substr(0,2) == 'es') { return 'es'; }
        else if (navigator.language.substr(0,2) == 'fr') { return 'fr'; }
    }
    return 'en';
}

$('.settings-cancel').on('click', function(){
    loadSettings();
});


$(document).off('click', '.external');
$(document).on('click', '.external', function (e) {
    e.preventDefault();
    var targetUrl = $(this).attr('href');
    myApp.confirm("A mail client is required to be setup for this action.", function(){
      var resp = window.open(targetUrl, "_system", null);
    }, null, "Reminder");
});

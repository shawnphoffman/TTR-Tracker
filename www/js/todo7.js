// Initialize your app
var myApp = new Framework7({
    modalTitle: 'TTR Tracker'
});

// Export selectors engine
var $$ = Framework7.$;

// Add views
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

var todoData = localStorage.td7Data ? JSON.parse(localStorage.td7Data) : [];
var appSettings = localStorage.ttrAppSettings ? JSON.parse(localStorage.ttrAppSettings) : [];

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
        $$('.train-count').hide();
    } else {
        $$('.train-count').showinline();
    }

    var numTrains = $$('.popup-settings #num-trains').val();

    appSettings = {
        isCountTrains: isCountTrains,
        numTrains: numTrains
    };

    var temp;
    if (localStorage != null && localStorage.ttrAppSettings != null && JSON.parse(localStorage.ttrAppSettings) != null
        && JSON.parse(localStorage.ttrAppSettings).numTrains != null){
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
});

// Build Player HTML
var todoItemTemplate = $$('#todo-item-template').html();
function buildPlayerListHtml() {
    var html = '';
    for (var i = 0; i < todoData.length; i++) {
        var todoItem = todoData[i];
        html += todoItemTemplate
                    .replace(/{{title}}/g, todoItem.title)
                    .replace(/{{color}}/g, todoItem.color)
                    .replace(/{{checked}}/g, todoItem.checked)
                    .replace(/{{score}}/g, todoItem.score || 0)
                    .replace(/{{trains}}/g, todoItem.trains || 0)
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

// Mark checked
$$('.todo-items-list').on('change', 'input', function () {
    var input = $$(this);
    var checked = input[0].checked;
    var id = input.parents('li').attr('data-id') * 1;
    for (var i = 0; i < todoData.length; i++) {
        if (todoData[i].id === id) todoData[i].checked = checked ? 'checked' : '';
    }
    localStorage.td7Data = JSON.stringify(todoData);
});

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
            myApp.confirm('A new version of ToDo7 is available. Do you want to load it right now?', function () {
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
                {text:'Select the number of trains played.', label:true},
                {text:'1 Train (+1)', onClick:function(){
                    score += 1;
                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 1)){
                        changeDaScoreYo(dis, score);
                    }
                }},
                {text:'2 Trains (+2)', onClick:function(){
                    score += 2;
                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 2)){
                        changeDaScoreYo(dis, score);
                    }
                }},
                {text:'3 Trains (+4)', onClick:function(){
                    score += 4;
                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 3)){
                        changeDaScoreYo(dis, score);
                    }
                }},
                {text:'4 Trains (+7)', onClick:function(){
                    score += 7;
                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 4)){
                        changeDaScoreYo(dis, score);
                    }
                }},
                {text:'5 Trains (+10)', onClick:function(){
                    score += 10;
                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 5)){
                        changeDaScoreYo(dis, score);
                    }
                }},
                {text:'6 Trains (+15)', onClick:function(){
                    score += 15;
                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 6)){
                        changeDaScoreYo(dis, score);
                    }
                }},
                {text:'&gt; 6 Trains', onClick:function(){
                    myApp.actions(
                        [
                            [
                                {text:'Select the number of trains played.', label:true},
                                {text:'7 Trains (+18)', onClick:function(){
                                    score += 18;
                                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 7)){
                                        changeDaScoreYo(dis, score);
                                    }
                                }},
                                {text:'8 Trains (+21)', onClick:function(){
                                    score += 21;
                                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 8)){
                                        changeDaScoreYo(dis, score);
                                    }
                                }},
                                {text:'9 Trains (+27)', onClick:function(){
                                    score += 27;
                                    if (!appSettings.isCountTrains || changeDaMothaTruckinTrainCountFoRealz(dis, 9)){
                                        changeDaScoreYo(dis, score);
                                    }
                                }},
                                {text:'Custom', red:true, onClick:function(){
                                    myApp.actions(
                                        [
                                            [
                                                {text:'Select the points adjustment to be applied. Keep in mind, points ' +
                                                    'adjustments do not affect remaining train counts.', label:true},
                                                {text:'Add Points', onClick:function(){
                                                    myApp.prompt("How many points would you like to add?", function(num){
                                                        score += parseInt(num, 10);
                                                        changeDaScoreYo(dis, score);
                                                    }, null, 'number')
                                                }},
                                                {text:'Subtract Points', red:true, onClick:function(){
                                                    myApp.prompt("How many points would you like to subtract?", function(num){
                                                        myApp.confirm("Are you sure you want to subtract points? This will disable train counting.", function(){
                                                            score -= parseInt(num, 10);
                                                            if (score < 0) score = 0;
                                                            changeDaScoreYo(dis, score);
                                                            disableTrainCounting();
                                                        })
                                                    }, null, 'number')
                                                }}
                                            ],
                                            [
                                                { text:'Go Back', bold:true, onClick: function(){
                                                    $$(dis).click();
                                                }}
                                            ]
                                        ]);
                                }}
                            ],
                            [
                                { text:'Go Back', bold:true, onClick: function(){
                                    $$(dis).click();
                                }}
                            ]
                        ]);
                }},
                {text:'Custom (+/-)', red:true, onClick:function(){
                    myApp.actions(
                        [
                            [
                                {text:'Select the points adjustment to be applied. Keep in mind, point ' +
                                    'adjustments do not affect remaining train counts.', label:true},
                                {text:'Add Points', onClick:function(){
                                    myApp.prompt("How many points would you like to add?", function(num){
                                        score += parseInt(num, 10);
                                        changeDaScoreYo(dis, score);
                                    }, null, 'number')
                                }},
                                {text:'Subtract Points', red:true, onClick:function(){
                                    myApp.prompt("How many points would you like to subtract?", function(num){
                                        myApp.confirm("Are you sure you want to subtract points? This will disable train counting.", function(){
                                            score -= parseInt(num, 10);
                                            if (score < 0) score = 0;
                                            changeDaScoreYo(dis, score);
                                            disableTrainCounting();
                                        })
                                    }, null, 'number')
                                }}
                            ],
                            [
                                { text:'Go Back', bold:true, onClick: function(){
                                    $$(dis).click();
                                }}
                            ]
                        ]);
                }}
            ],
            [
                { text:'Cancel', bold:true}
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
    var newText;
    var id = $$(el).parents('li').attr('data-id') * 1;
    for (var i = 0; i < todoData.length; i++) {
        if (todoData[i].id === id) {
            if (todoData[i].trains - numTrainsRemoved < 0){
                myApp.alert('You cannot have negative trains. Please select another option.', 'Whoa there, partner!');
                return false;
            }
            var newCount = todoData[i].trains - numTrainsRemoved;
            if (newCount < 0) newCount = 0;
            newText = newCount + ' trains';
            if (newCount == 1) newText = newText.substr(0, newText.length);
            newText += ' left';

            todoData[i].trains = newCount;
            localStorage.td7Data = JSON.stringify(todoData);
        }
    }
    $$(el).find('.train-count').text(newText);
    return true;
}

$$('.clear-scores').on('click', function(){
    myApp.confirm('Are you sure you want to clear the scores?', function(){
        resetRemainingTrains();
        clearAllScores();
        myApp.closeModal('.popup-settings');
    }, null, 'Whoa there, partner!');
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
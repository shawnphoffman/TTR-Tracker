require.config({
  baseUrl: './js/',
  paths: {
    jquery       : 'dist/jquery.min',
    underscore   : 'dist/underscore',
    Backbone     : 'dist/backbone',
    Marionette   : 'dist/marionette/backbone.marionette',
    framework7   : 'dist/framework7',
    handlebars   : 'dist/handlebars',
    hbs          : 'dist/hbs',
    'backbone.localstorage' : 'dist/backbone.localstorage/backbone.localStorage',
    'backbone.touch'        : 'dist/backbone.touch/backbone.touch.min'
  },
  shim: {
    framework7: {
      exports: 'Framework7'
    },
    handlebars: {
      exports: 'Handlebars'
    }
  }
});

require([
  'Backbone',
  'Marionette',

  'views/CheatCollectionView',

  'models/VersionCollection',
  'views/VersionCollectionView',

  'models/PlayerCollection',
  'views/PlayerCollectionView',

  'models/ScoreCollection',

  'framework7',
  'underscore',
  'handlebars',
  'backbone.touch'
  ], function(Backbone,
              Marionette,

              CheatCollectionView,

              VersionCollection,
              VersionCollectionView,

              PlayerCollection,
              PlayerCollectionView,

              ScoreCollection,

              Framework7,
              underscore){

  ttrTracker = new Framework7({
      modalTitle: 'TTR Train Tracker'
  });
  $$ = Framework7.$;

  // MARIONETTE APP
  ttrApp = new Backbone.Marionette.Application();
  ttrApp.on('start', function() {
    //console.log('TTR Tracker Started');
    // console.clear();
  });

  // HELPER MIXIN
  _.mixin({
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }
  });

  // VERSION MODULE
  ttrApp.versionsCollection = new VersionCollection();
  // if (ex === undefined || (version === undefined || version !== '2.0')) {
  //     ttrVersions.reset(returnVersions());
  //     window.localStorage.ttrAppVersion = '2.0';
  // }
  ttrApp.versionsCollection.fetch({
    success: function(data){
      if (data.length === 0){
        $.getJSON("js/static/cheats.json", function(json) {
          _.each(json, function(version){
            ttrApp.versionsCollection.create(version);
          });
        });
      }
    }
  });
  ttrApp.versionsView = new VersionCollectionView({ collection : ttrApp.versionsCollection });
  ttrApp.versionsView.render();
  $('#version-list').html(ttrApp.versionsView.el);

  // SCORES MODULE
  ttrApp.scoresCollection = new ScoreCollection();
  ttrApp.scoresCollection.fetch();

  // PLAYER MODULE
  ttrApp.playersCollection = new PlayerCollection();
  ttrApp.playersCollection.fetch({
    success: function(data){
      ttrApp.playersView = new PlayerCollectionView({ collection : ttrApp.playersCollection });
      ttrApp.playersView.render();
      $('#player-list').html(ttrApp.playersView.el);
    }
  });

  // CHEAT MODULE
  ttrApp.cheatsView = new CheatCollectionView({ collection : ttrApp.versionsCollection });
  ttrApp.cheatsView.render();
  $('#cheats').html(ttrApp.cheatsView.el);

  // == MENU HANDLERS ==
  // ADD PLAYER
  $('#addPlayerIcon').on('click', function(){
    ttrApp.playersView.addPlayer();
  });

  // CLEAR PLAYERS
  $('#clearPlayers').on('click', function() {
    //console.log('Clearing all players.');
    ttrTracker.confirm('Are you sure you want to clear all players?', function(){
      ttrApp.scoresCollection.clearAll();
      ttrApp.playersCollection.clearAll();
      location.reload();
    });
  });

  // CLEAR SCORES
  $('#clearScores').on('click', function() {
    //console.log('Clearing scores');

    ttrTracker.confirm('Are you sure you want to clear all scores?', function(){
      ttrApp.scoresCollection.clearAll();
      location.reload();
    });
  });

  // REVIEW SCORES
  $('#reviewScores').on('click', function() {
      //console.log('Review Scores');

      var temp = '';
      var index = 1;
      _.each(ttrApp.scoresCollection.models, function(score){
        var val = score.get('score') > 0 ? '+' + score.get('score') : score.get('score');
        var scoreLabel = Math.abs(score.get('score')) === 1 ? 'point' : 'points';
        var trainLabel = Math.abs(score.get('trains')) === 1 ? 'train' : 'trains';
        temp += '<b>#' + index++ + '</b>: ' + val + ' ' + scoreLabel + ' to '+ score.get('player') +' ('+score.get('trains')+' '+trainLabel+')<br />';
      });
      if (temp === '') { temp = 'No score history available.'; }
      ttrTracker.alert(temp, 'Score History');
  });

  // STUPID REFRESH LINK
  $('#refresh').click(function() {
    location.reload();
  });

  ttrApp.start();
});

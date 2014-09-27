define([
  'Backbone',
  'models/Score',
  'backbone.localstorage'
],
  function(Backbone, Score){
    ScoreCollection = Backbone.Collection.extend({

      localStorage: new Backbone.LocalStorage("ttrScores"),

      model: Score,

      initialize: function(){
        this.on('add', function () {
          //console.log("ScoreCollection - Scores Added");
        });
        this.on('reset', function(){
          //console.log("ScoreCollection - Scores Reset");

          ttrApp.playersView.remove();
          ttrApp.playersView.render();
          // $('#player-list').html(ttrApp.playersView.el);
        });
      },

      clearAll: function() {
        //console.log("ScoreCollection - clearAll");

        _.invoke($(this.models).toArray(), 'destroy');

        // ttrApp.playersView.remove();
        ttrApp.playersView.render();
        $('#player-list').html(ttrApp.playersView.el);
      },

      removePlayerScores: function(id) {
        //console.log("ScoreCollection - removePlayerScores");

        var toRemove = _.filter(this.models, function(score){
          return score.get('playerID') === id;
        });

        _.invoke($(toRemove).toArray(), 'destroy');
      },

      renameScores: function(id, name) {
        //console.log("ScoreCollection - renameScores");

        _.each(this.models, function(score){
          if (score.get('playerID') === id) {
            score.set({'player':name}).save();
          }
        });
      }
    });

    return ScoreCollection;
  }
);

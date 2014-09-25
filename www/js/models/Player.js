define(['Backbone', 'models/ScoreCollection'],
  function(Backbone,ScoreCollection){
    Player = Backbone.Model.extend({

        defaults: {
            name: "Player",
            score: 0,
            order: 0,
            color: "grey",
        },

        addScore: function(score){
          this.scores.add(score).save();
        }

    });
    return Player;
  }
);

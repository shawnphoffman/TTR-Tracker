define(['Backbone'],
  function(Backbone){
    Score = Backbone.Model.extend({
      defaults: {
        score: 0,
        trains: 0
      }
    });
    return Score;
  }
);

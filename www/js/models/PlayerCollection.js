define([
  'Backbone',
  'models/Player',
  'backbone.localstorage'
],
  function(Backbone, Player){
    PlayerCollection = Backbone.Collection.extend({

        localStorage: new Backbone.LocalStorage("ttrPlayers"),

        model: Player,

        comparator: function(player) {
          return player.get('order');
        },

        initialize: function() {
          this.on('add', function (player) {
            //console.log('Collection - Player added');

            var self = this;
            if (player.get('order') === 0){
              var withOrder = _.filter(self.models, function(plyr){
                return plyr.get('order') !== 0;
              });
              player.set({'order':withOrder.length+1});
            }
            self.sort({silent:true});
          });
        },

        clearAll: function() {
          ttrApp.playersView.destroy();
          _.invoke($(this.models).toArray(), 'destroy');
        },

        reSort: function(){
          //console.log('PlayerCollection Re-Sort');

          var self = this;
          var ind = 1;

          var sorted = _.sortBy(self.models, function(player){ return player.get('order'); });
          _.each(self.models, function(player) {
            player.set({'order': ind}, {silent: true}).save();
            ind++;
          });
        },
    });
    return PlayerCollection;
  }
);

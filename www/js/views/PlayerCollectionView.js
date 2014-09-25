define(['Backbone', 'Marionette', 'views/PlayerView'],
  function(Backbone, Marionette, PlayerView){

    PlayerCollectionView = Backbone.Marionette.CollectionView.extend({
      childView: PlayerView,
      tagName: 'ul',
      className: "players",

      initialize: function(){
        this.listenTo(this.collection, 'update', this.render);
      },

      getChildView: function(item) {
        var temp = new PlayerView();
        return temp;
      },

      buildChildView: function(child, ChildViewClass, childViewOptions){
        var options = _.extend({model: child}, childViewOptions);
        var view = new PlayerView(options);
        return view;
      },

      addPlayer: function(){
        //console.log('AddPlayer started', ttrApp.playersView.el);

        var self = this;

        ttrTracker.prompt('Please enter a name.', function(data){
          var name = data.replace(/[^\w]/ig, '');
          if (data === undefined || data === '') {
            var num = self.collection.length + 1;
            var newName = 'Player ' + num;
            var tempPlayerNames = _.filter(self.collection.models, function(p){
              return p.get('name') == newName;
            });
            if (tempPlayerNames.length > 0) {
              newName += "X";
            }
            name = newName;
          }
          self.collection.create({name: name});
          ttrTracker.closeModal();
          // ttrApp.playersView.render();
        });
      },

      // onBeforeAddChild: function(){
      //   //console.log('PlayerCollectionView - onBeforeAddChild');
      // },
      //
      // onAddChild: function(){
      //   //console.log('PlayerCollectionView - onAddChild');
      // }

    });

    return PlayerCollectionView;
  }
);

define(['Backbone', 'Marionette', 'views/CheatView'],
  function(Backbone, Marionette, CheatView){

    CheatCollectionView = Backbone.Marionette.CollectionView.extend({
      childView: CheatView,
      tagName: 'ul',
      className: "cheats-list",

      initialize: function(){
        this.listenTo(this.collection, 'update', this.render);
      },

      getChildView: function(item) {
        var temp = new CheatView();
        return temp;
      },

      buildChildView: function(child, ChildViewClass, childViewOptions){
        var options = _.extend({model: child}, childViewOptions);
        var view = new CheatView(options);
        return view;
      }
    });

    return CheatCollectionView;
  }
);

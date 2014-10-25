define(['Backbone', 'Marionette', 'views/VersionView'],
  function(Backbone, Marionette, VersionView){

    VersionCollectionView = Backbone.Marionette.CollectionView.extend({
      childView: VersionView,
      tagName: 'ul',
      className: "settings-ttr-version",

      initialize: function(){
        this.listenTo(this.collection, 'update', this.render);
      },

      getChildView: function(item) {
        // var temp = new VersionView();
        // return temp;
      },

      buildChildView: function(child, ChildViewClass, childViewOptions){
        var options = _.extend({model: child}, childViewOptions);
        var view = new VersionView(options);
        return view;
      }
    });

    return VersionCollectionView;
  }
);

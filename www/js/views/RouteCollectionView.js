define(['Backbone', 'Marionette', 'views/RouteView'],
  function(Backbone, Marionette, RouteView){

    RouteCollectionView = Backbone.Marionette.CollectionView.extend({
      childView: RouteView,
      tagName: 'ul',
      className: "ttr-routes",

      initialize: function(){
      },

      getChildView: function(item) {
        // var temp = new RouteView();
        // return temp;
      },

      buildChildView: function(child, ChildViewClass, childViewOptions){
        var options = _.extend({model: child}, childViewOptions);
        var view = new RouteView(options);
        return view;
      }
    });

    return RouteCollectionView;
  }
);

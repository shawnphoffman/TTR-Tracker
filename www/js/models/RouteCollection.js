define([
  'Backbone',
  'models/Route',
  'backbone.localstorage'
],
  function(Backbone, Route){
    RouteCollection = Backbone.Collection.extend({

        model: Route,

        comparator: function(route) {
          return route.get('rt');
        },

        clearAll: function() {
          ttrApp.routesView.destroy();
          _.invoke($(this.models).toArray(), 'destroy');
        }
    });
    return RouteCollection;
  }
);

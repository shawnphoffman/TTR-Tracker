define(['Backbone', 'Marionette', 'models/Version', 'hbs!templates/version-template', 'models/RouteCollection', 'views/RouteCollectionView'],
function(Backbone, Marionette, Version, template, RouteCollection, RouteCollectionView) {

    VersionView = Marionette.ItemView.extend( {
        tagName:  "li",

        model: Version,

        events: {
          'click .ttr-version' : 'radioToggle'
        },

        radioToggle: function(e) {
          // console.log('Version Toggled: ' + this.model.get('version'));

          _.map(ttrApp.versionsCollection.models, function(vers){
            vers.save({'currentVersion': false});
          });
          this.model.save({'currentVersion': true});
          ttrApp.currentVersion = this.model;
          ttrApp.scoresCollection.clearAllNoRender();

          location.reload();

          // ttrApp.playersView.remove({silent:true});
          // ttrApp.playersView.render();

          // ttrApp.playersView.$el.empty();
          // ttrApp.playersView.delegateEvents();
          // $('#player-list').append(ttrApp.playersView.render().el);
        },

        render: function() {
          // console.log('Rendering Version: ' + this.model.get('version'));

          var self = this;
          $(this.el).html(template(this.model.toJSON()));
          return this;
        }
    });

    return VersionView;
}
);

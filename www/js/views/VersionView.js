define(['Backbone', 'Marionette', 'models/Version', 'hbs!templates/version-template', 'models/RouteCollection', 'views/RouteCollectionView'],
function(Backbone, Marionette, Version, template, RouteCollection, RouteCollectionView) {

    VersionView = Marionette.ItemView.extend( {
        tagName:  "li",

        model: Version,

        events: {
          'click .ttr-version' : 'radioToggle'
        },

        initialize: function(){
          // window.ttrCurrentVersion = _.filter(window.ttrVersions.models, function(ver){ return ver.get('currentVersion'); })[0];
          // if (this.model.attributes) {
          //   this.listenTo(this.model, 'change', this.render);
          // }
        },

        radioToggle: function(e) {
          //console.log('Version Toggled: ' + this.model.get('version'));

          _.map(ttrApp.versionsCollection.models, function(vers){
            vers.save({'currentVersion': false});
          });
          this.model.save({'currentVersion': true});
          ttrApp.currentVersion = this.model;
          ttrApp.scoresCollection.clearAll();

          // ttrApp.playersView.remove();
          // ttrApp.playersView.render();
          // $('#player-list').html(ttrApp.playersView.el);

          location.reload();
        },

        render: function() {
          //console.log('Rendering Version: ' + this.model.get('version'));

          var self = this;
          $(this.el).html(template(this.model.toJSON()));
          return this;
        }
    });

    return VersionView;
}
);

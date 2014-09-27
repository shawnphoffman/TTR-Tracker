define([
    'Backbone',
    'models/Version',
    'backbone.localstorage'
], function (Backbone, Version) {
    VersionCollection = Backbone.Collection.extend({

        model: Version,

        localStorage: new Backbone.LocalStorage("ttrVersions"),

        initialize: function () {

          this.on('fetch', function () {
          });

          this.on('add', function (version) {
            //console.log('Collection - Version added');

            if (version.get('currentVersion') === true) {
              ttrApp.currentVersion = version;
              //console.log("Current Version");
            }
          });
        }
    });
    return VersionCollection;
  }
);

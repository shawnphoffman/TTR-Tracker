define(['Backbone', 'Marionette', 'models/Route', 'hbs!templates/route-template'],
function(Backbone, Marionette, Route, template) {

    RouteView = Marionette.ItemView.extend( {
        tagName:  "li",

        className: "ttr-route nopull",

        attributes: function() {
          if (this.model && this.model.attributes) {
            return {
              'data-pt': this.model.get('pt'),
              'data-rt': this.model.get('rt')
            };
          }
        },

        model: Route,

        events: {
          'click' : 'routeToggle'
        },

        routeToggle: function(e) {
          // console.log('Route Toggled: ' + this.model.get('rt'));

          var $self = $(e.target);

          if ($self.hasClass('nopull')) {
            $self.removeClass('nopull').addClass('green');
          } else if ($self.hasClass('green')) {
            $self.removeClass('green').addClass('red');
          } else {
            $self.removeClass('red').addClass('nopull');
          }

          // _.map(ttrApp.versionsCollection.models, function(vers){
          //   vers.save({'currentVersion': false});
          // });
          // this.model.save({'currentVersion': true});
          // ttrApp.currentVersion = this.model;
          // ttrApp.scoresCollection.clearAll();
          //
          // // ttrApp.playersView.remove();
          // // ttrApp.playersView.render();
          // // $('#player-list').html(ttrApp.playersView.el);
          //
          // location.reload();
        },

        render: function() {
          // console.log('Rendering Route: ' + this.model.get('rt'));

          var self = this;
          $(this.el).html(template(this.model.toJSON()));

          if (self.model.get('complete') === true){
            $(this.el).removeClass('nopull').addClass('green');
          } else if (self.model.get('complete') === false){
            $(this.el).removeClass('nopull').addClass('red');
          }

          return this;
        }
    });

    return RouteView;
}
);

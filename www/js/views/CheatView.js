define(['Backbone', 'Marionette', 'models/Version', 'hbs!templates/cheats-template'],
function(Backbone, Marionette, Version, template) {

    CheatView = Marionette.ItemView.extend( {
        tagName:  "li",

        className: "accordion-item",

        model: Version,

        render: function() {
          // //console.log('Rendering Cheat: ' + this.model.get('version'));

          var self = this;
          $(this.el).html(template(this.model.toJSON()));
          return this;
        }
    });

    return CheatView;
});

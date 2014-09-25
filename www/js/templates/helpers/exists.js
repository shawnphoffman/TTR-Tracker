define('templates/helpers/exists', ['hbs/handlebars'], function ( Handlebars ) {
  function exists(v, options) {
    if (ttrApp.currentVersion.get('numTrains')) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
  }
  Handlebars.registerHelper( 'exists', exists );
  return exists;
});

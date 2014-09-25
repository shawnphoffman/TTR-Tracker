define('templates/helpers/capitalize', ['hbs/handlebars'], function ( Handlebars ) {
  function capitalize(str) {
    if(str) return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  }
  Handlebars.registerHelper( 'capitalize', capitalize );
  return capitalize;
});

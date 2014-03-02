//  TODO: load RActive plugins using generic plugins folder scan
requirejs.config({
  baseUrl: 'js',
  paths: {
    'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
    'Backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
    'jquery': '//codeorigin.jquery.com/jquery-1.10.2.min',
    'html5shiv': '//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6/html5shiv.min',
    'Ractive': '//cdn.ractivejs.org/releases/0.3.9/Ractive.min',
    'Ractive-Backbone': 'lib/Ractive-Backbone.min',
    'Ractive-Events-Keys': 'lib/Ractive-events-keys.min',
    'Ractive-Events-Tap': 'lib/Ractive-events-tap.min',
    'Ractive-Transitions-Fade': 'lib/Ractive-transitions-fade.min',
    'Ractive-Transitions-Slide': 'lib/Ractive-transitions-slide.min',
    'moment': '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.4.0/moment.min',
    'socket.io': '/socket.io/socket.io'
  },
  shim: {
    'underscore': { exports: '_' },
    'Backbone': {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    'Ractive-Backbone' : ['Ractive'],
    'Ractive-Events-Keys' : ['Ractive'],
    'Ractive-Events-Tap' : ['Ractive'],
    'Ractive-Transitions-Fade' : ['Ractive'],
    'Ractive-Transitions-Slide' : ['Ractive'],
    'app' : [
      'Ractive-Backbone', 'Ractive-Events-Keys', 'Ractive-Events-Tap', 'Ractive-Transitions-Fade',
      'Ractive-Transitions-Slide', 'html5shiv']
  }
});

// Load the main app module to start the app
requirejs(['app']);
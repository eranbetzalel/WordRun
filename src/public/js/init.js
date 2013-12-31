requirejs.config({
  baseUrl: 'js',
  paths: {
    'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
    'Backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
    'jquery': '//codeorigin.jquery.com/jquery-1.10.2.min',
    'html5shiv': '//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6/html5shiv.min',
    'Ractive': '//cdnjs.cloudflare.com/ajax/libs/ractive.js/0.3.7/ractive.min',
    'Ractive-Backbone': 'lib/Ractive-Backbone.min',
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
    'app' : ['Ractive-Backbone']
  }
});

// Load the main app module to start the app
requirejs(['app']);
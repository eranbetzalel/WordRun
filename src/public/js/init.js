requirejs.config({
  'baseUrl': 'js',
  'paths': {
    'socket.io': '/socket.io/socket.io',
    'jquery': '//codeorigin.jquery.com/jquery-1.10.2.min',
    'html5shiv': '//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6/html5shiv.min',
    'ractive': '//cdnjs.cloudflare.com/ajax/libs/ractive.js/0.3.7/ractive.min',
    'moment': '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.4.0/moment.min',
    'config': 'config',
    'chat': 'chat'
    }
});

// Load the main app module to start the app
requirejs(['jquery', 'chat'], function ($, chatApp){
  $(function (){
    chatApp.init();
  });
});
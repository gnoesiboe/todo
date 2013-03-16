require.config({

  // as some libraries are not defined as require.js modules, we need to port specific variables in there so they can
  // act as modules
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  },

  // define some aliases for easy access
  paths: {
    jquery: 'lib/jquery/jquery',
    html5sortable: 'lib/html5sortable/jquery.sortable',
    backbone: 'lib/backbone/backbone',
    underscore: 'lib/underscore/underscore',
    localStorage: "lib/backbone.localstorage/backbone.localStorage"
  }
});

require(['app'], function(App) {
  (new App())
    .init()
    .dispatch()
  ;
});

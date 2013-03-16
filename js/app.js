define([
  'backbone',
  'router'
], function(Backbone, Router) {

  return (function() {

    /**
     * @type {Object}
     */
    var router = null;

    /**
     * Initiates the router for this application
     */
    var initRouter = function() {
      router = new Router();
    };

    /**
     * Initiates the history for this application
     */
    var initHistory = function() {
      Backbone.history.start({
        pushState: false
      });
    };

    // return the public interface for this object
    return {

      /**
       * Initiates this application
       *
       * @returns {App}
       */
      init: function() {
        initRouter();

        return this;
      },

      /**
       * Dispatches this app
       */
      dispatch: function() {
        initHistory();
      }
    }
  });
});
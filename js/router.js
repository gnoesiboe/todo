define([
  'lib/freshheads/router',
  'view/todo/subjectList'
], function(Router, TodoSubjectListView) {
  return Router.extend({

    /**
     * @extends Backbone.Router.routes
     */
    routes: {
      'index': 'index',

      // Default
      '*actions': 'homeAction'
    },

    /**
     * Homepage (default action)
     */
    homeAction: function() {
      var todoSubjectListView = new TodoSubjectListView();
      todoSubjectListView.render();
    }
  });
});
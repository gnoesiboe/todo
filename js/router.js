define([
  'backbone',
  'view/todo/subjectList'
], function(Backbone, TodoSubjectListView) {
  return Backbone.Router.extend({

    /**
     * @extends Backbone.Router.routes
     */
    routes: {

      // Default
      '*actions': 'homeAction'
    },

    /**
     * Homepage (default action)
     */
    homeAction: function() {
      (new TodoSubjectListView()).render();
    }
  });
});
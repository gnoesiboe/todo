define([
  'backbone'
], function(Backbone) {
  return Backbone.Collection.extend({

    /**
     * @return {Number}
     */
    getNextRank: function() {
      if (!this.length) {
        return 0;
      }

      return this.last().get('rank') + 1;
    },

    /**
     * @return {Number}
     *
     * @todo optimize so we don't need to loop through all collection models every time we want to have the next id
     */
    getNextId: function() {
      var highestId = 1;
      this.each(function(model) {
        if (model.get('id') >= highestId) {
          highestId = model.get('id') + 1;
        }
      });

      return highestId;
    }
  });
});
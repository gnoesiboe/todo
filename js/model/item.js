define([
  'backbone'
], function(Backbone) {
  return Backbone.Model.extend({

    /**
     * @type {String}
     */
    STATUS_ACTIVE: 'a',

    /**
     * @type {String}
     */
    STATUS_INACTIVE: 'i',

    /**
     * Object default values
     */
    defaults: {
      status: 'a'
    },

    /**
     * Togges the status of this model
     *
     * @return [Backbone.Model}
     */
    toggleStatus: function() {
      this.set('status', this.get('status') === this.STATUS_ACTIVE ? this.STATUS_INACTIVE : this.STATUS_ACTIVE);

      return this;
    },

    /**
     * Returns the CSS class used for the current status
     *
     * @return {String}
     */
    getStatusClass: function() {
      return this.get('status') === 'a' ? 'active' : 'inactive';
    }
  });
});
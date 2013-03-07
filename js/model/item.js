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
     * @return {String}
     */
    getAnchorKey: function() {
      return 'item-' + this.get('subject_id') + '-' + this.cid;
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
     * @return {String}
     */
    getStatusClass: function() {
      return this.get('status') === 'a' ? 'active' : 'inactive';
    }
  });
});
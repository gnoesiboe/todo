define([
  'collection/base',
  'localStorage',
  'model/item'
], function(BaseCollection, LocalStorage, Item) {
  return BaseCollection.extend({

    /**
     * Use localStorage for saving the items
     */
    localStorage: new LocalStorage('ItemCollection'),

    /**
     * Set model for this collection
     */
    model: Item,

    /**
     * @param {Backbone.Model} subject
     * @return {Backbone.Collection.models}
     */
    filterBySubject: function(subject) {
      return this.filterBySubjectId(subject.id);
    },

    /**
     * @param {Number} subjectId
     * @return {Backbone.Collection.models}
     */
    filterBySubjectId: function(subjectId) {
      return this.filter(function(item) {
        return Number(item.get('subject_id')) === Number(subjectId);
      });
    }
  });
});
define([
  'collection/base',
  'localStorage',
  'model/subject'
], function(BaseCollection, LocalStorage, Subject) {
  return BaseCollection.extend({

    /**
     * For storage we use local storage
     */
    localStorage: new LocalStorage('SubjectCollection'),

    /**
     * Set model for this collection
     */
    model: Subject
  });
});
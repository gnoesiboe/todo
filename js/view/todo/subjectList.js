define([
  'jquery',
  'underscore',
  'backbone',
  'collection/subject',
  'model/subject',
  'view/todo/subject',
  'text!templates/todo/subjectsList.html'
], function($, _, Backbone, SubjectCollection, Subject, SubjectView, subjectsListTemplate) {
  return Backbone.View.extend({

    /**
     * @type {Object}
     */
    subjectInputEl: null,

    /**
     * @type {Object}
     */
    subjectListEl: null,

    /**
     * @type {Object}
     */
    events: {
      'click #add-subject': 'onAddSubjectClick',
      'keyup input[name=subject]': 'onKeyUpInputSubject'
    },

    /**
     * @type {Backbone.Collection}
     */
    _collection: null,

    /**
     * Function that gets called during initializing of the view
     */
    initialize: function() {
      this.setElement($('#content'));

      // makes sure that all events are executed with 'this' as
      // the context instead of the callback caller object
      _.bindAll(this);

      this.listenTo(this.getSubjectCollection(), 'add', this.addSubject);
      this.getSubjectCollection().fetch();
    },

    /**
     * Gets called when the 'add-subject' button
     * is clicked
     */
    onAddSubjectClick: function(e) {
      var inputEl = $(e.target).parent().find('input[name=subject]'),
          value = $(inputEl).val();

      if (value.length > 0) {
        this.getSubjectCollection().create({
          id:     this.getSubjectCollection().getNextId(),
          title:  value,
          rank:   this.getSubjectCollection().getNextRank()
        });
      }

      this.resetSubjectInput();
    },

    /**
     * @param {Object} e
     */
    onKeyUpInputSubject: function(e) {
      // check is 'enter' key, if not, do nothing..
      if (e.which != 13) {
        return;
      }

      var inputEl = e.target,
          value = $(inputEl).val();

      if (value.length > 0) {
        this.getSubjectCollection().create({
          id:     this.getSubjectCollection().getNextId(),
          title:  value,
          rank:   this.getSubjectCollection().getNextRank()
        });
      }

      this.resetSubjectInput();
    },

    /**
     * Resets the subject input
     */
    resetSubjectInput: function() {
      this._getSubjectInputEl().val('');
    },

    /**
     * @return {Object}
     */
    _getSubjectInputEl: function() {
      if (_.isNull(this.subjectInputEl) === false) {
        return this.subjectInputEl;
      }

      this.subjectInputEl = $(this.el).find('input[name=subject]');
      return this.subjectInputEl;
    },

    /**
     * Renders this view
     */
    render: function() {
      $(this.el).html(_.template(subjectsListTemplate));
      this.renderSubjectList();
    },

    /**
     * @return {Object}
     */
    getSubjectListEl: function() {
      if (_.isObject(this.subjectListEl) === true) {
        return this.subjectListEl;
      }

      this.subjectListEl = $(this.el).find('.list-subjects')[0];
      return this.subjectListEl;
    },

    /**
     * (re)renders the complete subject list
     */
    renderSubjectList: function() {
      var self = this;

      _.each(this.getSubjectCollection().models, function(subject) {
        self.addSubject(subject);
      });
    },

    /**
     * @param {Backbone.Model} subject
     */
    addSubject: function(subject) {
      var subjectView = new SubjectView({
        model: subject
      });

      subjectView
        .setElement($('<li class="subject" />'))
        .render()
      ;

      $(this.getSubjectListEl()).append(subjectView.el);
    },

    /**
     * @return {Backbone.Collection}
     */
    getSubjectCollection: function() {
      if ((this._collection instanceof Backbone.Collection) === true) {
        return this._collection;
      }

      this._collection = new SubjectCollection();
      return this._collection;
    }
  });
});
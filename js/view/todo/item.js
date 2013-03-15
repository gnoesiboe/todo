define([
  'backbone',
  'text!templates/todo/item.html',
  'jquery'
], function(Backbone, TodoItemTemplate, $) {
  return Backbone.View.extend({

    /**
     * Defines the events for this view
     *
     * @extends {Backbone.View.events}
     */
    events: {
      'click input[type=checkbox]'  : 'onCheckboxClick',
      'click .close'                : 'onCloseClick',
      'dblclick'                    : 'onItemDoubleClick',
      'keyup input[name=title]'     : 'onInputTitleKeyup',
      'blur input[name=title]'      : 'onInputBlur'
    },

    /**
     * Gets called when the focus on the title text input
     * is lost.
     */
    onInputBlur: function() {
      this.toggleEditMode();
    },

    /**
     * Initialize function
     */
    initialize: function() {
      this.listenTo(this.model, 'change', this.onModelChange);
    },

    /**
     * Gets called when this view's model is changed
     */
    onModelChange: function() {
      this.render();
    },

    /**
     * Gets called when a key is released when in
     * the title input
     *
     * @param {Event} e
     */
    onInputTitleKeyup: function(e) {
      var keyPressed = parseInt(e.which);

      if (keyPressed === 13) {
        this.onInputEnter($(e.target).val());
      }
      else if (keyPressed === 27) {
        this.onInputEscape();
      }
    },

    /**
     * Gets called when the escape button is called when in editing mode
     */
    onInputEscape: function() {
      this.toggleEditMode();
    },

    /**
     * @param {String} value
     */
    onInputEnter: function(value) {
      this.toggleEditMode();

      this.model.set('title', value);
      this.model.save();
    },

    /**
     * Gets called when this element is double clicked
     */
    onItemDoubleClick: function() {
      this.toggleEditMode();
      this.$('input[name=title]').focus();
    },

    /**
     * Toggles the editing mode
     */
    toggleEditMode: function() {
      this.$el.toggleClass('edit');
    },

    /**
     * Gets called when an item is closed
     */
    onCloseClick: function() {
      if (confirm('Weet je zeker dat je dit item wilt verwijderen?') === true) {
        this.model.destroy();
        this.remove();
      }
    },

    /**
     * Gets called when a checkbox is clicked
     *
     * @param {jQuery.Event} e
     */
    onCheckboxClick: function(e) {
      this.$el.removeClass('inactive');
      this.model.toggleStatus().save();
    },

    /**
     * @return {Backbone.View}
     */
    render: function() {
      var itemEl = _.template(TodoItemTemplate, {
        item: this.model
      });

      this.$el.html(itemEl);

      this.clearEditMode();
      this.$el.addClass(this.model.getStatusClass());

      return this;
    },

    /**
     * Clears the edit mode
     */
    clearEditMode: function() {
      this.$el.removeClass('edit');
    }
  });
});
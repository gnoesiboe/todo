define([
  'backbone',
  'model/item',
  'view/todo/item',
  'text!templates/todo/subject.html',
  'collection/item',
  'html5sortable'
], function(Backbone, Item, ItemView, subjectTemplate, ItemCollection) {
  return Backbone.View.extend({

    /**
     * @type {Object}
     */
    inputEl: null,

    /**
     * @type {Object}
     */
    itemListEl: null,

    /**
     * @type {Backbone.Collection}
     */
    itemCollection: null,

    /**
     * @extends {Backbone.View.events}
     */
    events: {
      'click .delete-subject': 'onDeleteSubjectClick'
    },

    /**
     * Gets caled on view initialization
     */
    initialize: function() {
      // makes sure that all events are executed with 'this' as
      // the context instead of the callback caller object
      _.bindAll(this);

      // @todo add item doesn't need to refresh the whole list, just add a new item at the back
      this.listenTo(this.getItemCollection(), 'add remove', function() {
        this.renderItemList();
      });

      this.getItemCollection().fetch();
    },

    /**
     * Gets called when the close button is clicked
     *
     * @param {Object} e
     */
    onDeleteSubjectClick: function(e) {
      _.each(this.getItemCollection().filterBySubject(this.model), function(item) {
        item.destroy();
      });

      this.model.destroy();
      this.remove();
    },

    /**
     * Renders the view
     *
     * @return {Backbone.View}
     */
    render: function() {
      this.$el.append(this.renderTemplate());

      this.initEventListeners();
      this.renderItemList();

      return this;
    },

    /**
     * Renders the item list
     */
    resetItemList: function() {
      this.getItemListEl().html('');
    },

    /**
     * Renders the item list
     */
    renderItemList: function() {
      var self = this,
          itemsListEl = this.getItemListEl();

      // filter collection by subject and sort the returned items by rank
      var data = _.sortBy(this.getItemCollection().filterBySubject(this.model), function(model) {
        return model.get('rank');
      });

      _.each(data, function(item) {
        itemsListEl.append(self.renderItemView(item).el);
      });

      this.applySortableBehavior(itemsListEl);
    },

    /**
     * Applies the sortable behavior to the supplied element
     *
     * @param {Object} $el
     */
    applySortableBehavior: function($el) {
      $el.sortable({
        connectWith: '.list-items',
        scroll: true,
        dropOnEmpty: true
      }).bind('sortupdate', this.onItemsSorted);
    },

    /**
     * Gets called when the item list within this subject was sorted
     * by the user
     */
    onItemsSorted: function() {
      var self = this;

      this.$('.list-items > li').each(function(index, el) {
        var item = self.getItemCollection().get($(el).data('id'));

        // @todo when an item is moved from one list to the other but ends at the same index in the other list, this callback is not called!
        if (item instanceof Backbone.Model) {
          item.set({
            rank: index,
            subject_id: self.model.get('id')
          });
          item.save();
        }
      });
    },

    /**
     * @return {Backbone.Collection}
     */
    getItemCollection: function() {
      if (_.isNull(this.itemCollection) === false) {
        return this.itemCollection;
      }

      this.itemCollection = new ItemCollection();
      return this.itemCollection;
    },

    /**
     * Initiates the event listeners for this ivew
     */
    initEventListeners: function() {
      this.initInputEventListener();

      var self = this;
      this.getItemCollection().bind('add remove', function() {
        self.resetItemList();
        self.renderItemList();
      })
    },

    /**
     * Initiates the event listener for the 'add item'
     * text input
     *
     * @return {Boolean}
     */
    initInputEventListener: function() {
      if (this.getInputEl().length === 0) {
        return false;
      }

      var self = this;
      this.getInputEl().keyup(function(e) {
        self.onInputSubmit(e);
      });

      return true;
    },

    /**
     * @return {Object}
     */
    getItemListEl: function() {
      if (_.isNull(this.itemListEl) === false) {
        return this.itemListEl;
      }

      this.itemListEl = this.$('.list-items');
      return this.itemListEl;
    },

    /**
     * @return {Object}
     */
    getInputEl: function() {
      if (_.isNull(this.inputEl) === false) {
        return this.inputEl;
      }

      this.inputEl = this.$('input[name=item]');
      return this.inputEl;
    },

    /**
     * @param {Event} e
     */
    onInputSubmit: function(e) {

      // check is 'enter' key, if not, do nothing..
      if (e.which != 13) {
        return;
      }

      var inputEl = $(e.target),
          value = inputEl.val();

      if (value.length > 0) {
        this.getItemCollection().create({
          id:         this.getItemCollection().getNextId(),
          title:      value,
          subject_id: this.model.get('id'),
          rank:       this.$('.list-items > li').length
        });
      }

      this.resetTaskInput();
    },

    /**
     * Resets the value and settings
     * of the task text input field
     */
    resetTaskInput: function() {
      this.getInputEl().val('');
    },

    /**
     * @param {Backbone.Model} item
     * @return {Backbone.View}
     */
    renderItemView: function(item) {
      var view = new ItemView({
        model: item
      });

      view
        .setElement($('<li class="item" data-id="' + item.get('id') + '"/>'))
        .render()
      ;

      return view;
    },

    /**
     * @return {HTMLElement}
     */
    renderTemplate: function() {
      return _.template(subjectTemplate, {
        subject: this.model
      });
    }
  });
});
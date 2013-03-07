define(['underscore', 'lib/freshheads/inheritance'], function(_, inheritance) {

  return (function() {

    /**
     * Function that is used to provide the observer pattern for other classes. An instance of this
     * function can be used in combination with _.extend() to add event funtionalitity to
     * classes.
     *
     * @constructor
     */
    var EventDispatcher = function() {

      /**
       * Holds seperate callback methods for each instance
       * of this function
       *
       * @private
       * @type {Object}
       */
      this.callbacks = {};
    };

    _.extend(EventDispatcher.prototype, {

      /**
       * @type {String}
       */
      LOG_PREFIX: 'EVENT',

      /**
       * Checks wether or not this observer has an event set with
       * the specified identifier
       *
       * @param {String} identifier
       * @return {Boolean}
       */
      hasEvent: function(identifier) {
        return this.callbacks.hasOwnProperty(identifier);
      },

      /**
       * Validates wether or not a callback function is valid
       *
       * @param {Function}  callback
       * @throws {Error}    When callback is not valid
       */
      validateCallbackValid: function(callback) {
        if (_.isFunction(callback) === false) {
          throw new Error('A function should be supplied as event callback');
        }
      },

      /**
       * Adds a callback to a specified event.
       *
       * @param {string} identifier     Event identifier
       * @param {Function} callback     Callback function that needs to be fired once the event is triggered
       * @param {Object} context        Context in which the callback function needs to be run once the event is triggered
       *
       * @return {EventDispatcher}
       */
      addEventListener: function (identifier, callback, context) {
        this.validateCallbackValid(callback);

        if (this.hasEvent(identifier) === false) {
          this.callbacks[identifier] = [];
        }

        this.callbacks[identifier].push({
          callback: callback,
          context: context
        });

        return this;
      },

      /**
       * Removes an event callback
       *
       * @param {String} identifier
       * @param {Function} callback
       * @param {Object} context
       *
       * @return {EventDispatcher}
       */
      removeEventListener: function (identifier, callback, context) {
        this.validateCallbackValid(callback);

        if (this.hasEvent(identifier) === false) {
          return this;
        }

        var item = null;

        for (var i = 0, l = this.callbacks[identifier].length; i < l; i++) {
          item = this.callbacks[identifier][i];

          if (item.callback === callback && item.context === context) {
            delete this.callbacks[identifier][i];
          }
        }

        // delete leaves empty (type = 'undefined') array values, remove the empty values
        this.callbacks[identifier] = this.callbacks[identifier].filter(function() {
          return true;
        });

        return this;
      },

      /**
       * Triggers an event and executes all callbacks
       * from the right contexts
       *
       * @param {String} identifier
       * @param {Object} params
       *
       * @return {EventDispatcher}
       */
      triggerEvent: function (identifier, params) {
        params = params || {};

        if (this.hasEvent(identifier) === false) {
          return this;
        }

        var callbacks = this.callbacks[identifier],
            item = null,
            l = callbacks.length;

        for (var i = 0; i < l; i++) {
          item = callbacks[i];

          item.callback.call(item.context || this, params);
        }

        return this;
      }
    });

    // to be able to extend this function with Observer.extend({});
    EventDispatcher.extend = inheritance.extend;

    return EventDispatcher;
  })();

});
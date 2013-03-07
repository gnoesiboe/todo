/**
 * @author     Gijs Nieuwenhuis <gijs.nieuwenhuis@freshheads.com>
 */
define(['underscore', 'lib/freshheads/inheritance'], function(_, inheritance) {

  return (function() {

    /**
     * @constructor
     */
    var Configurable = function() {

      /**
       * Makes sure that each instance of this object holds it's own
       * set of options.
       *
       * @type {Object}
       */
      this._options = {};

    };

    _.extend(Configurable.prototype, {

      /**
       * @type {Object}
       */
      _defaultOptions: {},

      /**
       * @type {Array}
       */
      _requiredOptions: [],

      /**
       * Validates wether or not all the required options are
       * present
       *
       * @throws {Error}  When there are missing or incorrect options
       */
      _validateOptions: function() {
        var l = this._requiredOptions.length;
        if (l.length === 0) {
          return true;
        }

        var errors = [];

        for (var i = 0; i < l; i++) {
          var optionKey = this._requiredOptions[i];

          if (typeof this._options[optionKey] === 'undefined' || this._options[optionKey] === null) {
            errors.push(optionKey);
          }
        }

        if (errors.length > 0) {
          throw new Error('The following options are missing or incorrect: ' + errors.join(', '));
        }

        return true;
      },

      /**
       * @param {String} key
       */
      getOption: function(key) {
        this.validateHasOption(key);
        return this._options[key];
      },

      /**
       * @param {String} key
       * @return {Boolean}
       */
      hasOption: function(key) {
        return typeof this._options[key] !== 'undefined';
      },

      /**
       * @param {String} key
       * @throws Error   When the option doesn't exist
       */
      validateHasOption: function(key) {
        if (this.hasOption(key) === false) {
          throw new Error('Option: ' + key + ' doesn\'t exist');
        }
      },

      /**
       * @param {String} key
       * @param {Object} value
       */
      setOption: function(key, value) {
        this._options[key] = value;
      }
    });

    // to be able to extend this function with Configurable.extend({});
    Configurable.extend = inheritance.extend;

    return Configurable;
  })();
});
define(['underscore'], function(_) {

  /**
   * @author     Gijs Nieuwenhuis <gijs.nieuwenhuis@freshheads.com>
   */
  return (function() {

    var Logger = function() {};

    _.extend(Logger.prototype, {

      /**
       * The log levels that are allowed by the
       * javascript core
       *
       * @type {Array}
       */
      logLevels: ['debug', 'info', 'warn', 'error'],

      /**
       * Validates wether or not the supplied logging level
       * is allowed
       *
       * @throws {Error}
       * @param {String} level
       */
      validateLogLevel: function(level) {
        if (this.isValidLogLevel(level) === false) {
          throw new Error('Log level \'' + level + '\' not allowed');
        }
      },

      /**
       * @param {String} level
       * @return {Boolean}
       */
      isValidLogLevel: function(level) {
        return this.logLevels.indexOf(level) !== -1;
      },

      /**
       * Logs the supplied message with the supplied level
       * to the console.
       *
       * @param {String} message
       * @param {String|Array} prefixes
       * @param {String} level
       */
      log: function(message, prefixes, level) {
        if (_.isObject(message) === true) {
          this.logObject('Log object:', message, prefixes, level);
          return;
        }

        this.validateLogLevel(level);

        console[level]('[FH] ' + (typeof prefixes !== 'undefined' ? this._preparePrefixes(prefixes) : '')+ message);
      },

      /**
       * @param {String} message
       * @param {Object} object
       * @param {String|Array} prefixes
       * @param {String} level
       */
      logObject: function(message, object, prefixes, level) {
        this.validateLogLevel(level);

        console[level]('[FH] ' + (typeof prefixes !== 'undefined' ? this._preparePrefixes(prefixes) : '')+ message);
        console[level](object);
      },

      /**
       * @param {String|Array} prefixes
       * @return {String}
       * @private
       */
      _preparePrefixes: function(prefixes) {
        if (_.isArray(prefixes) === false) {
          prefixes = [prefixes];
        }

        var prefixString = '';

        for (var i = 0, l = prefixes.length; i < l; i++) {
          prefixString += '[' + prefixes[i] + '] ';
        }

        return prefixString;
      }
    });

    return Logger;
  })();
});
define([
  'underscore',
  'backbone',
  'lib/freshheads/eventDispatcher',
  'lib/freshheads/configurable',
  'lib/freshheads/logger',
  'lib/freshheads/inheritance',
  'router'
], function(_, Backbone, EventDispatcher, Configurable, Logger, inheritance, Router) {

  /**
   * @constructor
   *
   * @author     Gijs Nieuwenhuis <gijs.nieuwenhuis@freshheads.com>
   */
  return (function() {

    /**
     * @param {String} environment
     * @param {Object} configuration
     *
     * @constructor
     */
    var Sandbox = function(environment, configuration) {

      /**
       * @type {Object}
       */
      this._options = {};

      /**
       * The current environment in which this application runs
       */
      this._environment = null;

      /**
       * This application's instance's logger
       * @type {Logger}
       */
      this._logger = null;

      /**
       * This application's instance's router
       * @type {Router}
       */
      this._router = null;

      Sandbox.prototype._init.apply(this, arguments)
    };

    _.extend(Sandbox.prototype, new EventDispatcher(), new Configurable(), {

      _logPrefix: 'sandbox',

      /**
       * Defines the default log level
       *
       * @type {String}
       */
      _defaultLogLevel: 'debug',

      /**
       * @type {Object}
       * @extends Configurable._defaultOptions
       */
      _defaultOptions: {
        minLogLevel: 'warn',
        defaultLogLevel: 'debug'
      },

      /**
       * @type {Array}
       * @extends Configurable._requiredOptions
       */
      _requiredOptions: [],

      /**
       * Function that initiates this object
       *
       * @param {String} environment
       * @param {Object} options
       */
      _init: function(environment, options) {
        this._initEnvironment(environment);
        this._initOptions(options || {});
        this._initRouter();
        this._initHistory();
      },

      /**
       * @private
       */
      _initHistory: function() {
        Backbone.history.start({
          pushState: false
        });
      },

      /**
       * @param {Object} options
       */
      _initOptions: function(options) {
        this._options = _.extend({}, this._defaultOptions, options[this._environment] || {});
        this._validateOptions();
      },

      /**
       * @private
       */
      _initRouter: function() {
        this._router = new Router();
        // this._getLogger().logObject('Router routes:', this._router.routes, [this._logPrefix, 'router'], 'info');
      },

      /**
       * Validates and initiates the supplied
       * environment
       *
       * @param {String} environment
       */
      _initEnvironment: function(environment) {
        this._validateEnvironmentValid(environment);
        this._environment = environment;
      },

      /**
       * @param {String} environment
       * @throws {Error} when no valid environment is supplied
       */
      _validateEnvironmentValid: function(environment) {
        if (_.isString(environment) === false) {
          throw new Error('No valid environment defined');
        }
      },

      /**
       * Logs the supplied message with the supplied level
       * to the console.
       *
       * @param {String} message
       * @param {String} prefix
       * @param {String} level
       */
      log: function(message, prefix, level) {
        level = level || this._options.defaultLogLevel;
        this._getLogger().validateLogLevel(level);

        // only continue when allowed by the configuration
        if (this._meetsMinimumLogLevel(level) === false) {
          return;
        }

        this._getLogger().log(message, prefix, level);
      },

      /**
       * Dispatches the application
       */
      dispatch: function() {
        this.log('dispatch', this._logPrefix, 'info');
      },

      /**
       * @param level
       * @return {Boolean}
       * @private
       */
      _meetsMinimumLogLevel: function(level) {
        var minIndex = Logger.prototype.logLevels.indexOf(this._options.minLogLevel);
        var currentIndex = Logger.prototype.logLevels.indexOf(level);

        return minIndex <= currentIndex;
      },

      /**
       * @return {Logger}
       */
      _getLogger: function() {
        if (_.isNull(this._logger) === true) {
          this._logger = new Logger();
        }

        return this._logger;
      }
    });

    Sandbox.extend = inheritance.extend;

    return Sandbox;
  })();

});
/**
* @ngdoc service
* @name ng2Debug.providers:EventsProvider
* @description
* Provider configuration docs.
*/

/**
* @ngdoc service
* @name ng2Debug.services:Events
* @description
* Service consumption docs.
*/

angular
.module('ng2Debug')
.provider('DebugEvents', function () {
  var verbosity = 'v';
  var listeners = [];
  /**
   * @description
   * The actual service.
   */
  return {

    /**
     * Inject services used within your service here
     */
    $get: ['$rootScope', '$timeout', function ($rootScope, $timeout) {
      var debug = function (eventName) {
        return function (event, data) {
          var prefix = "debug::event";
          switch(verbosity.length) {
            case 0: break;
            case 1: console.log(prefix, eventName); break;
            case 2: console.log(prefix, eventName, data); break;
            case 3: console.log(prefix, eventName, data, event); break;
            default: console.log(prefix, eventName, data, event); break;
          }
        };
      };

      $rootScope.$on = function (name, listener) {
        var namedListeners = this.$$listeners[name];
        if (!namedListeners) {
          this.$$listeners[name] = namedListeners = [];
        }
        namedListeners.push(debug(name));
        namedListeners.push(listener);

        return function() {
          namedListeners[indexOf(namedListeners, listener)] = null;
        };
      }

      return {};
    }],

    setVerbosityLevel: function (level) {
      verbosity = level;
    }
  };
});
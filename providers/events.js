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
      var debug = function (eventName, type) {
        return function (event, data) {
          var prefix = "debug:event::"+type;
          switch(verbosity.length) {
            case 0: break;
            case 1: console.log(prefix, eventName); break;
            case 2: console.log(prefix, eventName, data); break;
            case 3: console.log(prefix, eventName, data, event); break;
            default: console.log(prefix, eventName, data, event); break;
          }
        };
      };

      function concat(array1, array2, index) {
        return array1.concat([].slice.call(array2, index));
      }

      $rootScope.$broadcast = function (name, args) {
        var target = this,
            current = target,
            next = target,
            event = {
              name: name,
              targetScope: target,
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            },
            listenerArgs = concat([event], arguments, 1),
            listeners, i, length;

        debug(name,'trigger').apply(this, listenerArgs);
        //down while you can, then up and next sibling or up and next sibling until back at root
        do {
          current = next;
          event.currentScope = current;
          listeners = current.$$listeners[name] || [];
          for (i=0, length = listeners.length; i<length; i++) {
            // if listeners were deregistered, defragment the array
            if (!listeners[i]) {
              listeners.splice(i, 1);
              i--;
              length--;
              continue;
            }

            try {
              listeners[i].apply(null, listenerArgs);
            } catch(e) {
              $exceptionHandler(e);
            }
          }

          // Insanity Warning: scope depth-first traversal
          // yes, this code is a bit crazy, but it works and we have tests to prove it!
          // this piece should be kept in sync with the traversal in $digest
          if (!(next = (current.$$childHead || (current !== target && current.$$nextSibling)))) {
            while(current !== target && !(next = current.$$nextSibling)) {
              current = current.$parent;
            }
          }
        } while ((current = next));

        return event;
      }

      $rootScope.$on = function (name, listener) {
        var namedListeners = this.$$listeners[name];
        if (!namedListeners) {
          this.$$listeners[name] = namedListeners = [];
        }
        namedListeners.push(debug(name, 'listener'));
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
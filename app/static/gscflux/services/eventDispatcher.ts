angular.module('gsc.eventDispatcher', []).factory('dispatcher', () : any => {
  var Dispatcher = require('flux').Dispatcher;
  return new Dispatcher();
});

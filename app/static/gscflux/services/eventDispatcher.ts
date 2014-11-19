interface Dispatcher {
	dispatch(payload: Payload): void;
	register(callback: (payload: Payload) => void): string;
}

enum PayloadType {
  UPDATE_SURVEY,
  INITIALIZE_MOCK_SURVEY
}

interface Payload {
  type: PayloadType;
  data?: any;
}

angular.module('gsc.eventDispatcher', []).factory('dispatcher', () : any => {
  var Dispatcher = require('flux').Dispatcher;
  return new Dispatcher();
});

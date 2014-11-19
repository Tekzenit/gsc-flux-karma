module GSC.Services.EventDispatcher {
  export interface Dispatcher {
    dispatch(payload: Payload): void;
    register(callback: (payload: Payload) => void): string;
  }

  export enum PayloadType {
    UPDATE_SURVEY,
    INITIALIZE_MOCK_SURVEY
  }
  export interface Payload {
    type: PayloadType;
    data?: any;
  }

  angular.module('gsc.eventDispatcher', []).service('dispatcher', require('flux').Dispatcher);
}

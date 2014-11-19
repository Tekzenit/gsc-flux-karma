/* inject:ts */ /// <reference path="../../references.ts" />
 /* endinject */

module GSC.Services.EventDispatcher {
  export interface Dispatcher {
    dispatch(payload: Payload): void;
    register(callback: (payload: Payload) => void): string;
  }

  export interface Payload {
    type: PayloadType;
    data?: any;
  }

  angular.module('gsc.eventDispatcher', []).service('dispatcher', require('flux').Dispatcher);
}

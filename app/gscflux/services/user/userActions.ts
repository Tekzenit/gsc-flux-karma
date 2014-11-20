/* inject:ts */ /// <reference path="../../references.ts" />
/* endinject */

module GSC.Services.User {
  export class UserActions {
    constructor(private dispatcher: EventDispatcher.Dispatcher) {
    }

    public registerUser(user: IUserModel) {
      var payload = {
        type: EventDispatcher.PayloadType.REGISTER_USER,
        data: angular.copy(user)
      };
      this.dispatcher.dispatch(payload);
      return payload;
    }

    public loginUser(user: IUserModel) {
      var payload = {
        type: EventDispatcher.PayloadType.LOGIN_USER,
        data: angular.copy(user)
      };
      this.dispatcher.dispatch(payload);
      return payload;
    }

    public logoutUser() {
      var payload = {
        type: EventDispatcher.PayloadType.LOGOUT_USER
      };
      this.dispatcher.dispatch(payload);
      return payload;
    }
  }

  angular.module('gsc.userActions', ['gsc.eventDispatcher']).service('userActions', UserActions);
}

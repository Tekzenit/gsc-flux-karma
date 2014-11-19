/* inject:ts */ /// <reference path="../../references.ts" />
 /* endinject */
module GSC.Services.User {
  export class UserService extends EntityService {
    private users: any = [];
    private currentUser;

    constructor(dispatcher: EventDispatcher.Dispatcher) {
      super(dispatcher);
    }

    public getUsers() {
      var userViewModel = angular.copy(this.users);
      Object.freeze(userViewModel);
      return userViewModel;
    }

    public getCurrentUser() {
      if (!this.currentUser) {
        return undefined;
      }

      var currentUser = angular.copy(this.currentUser);
      Object.freeze(currentUser);
      return currentUser;
    }

    public update(payload: EventDispatcher.Payload) {
      switch(payload.type) {
        case Services.EventDispatcher.PayloadType.REGISTER_USER:
            console.log(payload.data);
            this.users.push(payload.data);
            console.log(this.users);
            this.emitChange();
            break;
        case Services.EventDispatcher.PayloadType.LOGIN_USER:
            this.currentUser = payload.data;
            this.emitChange();
            break;
        case EventDispatcher.PayloadType.LOGOUT_USER:
            this.currentUser = null;
            this.emitChange();
            break;
      }
    }
  }

  angular.module('gsc.services.user', []).service('userService', UserService);
}

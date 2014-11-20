
module GSC.Services.User {

  export interface IUserService {
    getUsers() : IUserModel[];
    getCurrentUser() : IUserModel;
  }

  export class UserService extends EntityService implements IUserService {
    private users: IUserModel[] = [];
    private currentUser: IUserModel;

    constructor(public dispatcher: EventDispatcher.Dispatcher) {
      super(dispatcher);
    }

    public getUsers() : IUserModel[] {
      var userViewModel = angular.copy(this.users);
      Object.freeze(userViewModel);
      return userViewModel;
    }

    public getCurrentUser() : IUserModel {
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
            if (this.users.filter(user => user.name == payload.data.name).length != 0) {
              throw new Error('User already exists, can\'t register');
            }

            this.users.push(payload.data);
            break;
        case Services.EventDispatcher.PayloadType.LOGIN_USER:
            this.currentUser = payload.data;
            break;
        case EventDispatcher.PayloadType.LOGOUT_USER:
            this.currentUser = null;
            break;
      }

      super.update(payload);
    }
  }

  angular.module('gsc.services.user', ['gsc.eventDispatcher']).service('userService', UserService);
}

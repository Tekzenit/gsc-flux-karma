/* inject:ts */ /// <reference path="../references.ts" />
 /* endinject */

module GSC.User {

  class UserController extends ModelController {
    constructor(private users: GSC.Services.User.UserService) {
      super(users);
    }

    public update() {
      console.log('update!');
    }
  }

  angular.module('gsc.user', [])
    .directive('gscUser', GSC.FluxDirective.createFluxDirective({
      templateUrl: '',
      controller: UserController
    }));
}

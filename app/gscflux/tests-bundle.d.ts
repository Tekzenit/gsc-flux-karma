/// <reference path="application-bundle.d.ts" />
/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-mocks.d.ts" />
interface MockUserService extends GSC.Services.User.IUserService {
    update: any;
    users: any;
}

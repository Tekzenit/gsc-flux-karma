/// <reference path="../../application-bundle.d.ts" />
/// <reference path="../../../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/angularjs/angular-mocks.d.ts" />

interface MockUserService extends GSC.Services.User.IUserService {
  update: any;
  users: any;
}

describe('UserService', () => {

  var angular: ng.IAngularStatic = window['angular'];
  var
    userService : MockUserService,
    userActions: GSC.Services.User.UserActions;

  beforeEach(module('gsc.services.user'));
  beforeEach(module('gsc.userActions'));
  beforeEach(inject(($injector : ng.auto.IInjectorService)=> {
    userService = $injector.get('userService');
    userActions = $injector.get('userActions');
  }));

  it('should work', () => {
    expect(userService).toBeDefined();
    expect(userActions).toBeDefined();
  });

  it('should respond to a registration action by creating a new user', () => {
    userActions.registerUser({
      name: "TestUser1"
    });
    expect(userService.getUsers()).toBeDefined();
    expect(userService.getUsers().length).toBe(1);
    expect(userService.getUsers()[0].name).toBe('TestUser1')
  });

  describe('Multiple users', function() {
    var u1 = {
      name: "TestUser1"
    },u2 = {
      name: "TestUser2"
    },u3 = {
      name: "TestUser3"
    },u4 = {
      name: "TestUser4"
    };

    beforeEach(() => {
      userActions.registerUser(u1);
      userActions.registerUser(u2);
      userActions.registerUser(u3);
      userActions.registerUser(u4);
    });

    it('should have 4 users', () => {
      expect(userService.getUsers()).toBeDefined();
      expect(userService.getUsers().length).toBe(4);
    });

    it('should log user 1 in', () => {
      userActions.loginUser(u1);
      expect(userService.getCurrentUser()).toEqual(u1);
    });

    it('should not be able to register a user who is already registered', () => {
      expect(() => {
        userActions.registerUser(u1)
      }).toThrow();
      expect(userService.getUsers().length).toBe(4);
    });

    describe('having a user already logged in', () => {
      beforeEach(() => {
        userActions.loginUser(u1);
      });

      it('should log out user 1', function() {
        expect(userService.getCurrentUser()).toEqual((u1));
        userActions.logoutUser();
        expect(userService.getCurrentUser()).toBeFalsy();
      });

      it('should log out user 1 and log in user 2', function() {
        expect(userService.getCurrentUser()).toEqual((u1));
        userActions.logoutUser();
        expect(userService.getCurrentUser()).toBeFalsy();
        userActions.loginUser(u2);
        expect(userService.getCurrentUser()).toEqual((u2));
      })
    })
  })

});

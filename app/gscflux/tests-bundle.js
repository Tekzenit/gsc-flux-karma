/// <reference path="../application-bundle.d.ts" />
/// <reference path="../../../typings/jasmine/jasmine.d.ts" />
describe('FluxDirective', function () {
    it('has a function called createFluxDirective that is a function that returns a function', function () {
        expect(typeof (GSC.FluxDirective.createFluxDirective)).toEqual(('function'));
        var directive = GSC.FluxDirective.createFluxDirective({
            'template': "<p>Hello</p>",
            controller: function () {
                return undefined;
            }
        });
        expect(typeof (directive)).toEqual('function');
    });
});
/// <reference path="../../application-bundle.d.ts" />
/// <reference path="../../../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/angularjs/angular-mocks.d.ts" />
describe('SurveyService', function () {
    var surveyActions, surveyService, userActions, userService;

    beforeEach(module('gsc.services.survey'));
    beforeEach(module('gsc.surveyActions'));
    beforeEach(module('gsc.userActions'));
    beforeEach(inject(function ($injector) {
        surveyService = $injector.get('surveyService');
        surveyActions = $injector.get('surveyActions');
        userActions = $injector.get('userActions');
        userService = $injector.get('userService');
    }));

    it('should work', function () {
        expect(surveyActions).toBeDefined();
        expect(surveyService).toBeDefined();
    });

    it('should not have any surveys right now', function () {
        expect(surveyService.getAllSurveys().length).toEqual(0);
    });

    describe('with one user registered', function () {
        var user = {
            name: "Desmond"
        };
        beforeEach(function () {
            expect(userService.getUsers().length).toEqual(0);
            userActions.registerUser(user);
            expect(userService.getUsers().length).toEqual(1);
        });

        it('should create a survey for the user if there is not one existing', function () {
            expect(surveyService.getAllSurveys().length).toEqual(0);
            expect(surveyService.getCurrentUserSurvey()).toBeFalsy();
            userActions.loginUser(user);
            expect(surveyService.getCurrentUserSurvey()).toBeTruthy();
            expect(surveyService.getAllSurveys().length).toEqual(1);
        });
    });
});
/// <reference path="../../application-bundle.d.ts" />
/// <reference path="../../../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/angularjs/angular-mocks.d.ts" />

describe('UserService', function () {
    var angular = window['angular'];
    var userService, userActions;

    beforeEach(module('gsc.services.user'));
    beforeEach(module('gsc.userActions'));
    beforeEach(inject(function ($injector) {
        userService = $injector.get('userService');
        userActions = $injector.get('userActions');
    }));

    it('should work', function () {
        expect(userService).toBeDefined();
        expect(userActions).toBeDefined();
    });

    it('should respond to a registration action by creating a new user', function () {
        userActions.registerUser({
            name: "TestUser1"
        });
        expect(userService.getUsers()).toBeDefined();
        expect(userService.getUsers().length).toBe(1);
        expect(userService.getUsers()[0].name).toBe('TestUser1');
    });

    describe('Multiple users', function () {
        var u1 = {
            name: "TestUser1"
        }, u2 = {
            name: "TestUser2"
        }, u3 = {
            name: "TestUser3"
        }, u4 = {
            name: "TestUser4"
        };

        beforeEach(function () {
            userActions.registerUser(u1);
            userActions.registerUser(u2);
            userActions.registerUser(u3);
            userActions.registerUser(u4);
        });

        it('should have 4 users', function () {
            expect(userService.getUsers()).toBeDefined();
            expect(userService.getUsers().length).toBe(4);
        });

        it('should log user 1 in', function () {
            userActions.loginUser(u1);
            expect(userService.getCurrentUser()).toEqual(u1);
        });

        it('should not be able to register a user who is already registered', function () {
            expect(function () {
                userActions.registerUser(u1);
            }).toThrow();
            expect(userService.getUsers().length).toBe(4);
        });

        describe('having a user already logged in', function () {
            beforeEach(function () {
                userActions.loginUser(u1);
            });

            it('should log out user 1', function () {
                expect(userService.getCurrentUser()).toEqual((u1));
                userActions.logoutUser();
                expect(userService.getCurrentUser()).toBeFalsy();
            });

            it('should log out user 1 and log in user 2', function () {
                expect(userService.getCurrentUser()).toEqual((u1));
                userActions.logoutUser();
                expect(userService.getCurrentUser()).toBeFalsy();
                userActions.loginUser(u2);
                expect(userService.getCurrentUser()).toEqual((u2));
            });
        });
    });
});

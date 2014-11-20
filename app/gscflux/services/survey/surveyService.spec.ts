/// <reference path="../../application-bundle.d.ts" />
/// <reference path="../../../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/angularjs/angular-mocks.d.ts" />

describe('SurveyService', () => {
  var surveyActions: GSC.Services.Survey.SurveyActions, surveyService: GSC.Services.Survey.SurveyService, userActions: GSC.Services.User.UserActions, userService: GSC.Services.User.UserService;

  beforeEach(module('gsc.services.survey'));
  beforeEach(module('gsc.surveyActions'));
  beforeEach(module('gsc.userActions'));
  beforeEach(inject(($injector : ng.auto.IInjectorService)=> {
    surveyService = $injector.get('surveyService');
    surveyActions = $injector.get('surveyActions');
    userActions = $injector.get('userActions');
    userService = $injector.get('userService');
  }));

  it('should work', () => {
    expect(surveyActions).toBeDefined();
    expect(surveyService).toBeDefined();
  });

  it('should not have any surveys right now', () => {
    expect(surveyService.getAllSurveys().length).toEqual(0);
  });

  describe('with one user registered', () => {
    var user = {
      name: "Desmond"
    };
    beforeEach(() => {
      expect(userService.getUsers().length).toEqual(0);
      userActions.registerUser(user);
      expect(userService.getUsers().length).toEqual(1);
    });

    it('should create a survey for the user if there is not one existing', () => {
      expect(surveyService.getAllSurveys().length).toEqual(0);
      expect(surveyService.getCurrentUserSurvey()).toBeFalsy();
      userActions.loginUser(user);
      expect(surveyService.getCurrentUserSurvey()).toBeTruthy();
      expect(surveyService.getAllSurveys().length).toEqual(1);
    });
  })
});

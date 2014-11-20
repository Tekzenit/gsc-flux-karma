/* inject:ts */ /// <reference path="../references.ts" />
 /* endinject */

module GSC.Survey {
  class SurveyController extends ModelController {
    constructor(private surveyService: GSC.Services.Survey.SurveyService, private userService: GSC.Services.User.UserService, private userActions: Services.User.UserActions) {
      super(surveyService);
      userService.register(() => this.usersUpdated());
      this.usersUpdated();
      this.update();
    }

    public survey: Services.Survey.ISurveyModel;
    public currentUser: Services.User.IUserModel;
    public outerTab: string;
    public innerTab: string;

    public update() {
      this.survey = this.surveyService.getCurrentUserSurvey();
    }

    public logout() {
      this.userActions.logoutUser();
    }

    public usersUpdated() {
      this.currentUser = this.userService.getCurrentUser();
      this.outerTab = this.currentUser ? 'survey' : 'login';
    }
  }

  class SurveyLocationController extends ModelController {
    importanceTab: string;

    constructor(private surveyService: Services.Survey.SurveyService, private surveyActions: Services.Survey.SurveyActions) {
      super(surveyService);
      this.importanceTab = undefined;
      this.update();
    }

    public setLocationImportance(importance) {
      this.surveyActions.location.importance(importance);
    }

    public update() {
      var survey = this.surveyService.getCurrentUserSurvey();
      if (survey) {
        this.importanceTab = survey.location.importance ? survey.location.importance : 'choose';
      }
    }
  }

  class SurveySubjectsController extends ModelController {
    constructor(private surveyActions, private surveyService: Services.Survey.SurveyService) {
      super(surveyService);
        this.update();
    }

    public subjects;

    public update() {
      var survey = this.surveyService.getCurrentUserSurvey();
      if (survey) {
        var shuffle = function(o){ //v1.0
          for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
          return o;
        };
        this.subjects = shuffle(survey.subjects);
      }
    }

    public addSubject() {
      this.surveyActions.subjects.add({'text': 'subject ' + Math.random()});
    }
  }

  angular.module('gsc.survey', [])
    .directive('gscSurvey', GSC.FluxDirective.createFluxDirective({
      templateUrl: 'gscflux/survey/survey.html',
      controller: SurveyController
    }))

    .directive('gscSurveyLocation', GSC.FluxDirective.createFluxDirective({
      templateUrl: 'gscflux/survey/location.html',
      controller: SurveyLocationController
    }))

    .directive('gscSurveySubjects', GSC.FluxDirective.createFluxDirective({
      templateUrl: 'gscflux/survey/subjects.html',
      controller: SurveySubjectsController
    }));

}

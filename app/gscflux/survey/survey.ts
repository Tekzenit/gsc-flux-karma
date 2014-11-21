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
    constructor(private surveyActions, private surveyService: Services.Survey.SurveyService, private $scope: any) {
      super(surveyService);
      this.update();
    }

    public subjectChoices: GSC.Services.Survey.ISubject[] = [
      {
        name: "Art",
        category: Services.Survey.SubjectCategory.Certificate
      },
      {
        name: "Computer Science",
        category: Services.Survey.SubjectCategory.Masters
      }
    ];

    public subjects: Services.Survey.ISubject[] = [];

    public update() {
      var survey = this.surveyService.getCurrentUserSurvey();
      if (survey) {
        this.subjects = survey.subjects;
      }
    }

    public addSubject(subject: Services.Survey.ISubject) {
      this.$scope.selectedSubject = undefined;
      if (this.subjects.filter(s => angular.equals(s, subject)).length != 0) {
        return;
      }
      this.surveyActions.subjects.add(subject);
    }
    public removeSubject(subject: Services.Survey.ISubject) {
      this.surveyActions.subjects.remove(subject);
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

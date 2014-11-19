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

    public survey: any;
    public currentUser: any;
    public outerTab: string;

    public update() {
      this.survey = this.surveyService.getSurvey();
    }

    public logout() {
      this.userActions.logoutUser();
    }

    public usersUpdated() {
      this.currentUser = this.userService.getCurrentUser();
      this.outerTab = this.currentUser ? 'survey' : 'login';
    }
  }

  angular.module('gsc.survey', [])
    .directive('gscSurvey', GSC.FluxDirective.createFluxDirective({
      templateUrl: 'gscflux/survey/survey.html',
      controller: SurveyController
    }))

    .directive('gscSurveyLocation', GSC.FluxDirective.createFluxDirective({
      templateUrl: 'gscflux/survey/location.html',
      controller: function(surveyActions) {
        this.setLocationImportance = function(importance) {
          surveyActions.location.importance(importance);
          this.selectedTab = importance;
        }
      }
    }))

    .directive('gscSurveySubjects', GSC.FluxDirective.createFluxDirective({
      templateUrl: 'gscflux/survey/subjects.html',
      controller: function(surveyActions, surveyService) {
        var i = 0;

        var shuffle = function(o){ //v1.0
          for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
          return o;
        };

        var updateSubjects = function() {
          this.subjects = shuffle(surveyService.getSurvey().subjects);
        };
        surveyService.addChangeListener(angular.bind(this, updateSubjects));
        updateSubjects();

        this.addSubject = function() {
          surveyActions.subjects.add({'text': 'subject ' + (++i)});
        }
      }
    }));

}

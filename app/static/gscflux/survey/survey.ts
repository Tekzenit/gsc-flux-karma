/* inject:ts */ /// <reference path="../references.ts" />
 /* endinject */

module GSC.Survey {
  class SurveyController extends ModelController {
    constructor(private $scope, private surveys: GSC.Services.Survey.SurveyService) {
      super(surveys);
      this.update();
    }

    public update() {
      this.$scope.survey = this.surveys.getSurvey();
    }
  }

  angular.module('gsc.survey', [])
    .directive('gscSurvey', GSC.FluxDirective.createFluxDirective({
      templateUrl: 'gscflux/survey/survey.html',
      controller: SurveyController
    }))

    .directive('gscSurveyLocation', GSC.FluxDirective.createFluxDirective({
      templateUrl: 'gscflux/survey/location.html',
      controller: function($scope, surveyActions) {
        $scope.setLocationImportance = function(importance) {
          surveyActions.location.importance(importance);
          $scope.selectedTab = importance;
        }
      }
    }))

    .directive('gscSurveySubjects', GSC.FluxDirective.createFluxDirective({
      templateUrl: 'gscflux/survey/subjects.html',
      controller: function($scope, surveyActions, surveys) {
        var i = 0;

        var shuffle = function(o){ //v1.0
          for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
          return o;
        };

        var updateSubjects = function() {
          $scope.subjects = shuffle(surveys.getSurvey().subjects);
        };
        surveys.addChangeListener(angular.bind(this, updateSubjects));
        updateSubjects();

        $scope.addSubject = function() {
          surveyActions.subjects.add({'text': 'subject ' + (++i)});
        }
      }
    }));

}

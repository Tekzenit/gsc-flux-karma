angular.module('gsc.survey', [])
  .directive('gscSurvey', function(surveys, dispatcher) {
    return {
      templateUrl: 'gscflux/survey/survey.html',
      controller: function($scope) {
        var updateSurvey = function() {
          $scope.survey = surveys.getSurvey();
        };

        surveys.addChangeListener(angular.bind(this, updateSurvey));
        updateSurvey();
      },
      scope: {

      }
    }
  })

  .directive('gscSurveyLocation', function() {
    return {
      templateUrl: 'gscflux/survey/location.html',
      controller: function($scope, surveyActions) {
        $scope.setLocationImportance = function(importance) {
          surveyActions.location.importance(importance);
          $scope.selectedTab = importance;
        }
      },
      scope: {

      }
    }
  })

  .directive('gscSurveySubjects', function() {
    return {
      templateUrl: 'gscflux/survey/subjects.html',
      controller: function($scope, surveyActions, surveys) {
        var i = 0;
        r = [];

        var shuffle = function(o){ //v1.0
          for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
          return o;
        };

        var updateSubjects = function() {
          x = $scope.subjects = shuffle(surveys.getSurvey().subjects);
          r.push(x);
        };
        surveys.addChangeListener(angular.bind(this, updateSubjects));
        updateSubjects();

        $scope.addSubject = function() {
          surveyActions.subjects.add({'text': 'subject ' + (++i)});
        }
      }
    }
  })

.directive('testDirective', function() {
    return {
      template: '<li><span ng-transclude></span> {{random}}</li>',
      transclude: true,
      scope: {

      },
      link: function(scope) {
        scope.random = Math.random();
        console.log('creation');
      },
      replace: true
    }
  })
;

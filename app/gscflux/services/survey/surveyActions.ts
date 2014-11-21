/* inject:ts */ /// <reference path="../../references.ts" />
/* endinject */

module GSC.Services.Survey {
  export class SurveyActions {
    constructor(private dispatcher:EventDispatcher.Dispatcher) {
    }

    public location = {
      importance: (importance) =>
        this.dispatcher.dispatch({
          type: EventDispatcher.PayloadType.UPDATE_SURVEY,
          data: {
            property: "location.importance",
            value: (survey: Services.Survey.ISurveyModel) => {
              survey.location.importance = importance;
            }
          }
        })
    };
    public subjects = {
      add: (subject: Services.Survey.ISubject) =>
        this.dispatcher.dispatch({
          type: EventDispatcher.PayloadType.UPDATE_SURVEY,
          data: {
            property: "subjects",
            value: (survey: Services.Survey.ISurveyModel) => {
              survey.subjects.push(angular.copy(subject));
            }
          }
        }),
      remove: (subject: Services.Survey.ISubject) =>
        this.dispatcher.dispatch({
          type: EventDispatcher.PayloadType.UPDATE_SURVEY,
          data: {
            property: "subjects",
            value: (survey: Services.Survey.ISurveyModel) => {
              survey.subjects = survey.subjects.filter(s => {
                return !angular.equals(subject, s);
              });
            }
          }
        })
    }
  }

  angular.module('gsc.surveyActions', []).service('surveyActions', SurveyActions);
}

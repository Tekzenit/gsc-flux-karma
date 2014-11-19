/* inject:ts */ /// <reference path="../../references.ts" />
 /* endinject */

module GSC.Services.Survey {

  export class SurveyService extends EntityService {
    private survey: any;

    constructor(dispatcher: EventDispatcher.Dispatcher) {
      super(dispatcher);

      dispatcher.dispatch({
        type: EventDispatcher.PayloadType.INITIALIZE_MOCK_SURVEY
      });
    }

    public getSurvey() {
      var surveyViewModel = angular.copy(this.survey);
      Object.freeze(surveyViewModel);
      return surveyViewModel;
    }

    public updateSurveyAction(update) {
      switch (update.property) {
        case 'location.importance':
          this.survey[update.property] = update.value;
          break;
        case 'subjects':
          this.survey.subjects.push(update.value);
          break;
      }
      super.emitChange();
    }

    public update(payload: EventDispatcher.Payload) {
      switch(payload.type) {
        case EventDispatcher.PayloadType.INITIALIZE_MOCK_SURVEY:
          this.survey = {subjects: []};
          super.emitChange();
          break;
        case EventDispatcher.PayloadType.UPDATE_SURVEY:
          this.updateSurveyAction(payload.data);
          break;

      }
    }
  }

  angular.module('gsc.services.survey', []).service('surveyService', SurveyService);
}

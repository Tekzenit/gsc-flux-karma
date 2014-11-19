module GSC.Services.Survey {
  export class SurveyActions {
    constructor(private dispatcher: EventDispatcher.Dispatcher) {
    }
    public location = {
      importance: (importance) =>
        this.dispatcher.dispatch({
          type: EventDispatcher.PayloadType.UPDATE_SURVEY,
          data: {
            property: "location.importance",
            value: importance
          }
        })
    }
    public subjects = {
      add: (subject) =>
        this.dispatcher.dispatch({
          type: EventDispatcher.PayloadType.UPDATE_SURVEY,
          data: {
            property: "subjects",
            value: subject
          }
        })
    }
  }

  export class SurveyService extends EntityService {
    private survey: any;

    constructor(dispatcher: EventDispatcher.Dispatcher) {
      super(dispatcher);

      super.register((payload) => {
        switch(payload.type) {
          case EventDispatcher.PayloadType.INITIALIZE_MOCK_SURVEY:
            this.survey = {subjects: []};
            this.emitChange();
            break;
          case EventDispatcher.PayloadType.UPDATE_SURVEY:
            this.updateSurveyAction(payload.data);
            break;
        }
      })

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
      this.emitChange();
    }
  }

  angular.module('gsc.actions', ['gsc.eventDispatcher']).service('surveyActions', SurveyActions);
  angular.module('gsc.services.survey', []).service('surveys', SurveyService);
}

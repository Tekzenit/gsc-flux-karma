class SurveyActions {
  public location = {
      importance: (importance) => 
        this.dispatcher.dispatch({
          type: PayloadType.UPDATE_SURVEY,
          data: {
            property: "location.importance",
            value: importance
          }
        })
    }
  public subjects = {
      add: (subject) => 
        this.dispatcher.dispatch({
          type: PayloadType.UPDATE_SURVEY,
          data: {
            property: "subjects",
            value: subject
          }
        })
    }
  
  constructor(private dispatcher: Dispatcher) {
  }
}
angular.module('gsc.actions', ['gsc.eventDispatcher']).service('surveyActions', SurveyActions);

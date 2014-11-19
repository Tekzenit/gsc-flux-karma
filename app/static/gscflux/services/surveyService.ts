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

class EntityService {
  private emitter: any;
  public dispatchToken: string;
  private CHANGE_EVENT = 'change';

  constructor(private dispatcher: Dispatcher) {
    var EventEmitter = require('events').EventEmitter;
    this.emitter = new EventEmitter();
  }

  protected register(callback: (payload: Payload) => void): void {
    this.dispatchToken = this.dispatcher.register(callback);
  }

  public addChangeListener(callback) {
    this.emitter.on(this.CHANGE_EVENT, callback);
  }
  public removeChangeListener(callback) {
    this.emitter.removeListener(this.CHANGE_EVENT, callback);
  }
  public emitChange() {
    this.emitter.emit(this.CHANGE_EVENT);
  }
  public getDispatchToken() {
    return this.dispatchToken;
  }
}

class Surveys extends EntityService {
  private survey: any;

  constructor(dispatcher: Dispatcher) {
    super(dispatcher);

    super.register((payload) => {
      switch(payload.type) {
        case PayloadType.INITIALIZE_MOCK_SURVEY:
              this.survey = {subjects: []};
              this.emitChange();
              break;
        case PayloadType.UPDATE_SURVEY:
              this.updateSurveyAction(payload.data);
              break;
      }
    })

    dispatcher.dispatch({
      type: PayloadType.INITIALIZE_MOCK_SURVEY
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
angular.module('gsc.services.survey', []).service('surveys', Surveys);

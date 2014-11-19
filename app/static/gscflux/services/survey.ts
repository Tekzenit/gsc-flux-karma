class Surveys {
  private emitter: any;
  private CHANGE_EVENT = 'change';
  private survey: any;
  private dispatchToken: any;

  constructor(dispatcher: any) {
    var EventEmitter = require('events').EventEmitter;
    this.emitter = new EventEmitter();
    this.dispatchToken = dispatcher.register((action) => {
      switch(action.type) {
        case "INITIALIZE_MOCK_SURVEY":
              this.survey = {subjects: []};
              this.emitChange();
              break;
        case "UPDATE_SURVEY":
              this.updateSurveyAction(action.data);
              break;
      }
    });

    dispatcher.dispatch({
      type: 'INITIALIZE_MOCK_SURVEY'
    })
  }

  public getSurvey() {
    var surveyViewModel = angular.copy(this.survey);
    Object.freeze(surveyViewModel);
    return surveyViewModel;
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

angular.module('gsc.services.survey', []).service('surveys', Surveys);

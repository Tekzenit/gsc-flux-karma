module GSC.Services {
  export class EntityService {
    private emitter: any;
    public dispatchToken: string;
    private CHANGE_EVENT = 'change';

    constructor(private dispatcher: EventDispatcher.Dispatcher) {
      var EventEmitter = require('events').EventEmitter;
      this.emitter = new EventEmitter();
    }

    public register(callback: (payload: EventDispatcher.Payload) => void): void {
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
}

/// <reference path="../../typings/angularjs/angular.d.ts" />
declare var angular: ng.IAngularStatic;
declare var EventEmitter: any;
declare function require(name: string): any;
declare module GSC {
}
declare module GSC {
    class ModelController {
        private service;
        constructor(service: Services.EntityService);
        public update(): void;
    }
}
declare module GSC.FluxDirective {
    interface FluxDirectiveParameters {
        templateUrl?: string;
        template?: string;
        controller: any;
        scope?: any;
    }
    var TestVal: string;
    function createFluxDirective(params: FluxDirectiveParameters, name?: string): () => any;
}
declare module GSC.Survey {
}
declare module GSC.Services {
    class EntityService {
        public dispatcher: EventDispatcher.Dispatcher;
        private emitter;
        public dispatchToken: string;
        private CHANGE_EVENT;
        constructor(dispatcher: EventDispatcher.Dispatcher);
        public register(callback: (payload: EventDispatcher.Payload) => void): void;
        public addChangeListener(callback: any): void;
        public removeChangeListener(callback: any): void;
        public emitChange(): void;
        public getDispatchToken(): string;
        public update(payload: EventDispatcher.Payload): void;
    }
}
declare module GSC.User {
}
declare module GSC.User {
}
declare module GSC.Services.EventDispatcher {
    interface Dispatcher {
        dispatch(payload: Payload): void;
        register(callback: (payload: Payload) => void): string;
        waitFor(ids: any): void;
    }
    interface Payload {
        type: PayloadType;
        data?: any;
    }
}
declare module GSC.Services.EventDispatcher {
    enum PayloadType {
        UPDATE_SURVEY = 0,
        INITIALIZE_MOCK_SURVEY = 1,
        REGISTER_USER = 2,
        LOGIN_USER = 3,
        LOGOUT_USER = 4,
    }
}
declare module GSC.Services.Survey {
    class SurveyActions {
        private dispatcher;
        constructor(dispatcher: EventDispatcher.Dispatcher);
        public location: {
            importance: (importance: any) => void;
        };
        public subjects: {
            add: (subject: any) => void;
        };
    }
}
declare module GSC.Services.Survey {
    interface ISurveyLocationModel {
        importance: string;
    }
    interface ISurveyModel {
        userName: string;
        subjects: any[];
        location: ISurveyLocationModel;
    }
    class SurveyService extends EntityService {
        public dispatcher: EventDispatcher.Dispatcher;
        private userService;
        private surveys;
        private currentUser;
        constructor(dispatcher: EventDispatcher.Dispatcher, userService: User.UserService);
        public getAllSurveys(): ISurveyModel[];
        public getCurrentUserSurvey(): ISurveyModel;
        private _getCurrentUserSurvey();
        public updateSurveyAction(data: any): void;
        public update(payload: EventDispatcher.Payload): void;
    }
}
declare module GSC.Services.User {
    class UserActions {
        private dispatcher;
        constructor(dispatcher: EventDispatcher.Dispatcher);
        public registerUser(user: any): void;
        public loginUser(user: any): void;
        public logoutUser(): void;
    }
}
declare module GSC.Services.User {
    class UserService extends EntityService {
        public dispatcher: EventDispatcher.Dispatcher;
        private users;
        private currentUser;
        constructor(dispatcher: EventDispatcher.Dispatcher);
        public getUsers(): any;
        public getCurrentUser(): any;
        public update(payload: EventDispatcher.Payload): void;
    }
}

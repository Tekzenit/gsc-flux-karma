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
declare module GSC.Services.User {
    class UserActions {
        private dispatcher;
        constructor(dispatcher: EventDispatcher.Dispatcher);
        public registerUser(user: IUserModel): {
            type: EventDispatcher.PayloadType;
            data: IUserModel;
        };
        public loginUser(user: IUserModel): {
            type: EventDispatcher.PayloadType;
            data: IUserModel;
        };
        public logoutUser(): {
            type: EventDispatcher.PayloadType;
        };
    }
}
/**
* Created by desmond on 11/20/2014.
*/
declare module GSC.Services.User {
    interface IUserModel {
        name: string;
    }
}
declare module GSC.Services.User {
    interface IUserService {
        getUsers(): IUserModel[];
        getCurrentUser(): IUserModel;
    }
    class UserService extends EntityService implements IUserService {
        public dispatcher: EventDispatcher.Dispatcher;
        private users;
        private currentUser;
        constructor(dispatcher: EventDispatcher.Dispatcher);
        public getUsers(): IUserModel[];
        public getCurrentUser(): IUserModel;
        public update(payload: EventDispatcher.Payload): void;
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
            add: (subject: ISubject) => void;
            remove: (subject: ISubject) => void;
        };
    }
}
declare module GSC.Services.Survey {
    interface ISurveyLocationModel {
        importance: string;
    }
    enum SubjectCategory {
        Doctoral = 0,
        Masters = 1,
        Certificate = 2,
    }
    enum SurveyMediaType {
        OnlineOnly = 0,
        OnlineAndOffline = 1,
        OfflineOnly = 2,
    }
    interface ISubject {
        category: SubjectCategory;
        name: string;
    }
    interface IDegree {
        subject: ISubject;
        type: string;
    }
    interface ISurveySubjectsModel {
        category: SubjectCategory;
        mediaType: SurveyMediaType;
        subjects: ISubject[];
        degreeTypes: string[];
    }
    interface ISurveyModel {
        userName: string;
        subjects: ISubject[];
        location: ISurveyLocationModel;
    }
}
declare module GSC.Services.Survey {
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

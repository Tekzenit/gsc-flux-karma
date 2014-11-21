module GSC.Services.Survey {
  export interface ISurveyLocationModel {
    importance: string;
  }

  export enum SubjectCategory {
    Doctoral, Masters, Certificate
  }

  export enum SurveyMediaType {
    OnlineOnly, OnlineAndOffline, OfflineOnly
  }

  export interface ISubject {
    category: SubjectCategory;
    name: string;
  }

  export interface IDegree {
    subject: ISubject
    type: string
  }

  export interface ISurveySubjectsModel {
    category: SubjectCategory;
    mediaType: SurveyMediaType;
    subjects: ISubject[];
    degreeTypes: string[];
  }

  export interface ISurveyModel {
    userName: string;
    subjects: ISubject[];
    location: ISurveyLocationModel;
  }
}

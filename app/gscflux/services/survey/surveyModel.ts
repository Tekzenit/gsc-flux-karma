module GSC.Services.Survey {
  export interface ISurveyLocationModel {
    importance: string;
  }

  export interface ISurveyModel {
    userName: string;
    subjects: any[];
    location: ISurveyLocationModel;
  }
}

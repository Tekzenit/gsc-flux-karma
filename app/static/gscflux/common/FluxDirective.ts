/* inject:ts */ /// <reference path="../references.ts" />
 /* endinject */

module GSC.FluxDirective{
  export interface FluxDirectiveParameters {
    templateUrl: string;
    controller: any;
    scope?: any;
  }

  export function createFluxDirective(params: FluxDirectiveParameters) {
    var directive = {
      templateUrl: params.templateUrl,
      controller: params.controller,
      scope: params.scope ? angular.extend({}, params.scope) : {}
    };
    return () => directive;
  }

}

declare var angular;
declare var EventEmitter;
declare function require(name: string);

module GSC {
  console.log('inside gsc module')
  export interface FluxDirectiveParameters {
    templateUrl: string;
    controller: any;
    scope?: any;
  }

  export function createFluxDirective(params: FluxDirectiveParameters) {
    var directive = {
      templateUrl: params.templateUrl,
      controller: params.controller,
      scope: params.scope ? angular.extend({}, params.scope) : {},
    };
    return () => directive;
  }

  angular.module('gsc', [
    'gsc.tabs',
    'gsc.survey',
    'gsc.services.survey',
    'gsc.eventDispatcher',
    'gsc.actions',
  ]);
}

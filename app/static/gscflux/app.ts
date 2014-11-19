declare var angular;
declare var require;

interface FluxDirectiveParameters {
	templateUrl: string;
	controller: any;
	scope?: any;
}

function createFluxDirective(params: FluxDirectiveParameters) {
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
]).run(function() {
});
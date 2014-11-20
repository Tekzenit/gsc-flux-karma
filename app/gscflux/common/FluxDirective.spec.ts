/// <reference path="../application-bundle.d.ts" />
/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

describe('FluxDirective', () => {
  it('has a function called createFluxDirective that is a function that returns a function', () => {
    expect(typeof(GSC.FluxDirective.createFluxDirective)).toEqual(('function'));
    var directive = GSC.FluxDirective.createFluxDirective({
      'template': "<p>Hello</p>",
      controller: () => undefined
    });
    expect(typeof(directive)).toEqual('function');
  })
});

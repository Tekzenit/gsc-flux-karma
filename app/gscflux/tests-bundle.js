/// <reference path="../application-concat.d.ts" />
/// <reference path="../../../typings/jasmine/jasmine.d.ts" />
describe('FluxDirective', function () {
    it('has a function called createFluxDirective that is a function that returns a function', function () {
        expect(typeof (GSC.FluxDirective.createFluxDirective)).toEqual(('function'));
        var directive = GSC.FluxDirective.createFluxDirective({
            'template': "<p>Hello</p>",
            controller: function () {
                return undefined;
            }
        });
        expect(typeof (directive)).toEqual('function');
    });
});
/// <reference path="../../application-concat.d.ts" />
/// <reference path="../../../../typings/jasmine/jasmine.d.ts" />
describe('UserService', function () {
    it('should work', function () {
        expect(GSC.Services.User.test).toEqual("123");
    });
});

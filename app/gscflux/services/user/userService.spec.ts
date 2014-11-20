/// <reference path="../../application-concat.d.ts" />
/// <reference path="../../../../typings/jasmine/jasmine.d.ts" />

describe('UserService', () => {
  it('should work', () => {
    expect(GSC.Services.User.test).toEqual("123");
  })
});

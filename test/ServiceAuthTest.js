/**
 * Created by Hu on 2016-02-24.
 */
'use strict';

describe('service', function() {

    // load modules
    var AuthController,
        scope;
    beforeEach(module('naf'));
    beforeEach(module('naf.auth'));

    // Test service availability
    it('check the existence of register method of Auth service', inject(function(Auth) {

        expect(Auth.register).toBeDefined();
    }));
});
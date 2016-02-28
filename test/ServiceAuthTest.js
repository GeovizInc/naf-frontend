/**
 * Created by Hu on 2016-02-24.
 */
'use strict';

describe('service', function() {

    // load modules
    beforeEach(module('naf.course'));

    // Test service availability
    it('check the existence of Phone factory', inject(function(Auth) {
        expect(Auth).toBeDefined();
    }));
});
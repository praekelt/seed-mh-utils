
var Utils = require("../lib");
var assert = require('assert');


describe("Testing Utils Functions", function() {
    describe("- get_clean_first_word", function() {
        it("should get and capitalise first word", function() {
            assert.deepEqual(Utils.get_clean_first_word("Once there was..."), "ONCE");
            assert.deepEqual(Utils.get_clean_first_word("Stop the noise"), "STOP");
        });
        it("should get clean first word if contains non-letters/numbers", function() {
            assert.deepEqual(Utils.get_clean_first_word("O$ne Two T3ree"), "ONE");
            assert.deepEqual(Utils.get_clean_first_word("O$1ne T2wo Th3ree"), "O1NE");
        });
    });
});

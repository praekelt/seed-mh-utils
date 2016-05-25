
var Utils = require("../lib");
var assert = require('assert');
var moment = require('moment');


describe("Testing Utils Functions", function() {

    describe("normalize_msisdn(raw, country_code)", function() {
        it("return raw number unchanged if shortcode", function() {
            assert.deepEqual(Utils.normalize_msisdn("0123", "123"), "0123");
        });
        it.skip("remove chars that are not numbers or + from raw nuumber", function() {
            assert.deepEqual(Utils.normalize_msisdn("012abc345", "123"), "+12312345");
        });
        it("starts with '00'; replace with '+', don't prepend country_code", function() {
            assert.deepEqual(Utils.normalize_msisdn("0012345", "123"), "+12345");
        });
        it("starts with '0'; replace with '+' + country_code", function() {
            assert.deepEqual(Utils.normalize_msisdn("012345", "123"), "+12312345");
        });
        it("starts with '+'; return raw number as is", function() {
            assert.deepEqual(Utils.normalize_msisdn("+12312345", "123"), "+12312345");
        });
        it("if raw number's length equals country_code, prepend '+'", function() {
            assert.deepEqual(Utils.normalize_msisdn("123456", "123456"), "+123456");
        });
    });

    describe("check_valid_number", function() {
        it("only numbers is valid", function() {
            assert(Utils.check_valid_number("012345"), true);
        });
        it("any letters invalidates check", function() {
            assert.ifError(Utils.check_valid_number("012abc345"));
        });
        it("any other characters invalidates check", function() {
            assert.equal(Utils.check_valid_number("-123456"), false);
            assert.equal(Utils.check_valid_number("123-456"), false);
            assert.equal(Utils.check_valid_number("1234&56"), false);
            assert.equal(Utils.check_valid_number("1%234#56"), false);
        });
    });

    describe("double_digit_number", function() {
        it("single digit numbers should be prepended with '0'", function() {
            assert.deepEqual(Utils.double_digit_number(1), '01');
            assert.deepEqual(Utils.double_digit_number(4), '04');
        });
        it("double digits number should stay unchanged", function() {
            assert.deepEqual(Utils.double_digit_number(10), '10');
            assert.deepEqual(Utils.double_digit_number(95), '95');
        });
        it("doens't handle negative numbers; scrambled output", function() {
            assert.deepEqual(Utils.double_digit_number(-1), '0-1');
        });
    });

    describe("get_today", function() {
        it("when date passed in, return the same as moment object", function() {
            assert.deepEqual(Utils.get_today("2016-05-19").format("YYYY-MM-DD"),
                moment("2016-05-19").format("YYYY-MM-DD"));
        });
        it("no date passed, return current moment object", function() {
            assert.deepEqual(Utils.get_today().format("YYYY-MM-DD"),
                new moment().format("YYYY-MM-DD"));
        });
    });

    describe("get_january", function() {
        it("get 1st jan moment date of any given year (test date)", function() {
            assert.deepEqual(Utils.get_january("2016-05-19").format("YYYY-MM-DD"),
                moment("2016-01-01").format("YYYY-MM-DD"));
            assert.deepEqual(Utils.get_january("2013-08-24").format("YYYY-MM-DD"),
                moment("2013-01-01").format("YYYY-MM-DD"));
        });
        it("get 1st jan moment date of current year", function() {
            assert.deepEqual(Utils.get_january().format("YYYY-MM-DD"),
                new moment().format("YYYY-01-01"));
        });
    });

    describe("is_valid_date", function() {
        it("returns true for valid YYYY-MM-DD dates", function() {
            assert(Utils.is_valid_date("2016-05-19", "YYYY-MM-DD"), true);
        });
        it("returns true for valid YYYY/MM/DD dates", function() {
            assert(Utils.is_valid_date("2016/05/19", "YYYY/MM/DD"), true);
        });
        it("returns true for valid YYYY/DD/MM dates", function() {
            assert(Utils.is_valid_date("2016/19/05", "YYYY/DD/MM"), true);
        });
        it("returns true for valid DD MMMM 'YY dates", function() {
            assert(Utils.is_valid_date("05 May '16", "DD MMMM 'YY"), true);
        });
        it("returns false for valid date specified with unmatching format", function() {
            assert.ifError(Utils.is_valid_date("2016-05-19", "YYYY/MM/DD"));
        });
        it("returns false for invalid date", function() {
            // invalid day
            assert.equal(Utils.is_valid_date("2015-05-32", "YYYY-MM-DD"), false);
            // invalid day - leap year example
            assert.equal(Utils.is_valid_date("2015-02-29", "YYYY-MM-DD"), false);
            // invalid month
            assert.equal(Utils.is_valid_date("2015-13-19", "YYYY-MM-DD"), false);
            // invalid year
            assert.equal(Utils.is_valid_date("20151-05-19", "YYYY-MM-DD"), false);
        });
    });

    describe("is_valid_year", function() {
        it("valid; year within bounds", function() {
            assert(Utils.is_valid_year("2016", "1990", "2030"), true);
            assert(Utils.is_valid_year("2016", "2015", "2017"), true);
            assert(Utils.is_valid_year("2016", "2016", "2017"), true);
            assert(Utils.is_valid_year("2016", "2015", "2016"), true);
            assert(Utils.is_valid_year("2016", "2016", "2016"), true);
        });
        it("invalid; year outside bounds", function() {
            assert.equal(Utils.is_valid_year("2016", "2010", "2015"), false);
            assert.equal(Utils.is_valid_year("2016", "2017", "2020"), false);
        });
    });

    describe("is_valid_day_of_month", function() {
        it("valid day of the month", function() {
            assert(Utils.is_valid_day_of_month("1"), true);
            assert(Utils.is_valid_day_of_month("5"), true);
            assert(Utils.is_valid_day_of_month("15"), true);
            assert(Utils.is_valid_day_of_month("28"), true);
            assert(Utils.is_valid_day_of_month("30"), true);
            assert(Utils.is_valid_day_of_month("31"), true);
        });
        it("invalid day of the month", function() {
            assert.equal(Utils.is_valid_day_of_month("0"), false);
            assert.equal(Utils.is_valid_day_of_month("32"), false);
        });
    });

    describe("check_valid_alpha", function() {
        it("valid alphabetical", function() {
            assert(Utils.check_valid_alpha("abc"));
            assert(Utils.check_valid_alpha("JohnDeere"));
        });
        it("invalid alphabetical", function() {
            assert.equal(Utils.check_valid_alpha(""), false);
            assert.equal(Utils.check_valid_alpha(" "), false);
            assert.equal(Utils.check_valid_alpha("John Deere"), false);
            assert.equal(Utils.check_valid_alpha("A123"), false);
            assert.equal(Utils.check_valid_alpha("A#1"), false);
        });
    });

    describe("is_valid_name", function() {
        it("valid name", function() {
            assert(Utils.is_valid_name("John", 1, 5));
            assert(Utils.is_valid_name("Ba Ki-moon", 1, 15));
            assert(Utils.is_valid_name("-Jo-hn", 1, 10));
        });
        it("invalid name", function() {
            assert.equal(Utils.is_valid_name("123", 1, 5), false);
            assert.equal(Utils.is_valid_name("John", 1, 3), false);
            assert.equal(Utils.is_valid_name("John?", 1, 5), false);
        });
    });

    describe("get_clean_first_word", function() {
        it("should get and capitalise first word", function() {
            assert.deepEqual(Utils.get_clean_first_word("Only"), "ONLY");
            assert.deepEqual(Utils.get_clean_first_word("Once there was..."), "ONCE");
            assert.deepEqual(Utils.get_clean_first_word("Stop the noise"), "STOP");
        });
        it("should get clean first word if contains non-letters/numbers", function() {
            assert.deepEqual(Utils.get_clean_first_word("O$ne Two T3ree"), "ONE");
            assert.deepEqual(Utils.get_clean_first_word("O$1ne T2wo Th3ree"), "O1NE");
        });
    });

});

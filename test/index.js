var test = require("tape")
var console = require("console")
var toArray = require("array-stream")

var tassert = require("../index")

var TAP_HEADER = "TAP version 13"

test("tassert is a function", function (assert) {
    assert.equal(typeof tassert, "function")

    assert.end()
})

test("tassert outputs TAP", function (assert) {
    var a = tassert("test one")
    a.stream.pipe(toArray(function (list) {
        var first = list.slice(0, 15)
        var last = list.slice(-6)

        assert.deepEqual(first, [
            TAP_HEADER
            , "# test one"
            , "ok 1"
            , "ok 2 message"
            , "not ok 3 some message"
            , "  ---"
            , "    operator: error"
            , "    expected:"
            , "      "
            , "    actual:"
            , "      {"
            , "        \"name\": \"AssertionError\","
            , "        \"message\": \"some message\","
            , "        \"actual\": false,"
            , "        \"expected\": true,"
        ])

        assert.deepEqual(last, [
            "  ..."
            , ""
            , "1..3"
            , "# tests 3"
            , "# pass  2"
            , "# fail  1"
        ])

        assert.end()
    }))

    a(true)
    a(true, "message")
    a(false, "some message")

    a.end()
})

test("tassert multiple", function (assert) {
    var a1 = tassert("test one")
    var a2 = tassert("test two")
    var finished = false

    a1.stream.pipe(toArray(function (list) {
        finished = true

        assert.deepEqual(list, [
            TAP_HEADER
            , "# test one"
            , "ok 1 message a1"
            , "ok 3 message 2 a1"
        ])
    }))
    a2.stream.pipe(toArray(function (list) {
        assert.equal(finished, true)

        assert.deepEqual(list, [
            "# test two"
            , "ok 2 message a2"
            , ""
            , "1..3"
            , "# tests 3"
            , "# pass  3"
            , ""
            , "# ok"
        ])

        assert.end()
    }))

    process.nextTick(function () {
        a1(true, "message a1")
    })

    process.nextTick(function () {
        a2(true, "message a2")

        a1(true, "message 2 a1")

        a1.end()
        a2.end()
    })
})

test("other methods", function (assert) {
    var a = tassert("test correct")

    a.stream.pipe(toArray(function (list) {
        assert.deepEqual(list, [
            TAP_HEADER
            , "# test correct"
            , "ok 1"
            , "ok 2"
            , "ok 3"
            , "ok 4"
            , "ok 5"
            , "ok 6"
            , "ok 7"
            , "ok 8"
            , "ok 9"
            , "ok 10"
            , ""
            , "1..10"
            , "# tests 10"
            , "# pass  10"
            , ""
            , "# ok"
        ])

        assert.end()
    }))

    a.ok(true)
    a.equal(true, true)
    a.notEqual(true, false)
    a.deepEqual({ foo: true }, { foo: true })
    a.notDeepEqual({ foo: true }, { bar: true })
    a.strictEqual("foo", "foo")
    a.notStrictEqual({}, {})
    a.throws(function () {
        throw new Error("foo")
    }, "foo")
    a.doesNotThrow(function () {

    })
    a.ifError(null)

    a.end()
})

test("assert.fail", function (assert) {
    var a = tassert("test fail")

    a.stream.pipe(toArray(function (list) {
        // console.log("list", list)
        var first = list.slice(0, 13)
        var operator = list[14]
        var last = list.slice(-6)

        assert.deepEqual(first, [
            TAP_HEADER
            , "# test fail"
            , "not ok 1 my message"
            , "  ---"
            , "    operator: error"
            , "    expected:"
            , "      "
            , "    actual:"
            , "      {"
            , "        \"name\": \"AssertionError\","
            , "        \"message\": \"my message\","
            , "        \"actual\": \"foo\","
            , "        \"expected\": \"bar\","
        ])

        assert.ok(operator.indexOf("custom type"))

        assert.deepEqual(last, [
            "  ..."
            , ""
            , "1..1"
            , "# tests 1"
            , "# pass  0"
            , "# fail  1"
        ])

        assert.end()
    }))

    a.fail("foo", "bar", "my message", "custom type")

    a.end()
})

test("assert.test macro", function (assert) {
    var t = tassert.test
    var finished = false

    var t1 = t("first", function (a) {
        a(true)

        a.end()
    })

    t1.stream.pipe(toArray(function (list) {
        finished = true

        assert.deepEqual(list, [
            TAP_HEADER
            , "# first"
            , "ok 1"
        ])
    }))

    var t2 = t("second", function (a) {
        assert.equal(finished, true)
        a(true)

        a.end()
    })

    t2.stream.pipe(toArray(function (list) {
        assert.equal(finished, true)

        assert.deepEqual(list, [
            "# second"
            , "ok 2"
            , ""
            , "1..2"
            , "# tests 2"
            , "# pass  2"
            , ""
            , "# ok"
        ])

        assert.end()
    }))

    assert.end()
})

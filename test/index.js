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
        // console.log("list", list)
        assert.deepEqual(list, [
            TAP_HEADER
            , "# test one"
            , "ok 1 message"
            , ""
            , "1..1"
            , "# tests 1"
            , "# pass  1"
            , ""
            , "# ok"
        ])

        assert.end()
    }))

    a(true, "message")
    a(false, "some message")

    a.end()
})

test("tassert multiple", function (assert) {
    // var a = tassert()

    assert.end()
})

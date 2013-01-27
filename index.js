var Render = require("tap-render")
var ConsoleStream = require("console-stream")
var assert = require("assert")

var commands = [
    ["fail", 2]
    , ["ok", 1]
    , ["equal", 2]
    , ["notEqual", 2]
    , ["deepEqual", 2]
    , ["notDeepEqual", 2]
    , ["strictEqual", 2]
    , ["notStrictEqual", 2]
    , ["throws", 3]
    , ["doesNotThrow", 3]
    , ["ifError"]
]

var slice = Array.prototype.slice
var queue = []

Assert.test = test

module.exports = Assert

function Assert(opts) {
    opts = opts || {}
    var render = Render(opts).pause()
    var assertion = wrap("ok", 1)

    if (typeof opts === "string") {
        opts = { name: opts }
    }

    render.begin()

    if (opts.name) {
        render.push({ name: opts.name })
    }

    assertion.stream = render
    assertion.end = end

    process.nextTick(function pipeToConsole() {
        if (!render.piped) {
            render.pipe(ConsoleStream())
        }

        render.resume()
    })

    for (var i = 0; i < commands.length; i++) {
        var command = commands[i]
        var name = command[0]
        assertion[name] = wrap(name, command[1])
    }

    return assertion

    function wrap(command, index) {
        return assertion

        function assertion() {
            var message = arguments[index]

            try {
                assert[command].apply(assert, arguments)
                render.push(null, {
                    ok: true
                    , name: message
                })
            } catch (err) {
                render.push(null, {
                    ok: false
                    , name: message
                    , actual: err
                    , operator: "error"
                })
            }
        }
    }

    function end() {
        render.close()
    }
}

function test(name, cb) {
    var assert = Assert()

    queue.push([cb, assert, name])

    if (queue.length === 1) {
        process.nextTick(run)
    }

    return assert
}

function run() {
    var item = queue.shift()
    if (!item) {
        return
    }

    var cb = item[0]
    var assert = item[1]
    var name = item[2]

    assert.stream.once("end", run)

    assert.stream.push({
        name: name
    })

    cb(assert)
}

var Render = require("tap-render")
var ConsoleStream = require("console-stream")
var assert = require("assert")

var begin = new String("begin")
var close = new String("close")
var slice = Array.prototype.slice

module.exports = Assert

function Assert(opts) {
    opts = opts || {}
    var render = Render(opts)
    var queue = []
    var ready = false

    if (typeof opts === "string") {
        opts = { name: opts }
    }

    push(begin)

    if (opts.name) {
        push({ name: opts.name })
    }

    assertion.stream = render
    assertion.end = end

    process.nextTick(function pipeToConsole() {
        if (!render.piped) {
            render.pipe(ConsoleStream())
        }
    })

    process.nextTick(function flush() {
        ready = true
        queue.forEach(write)
    })

    return assertion

    function assertion(boolean, arg) {
        try {
            assert.apply(null, arguments)
            push(null, {
                ok: true
                , name: arg
            })
        } catch (err) {
            
        }
    }

    function push() {
        var args = slice.call(arguments)

        ready ? write(args) : queue.push(args)
    }

    function write(args) {
        var token = args[0]

        if (token === begin) {
            render.begin()
        } else if (token === close) {
            render.close()
        } else {
            render.push.apply(null, args)
        }
    }

    function end() {
        push(close)
    }
}

# assert-tap

[![build status][1]][2]

[![browser support][3]][4]

Assert module but outputs TAP

## Example

```js
var assert = require("assert-tap")("my example")

// use the assert api
assert.equal("one", "one")

// outputs TAP to console.
// it's that easy.
// make sure to call assert.end() to end your example
assert.end()
```

## example with `test` interface

```js
var test = require("assert-tap").test

test("my test", function (assert) {
    // some assertions

    // Now I am done
    assert.end()
})

test("my second test", function (assert) {
    // some assertions

    // can end asynchronously
    setTimeout(function () {
        assert.end()
    }, 500)
})
```

## Installation

`npm install assert-tap`

## Contributors

 - Raynos

## MIT Licenced


  [1]: https://secure.travis-ci.org/Raynos/assert-tap.png
  [2]: http://travis-ci.org/Raynos/assert-tap
  [3]: http://ci.testling.com/Raynos/assert-tap.png
  [4]: http://ci.testling.com/Raynos/assert-tap

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

## Installation

`npm install assert-tap`

## Contributors

 - Raynos

## MIT Licenced


  [1]: https://secure.travis-ci.org/Raynos/assert-tap.png
  [2]: http://travis-ci.org/Raynos/assert-tap
  [3]: http://ci.testling.com/Raynos/assert-tap.png
  [4]: http://ci.testling.com/Raynos/assert-tap

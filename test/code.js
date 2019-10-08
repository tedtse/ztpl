require('fs')

var x = 1;
var y = [ 1, 2, 3, 4 ];
var z = {
  a: 3,
  b: 4,
  c: 5
};

var result = 0
result = add(1, 2)
result = sub(result, 1)
console.log(result)

try {
  add(1, 2)
} catch (e) {
} finally {
}

while (result > 0) {
  result--
}

do {
  result++
} while (result < 5)

switch (result) {
  case 1:
    break
  case 2:
    break
}

if (result > 3) {
  console.log('three')
} else if (result > 2) {
  console.log('two')
} else {
  console.log('one')
}

for (var i = 0; i < 10; i++) {
  console.log(i)
}

for (var i in z) {
  console.log(z[i])
}

for (let i of y) {
  console.log(y[i])
}

function add (a, b) {
  return a + b
}

function sub (a, b) {
  return a - b
}

function * gen () {
  yield add()
}

function echo (msg) {
  var _msg = msg || 'hello'
  console.log(_msg)
}

module.exports = {
  add: add,
  sub: sub,
  echo: echo
}

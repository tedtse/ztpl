module.exports = {
  variableTest: {
    orig: `var x = 1`,
    dest: `var x = 1
      var m = 4
    `
  },
  functionTest: {
    orig: `function add (a, b) {}`,
    dest: `function add () {
      var result = 0
      var args = Array.prototype.slice.call(arguments)
      args.ForEach(function (arg) {
        result += arg
      })
      return result
    }`
  },
  forTest: {
    orig: `for (var i = 0; i < 10; i++) {}`,
    dest: `for (var i = 0; i < 10; i++) {
      console.log(i * 2)
    }`
  },
  forInTest: {
    orig: `for (var i in z) {}`,
    dest: `for (var i in z) {
      console.log(z[i] * 3)
    }`
  },
  forOfTest: {
    orig: `for (let i of y) {}`,
    dest: `for (let i of y) {
      console.log(y[i] * 4)
    }`
  },
  expressionTest: {
    orig: `result = add(1, 2)`,
    dest: `result = add(1, 2, 3)`
  },
  ifTest: {
    orig: `if (result > 3) {}`,
    dest: `if (result > 3) {
      console.log('three')
    } else if (result > 2) {
      console.log('two')
    } else if (result > 1) {
      console.log('one')
    } else {
      console.log('zero')
    }`
  },
  generateTest: {
    orig: `function * gen () {}`,
    dest: `function * gen () {
      yield add()
      yield sub()
    }`
  },
  tryTest: {
    orig: `try {
      add(1, 2)
    } catch (e) {
    }`,
    dest: `try {
      add(1, 2)
    } catch (e) {
      console.log(e)
    } finally {
    }`
  },
  whileTest: {
    orig: `while (result > 0) {}`,
    dest: `while (result > 0) {
      result--
      console.log(result)
    }`
  },
  doWhileTest: {
    orig: `do {} while (result < 5)`,
    dest: `do {
      result++
      console.log(result)
    } while (result < 5)`
  },
  switchTest: {
    orig: `switch (result) {}`,
    dest: `switch (result) {
      case 1:
        break
      case 2:
        break
      case 3:
        break
    }`
  },
  moduleExportsTest: {
    orig: `module.exports = {
      add: add,
    }`,
    dest: `module.exports = {
      x: x,
      add: add
    }`,
    selector: 'expression.right.properties'
  },
  objectTest: {
    orig: `var z = { a: 3 }`,
    dest: `var z = { a: 3, d: 6 }`,
    selector: 'declarations.0.init.properties'
  }
}

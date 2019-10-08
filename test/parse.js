var argv = require('minimist')(process.argv.slice(2))
var config = require('./modify-config.js')
var modifySectionCode = require('../lib/modify-section-code.js')

var testOpts
// node test/parse.js --test moduleExportsTest
if (argv.test !== undefined && argv.test !== null) {
  testOpts = config[argv.test]
} else {
  testOpts = config.objectTest
}

modifySectionCode('./test/code.js', './test/out.js', testOpts)

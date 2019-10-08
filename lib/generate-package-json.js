var fs = require('fs')
var inquirer = require('inquirer')
var config = require('../lib/config.js')
var declare = require('../lib/declare.js')

module.exports = function (destPath, tplPath) {
  var tplPackageJSONPath = process.cwd() + '/' + tplPath + '/' + declare.templateSetting + '/package.json'
  var tplPackageJSON = require(tplPackageJSONPath)

  return inquirer.prompt([
    {
      type: 'input',
      name: 'project_name',
      message: 'Please input name of the project'
    },
    {
      type: 'input',
      name: 'project_author',
      message: 'Please input author of the project'
    },
    {
      type: 'input',
      name: 'project_description',
      message: 'Please input description of the project'
    }
  ])
    .then(function (answers) {
      return generate(answers.project_name, answers.project_author, answers.project_description, tplPackageJSON, destPath)
    })
}

function generate (name, author, description, tplPackageJSON, destPath) {
  var prefixReg = new RegExp('^' + config.projectNamePrefix)
  var name = prefixReg.test(name) ? name : config.projectNamePrefix + name
  var version = '1.0.0'
  // var license = tplPackageJSON.license
  // var main = tplPackageJSON.main
  // var bin = tplPackageJSON.bin
  // var script = tplPackageJSON.script
  // var dependencies = tplPackageJSON.dependencies
  // var devDependencies = tplPackageJSON.devDependencies

  // var packageJSON = {
  //   name,
  //   author,
  //   description,
  //   version,
  //   license,
  //   main,
  //   bin,
  //   script,
  //   dependencies,
  //   devDependencies
  // }
  var clone = Object.assign({}, tplPackageJSON)
  // 去掉 NPM 包 package.json 中以 "_" 开头的属性
  var filterArray = Object.keys(clone).filter(function (key) {
    return !/^_.+/.test(key)
  })
  var filterJSON = {}
  filterArray.forEach(function (key) {
    filterJSON[key] = tplPackageJSON[key]
  })
  var packageJSON = {
    ...filterJSON,
    ...{
      name,
      author,
      version,
      description
    }
  }
  return new Promise(function (resolve, reject) {
    fs.writeFileSync(destPath + '/package.json', JSON.stringify(packageJSON, null, 2))
    resolve()
  })
}

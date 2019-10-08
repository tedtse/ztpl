var deepcopy = require('deepcopy')
var exec = require('child_process').exec
var exists = require('fs').existsSync
var fs = require('fs')
var json5 = require('json5')
var ora = require('ora')
var path = require('path')
var rm = require('rimraf').sync
var shell = require('shelljs')
var declare = require('./declare.js')
var currentPath = process.cwd()

module.exports = {
  depth: function (dir) {
    return path.normalize(dir).split(path.sep).length - 1
  },
  noop: function () {
    return false
  },
  done: function () {
    return Promise.resolve()
  },
  isFile: function (_path) {
    var stats = fs.statSync(_path)
    return stats.isFile()
  },
  isDirectory: function (_path) {
    var stats = fs.statSync(_path)
    return stats.isDirectory()
  },
  // 获得 package.json 内容
  getPackageJSON: function () {
    var packageJSONString = fs.readFileSync(currentPath + '/package.json', declare.encoding)
    return json5.parse(packageJSONString)
  },
  // 获得 NPM 包的版本数组
  getVersions: function (name) {
    return new Promise(function (resolve, reject) {
      exec('npm info ' + name, declare.encoding, function (err, stdout, stderr) {
        if (err) {
          reject(err)
        } else {
          var infos = json5.parse(stdout)
          var versions = _versionSort(infos.versions, infos.time)
          resolve(versions)
        }
      })
    })
  },
  // 将模板信息（模板名称、模板版本写入package.json）
  writeTplInfoToPackageJSON: function (templateName, templateVersion) {
    var packageJSON = this.getPackageJSON()
    packageJSON.templateName = templateName
    packageJSON.templateVersion = templateVersion
    fs.writeFileSync(
      currentPath + '/package.json',
      JSON.stringify(packageJSON, null, 2),
      { encoding: declare.encoding }
    )
    return Promise.resolve()
  },
  // 获得附加依赖
  getExtraDependencies: function (packageJSON, dependencies) {
    var result = []
    dependencies.forEach(function (item) {
      if (!(packageJSON.dependencies && packageJSON.dependencies[item]) && !(packageJSON.devDependencies && packageJSON.devDependencies[item])) {
        result.push(item)
      }
    })
    return result
  },
  // 安装附加依赖
  installExtraDependencies: function (dependencies) {
    if (dependencies.length === 0) {
      return Promise.resolve()
    }
    var spinner = ora('downloading extraDependencies')
    spinner.start()
    shell.exec('npm install ' + dependencies.join(' ') + ' --no-save --no-optional')
    rm('package-lock.json')
    spinner.stop()
    return Promise.resolve()
  },
  // 删除附加依赖
  uninstallExtraDependencies: function (dependencies) {
    if (dependencies.length === 0) {
      return Promise.resolve()
    }
    var spinner = ora('removing extraDependencies')
    spinner.start()
    shell.exec('npm uninstall ' + dependencies.join(' ') + ' --no-optional')
    spinner.stop()
    return Promise.resolve()
  },
  // 插件执行
  executePlugin: function (pluginPath, packageJSON) {
    var DependenciesFilter
    var Plugin
    // 清除 require 缓存
    delete require.cache[pluginPath]
    /**
     * 读取插件包的 dependencies 属性，得到插件需要的依赖
     * 对比本地的 package.json 文件，筛选出需要安装的附加包
     * 安装附加包
     * 读取插件包的 execute.js 文件，执行 execute 方法
     * 删除附加包
     */
    Plugin = require(pluginPath)
    // DependenciesFilter = this.getExtraDependencies(packageJSON, Plugin.dependencies)
    return this.installExtraDependencies(Plugin.dependencies)
      .then(function () {
        return Plugin.execute()
      })
      // .then(function () {
      //   return that.uninstallExtraDependencies(DependenciesFilter)
      // })
  },
  executeHook: function (debugMode, hook, packageJSON) {
    var hookPath
    if (debugMode) {
      hookPath = path.resolve(currentPath, declare.debugDirectory + '/' + declare.templateSetting + '/' + hook + '.js')
    } else {
      hookPath = path.resolve(currentPath, declare.nodeModules + '/' + packageJSON.templateName + '/' + declare.templateSetting + '/' + hook + '.js')
    }
    if (exists(hookPath)) {
      return this.executePlugin(hookPath, packageJSON)
    } else {
      return this.done()
    }
  }
}

// 按照发布顺序排序版本数组
function _versionSort (versions, time) {
  var versionsClone = deepcopy(versions)
  var result = []
  while (versionsClone.length) {
    var minIndex = 0
    versionsClone.reduce(function (prev, curr, index) {
      if (time[prev] > time[curr]) {
        minIndex = index
      }
    })
    result.push(versionsClone.splice(minIndex, 1)[0])
  }
  return result
}

如果模板需要修改，但修改的是与模板的版本逻辑不相关的内容（例如中铝视拓之前的前端项目并不是通过模板维护，而是手动修改，现在需要让之前的前端项目具备模板升级的能力，就需要打补丁了）。补丁文件的格式为

```
  {
    dependencies: [
      ...
    ],
    execute: function () {
      ...
    }
  }
```

* dependencies

补丁函数依赖的包，需要在执行补丁函数前额外安装。

* execute

补丁函数的主程序，返回一个 promise 。

### 完整示例

```
  module.exports = {
    dependencies: [ 'json5' ],
    execute: function () {
      var fs = require('fs')
      var json5 = require('json5')

      // 当前路径
      var currentPath = process.cwd()

      // 将 package.json 转化为 JSON 对象，并做相应处理
      var packageJSONString = fs.readFileSync(currentPath + '/package.json', 'utf-8')
      var packageJSON = json5.parse(packageJSONString)
      // TODO

      // 重写 package.json
      fs.writeFileSync(currentPath + '/package.json', JSON.stringify(packageJSON, null, 2))

      // 返回一个 promise 切记！！！
      return Promise.resolve()
    }
  }
```

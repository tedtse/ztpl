每个模板都必须有一个 __template_setting 文件夹，里面有一个 <type>-hook.js 文件。 称为钩子函数，指的是当执行 init 或 update 命令之前或执行成功后，模板要执行的附加操作。这个文件的格式为

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

钩子函数依赖的包，需要在执行钩子函数前额外安装。

* execute

钩子函数的主程序，如 init 或 update 后对某个文件改名。

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

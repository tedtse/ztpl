每个模板都必须有一个 __template_setting 文件夹，里面有一个 track.js 文件。当执行 update 命令时，会根据这个文件对项目的文件进行相关更改。更改主要分为以下几类:

* add - 添加
* remove - 删除
* overwrite - 覆盖
* modify - 局布修改

### add

```
  {file/directory}: 'add'
```

### remove

```
  {file/directory}: 'remove'
```

### overwrite

```
  {file/directory}: 'overwrite'
```


#### modify 
配置为 Object 对象。属性

> type: 类型。value 是 'modify'


> orig: 原始代码片段。如

```
  {file/directory} {
    type: 'modify',
    options: {
      orig: `function add (a, b) {}`
    }
  }
  更多例子查看 test/modify-config.js
```

> dest: 修改后的代码片段。如

```
  {file/directory} {
    type: 'modify',
    options: {
      orig: `function add () {}`
      dest: `function add () {
        var result = 0
        var args = Array.prototype.slice.call(arguments)
        args.ForEach(function (arg) {
          result += arg
        })
        return result
     }`
    }
    
  }
  更多例子查看 test/modify-config.js
```

> context: 上下文。遍历抽象语法树时父节点 'type'。具体代码实现

```
  estraverse.traverse(ast, {
    enter: function (node, parent) {
      console.log(parent.type === context)
      ...
    }
  })
```

> selector:  类似 jQuery 选择器。遍历抽象语法树时节点对象的内部属性。如

```
  {file/directory} {
    type: 'modify',
    options: {
      selector: 'declarations.0.init.properties'
    }
  }
```

### 完整示例

```
  module.exports = {
    'build/a.js': 'add',
    'build/b.js': 'remove',
    'build/c.js': 'overwrite',
    'src/config/menu/': 'remove',
    'config/index.js': {
      type: 'modify',
      options: {
        orig: `module.exports = {
          includeAssets: [
            includeAssetsPrefix + 'static/conf/f2eSDKConf.js',
            includeAssetsPrefix + 'static/conf/systemManageVueConf.js'
          ],
        }`,
        dest: `module.exports = {}`,
        selector: 'expression.right.properties'
      }
    }
  }
  更多例子查看 test/modify-config.js
```

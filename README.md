前端项目模板管理工具，实现模板自动初始化、自动升级等功能

## 安装
```
  npm install -g ztpl
```

## 用法

### ztpl init

***
根据提示依次输入项目名称、创建作者、项目描述后创建一个前端项目

#### 参数
* 模板名称 - 要下载的NPM包。如
```
  ztpl init <pkg>(@version)
```
* --debug - 调试模式，指定一个绝对路径调试 init 功能。如
```
  ztpl init --debug <aboslutePath>
```

**注意** 由于设计缺陷，目前 ztpl init 没有 **.gitignore** 文件，请自行添加

***

### ztpl update
***
更新模板

#### 参数
* 模板名称 - 要更新的NPM包。如
```
  ztpl update
```
* --debug - 调试模式，指定一个绝对路径调试 update 功能。如
```
  ztpl update --debug <aboslutePath>
```

***

### ztpl patch
***
安装补丁，与模板没有一定的关联，确是项目必须的代码；或是几个项目要调整一些代码，又不能影响到同一模板的其他项目，都可以通过补丁的方式来实现。

#### 参数
* 模板名称 - 要安装的NPM补丁包。如
```
  ztpl patch <pkg>(@version)
```
* --debug - 调试模式，指定一个绝对路径调试 patch 功能。如
```
  ztpl patch --debug aboslutePath
```

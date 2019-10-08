module.exports = {
  encoding: 'utf-8',
  debugDirectory: '__debug_tpl',
  nodeModules: 'node_modules',
  templateSetting: '__template_setting',
  templateTrack: 'track.js',
  // 默认 track.js、pre-hook.js、post-hook.js 的导出模块代码
  defaultSettingModule: {
    execute: function () {
      return Promise.resolve()
    },
    dependencies: []
  }
}

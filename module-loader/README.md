### 源码阅读笔记

Day1[5:00 ~ 5:30 30min]

#### 重要的函数
parseDependencies 获取依赖
Module.resolve 获取URI
Module.save
Module.prototype.fetch 加载模块，建立一个script标签进行文件加载
Module.prototype.exec  模块加载成功之后调用该函数运行模块的定义,会执行define(function () {}) 执行define函数中的函数参数

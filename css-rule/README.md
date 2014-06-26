CSS模块化实验
=================

### CSS文件命名规范

指定文件命名规范的目的

- 统一的文件名有助于划分模块
- 文件名可以具有更好的描述性
- 减少新人进入项目的学习成本

首先系统抽象为布局，组件2种类型，还有一些辅助的如:util.css reset.css,

**文件的命名规范**

`系统前缀[_模块类型].模块名称[.子模块].css`

通过这种约定来实现文件名对模块的描述性。

```js
//工具类
wa.util.css
//重置
wa.reset.css
//整体布局文件
wa_layout.godview.css
//头部布局
wa_layout.header.css
//侧边栏布局
wa_layout.sidebar.css
//页面主区域布局
wa_layout.content.css
//wa_component 系统组件
wa_component_report.css
wa_component.layoutEditor.css
wa_component.layoutEditor.sidebar.css
wa_component.breadcrumb.css
wa_component.menu.css
wa_component.table.css
```
当然，还有另外一种方案就是采用目录结构来进行切分的
```js
├── layout //布局
│   ├── content.css
│   ├── footer.css
│   ├── header.css
│   └── sidebar.css
├── modules //模块
│   ├── layoutEditor.css
│   ├── layoutEditor.sidebar.css
│   └── report.css
├── widget //组件
├── reset.css //重置
├── util.css //工具类
└── wa.css //入口
```

### CSS规则命名规范

使用如下规则来进行模块的划分

```css

/* Utility */
.u-utilityName {}

/* Component */
.ComponentName {}

/* Component modifier */
.ComponentName__modifierName {}

/* Component descendant */
.ComponentName-descendant {}

/* Component descendant modifier */

.ComponentName-descendant__modifierName {}

/* Component state (scoped to component)*/

.ComponentName.is-stateOfComponent {}

```
如果有需要,可以在规则的前面加上系统前缀，如本实验中，全部规则都会加上`az`前缀 如 `.az-u-clearfix {}`

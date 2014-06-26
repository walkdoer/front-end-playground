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
az.util.css
//重置
az.reset.css
//整体布局文件
az_layout.godview.css
//头部布局
az_layout.header.css
//侧边栏布局
az_layout.sidebar.css
//页面主区域布局
az_layout.content.css
//az_component 系统组件
az_component_report.css
az_component.layoutEditor.css
az_component.layoutEditor.sidebar.css
az_component.breadcrumb.css
az_component.menu.css
az_component.table.css
```

当然，还有另外一种方案就是采用目录结构来进行切分的

```bash
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
└── az.css //入口
```

### CSS规则命名规范

使用如下规则来进行模块的划分

```css

/* Utility */
.u-utilityName {}

/* Component */
.ComponentName {}

/* category 用于对组件进行分类*/

/* 表示布局*/
._layout-ComponentName{}

/* 表示通用模块
._component-ComponentName{}

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

#### 关于Layout布局
布局的命名格式格式  `projectPrefix_layout-LayoutName`,添加这个标识符是为了更好的将布局类和组件类区分开来, 如果没有"_layout"在类名中，很难区分az-header到底是一个布局还是一个组件
```
<div class="az_layout-header">
  <nav class="az-nav"> <!-- ... --></nav>
</div>
```
如果按照组件的思想，页面上一切皆为组件，那么布局也只是一个有其他组件构成的大组件而已，按照这个逻辑来讲，是不应该通过添加标识符来进行概念上的区分。那么，如“_layout”这个标识符的存在不是为了区分"组件"和"布局"这个两个实际上是一样的概念，而仅仅是为了阅读的方便。那就可以避免"组件"在概念上的不一致了。

#### 统一的概念

css文件名的命名规范和css规则的命名规范在概念上尽量统一，例如文件命名规范中'az_layout.header.css`  模块类型有归类的意思,而在css规则命名规范中，也是用了同样的形式来表示同样的概念 例如`.az_layout-header {}` 中的 "_layout"; 所以名为 'az_layout.header.css' 的css文件中的规则也是以 `.az_layout-header{}` 这样的形式存在的（除了划分子模块的分隔符有差异之外）


## 总结

**清晰统一的命名带来更好的自我描述性**
定义了这样子的规范之后，看文件名就可以知道这个文件的用途.例如看到`az_layout.header.css`文件，就知道这是一个布局文件，看到`az_com.nav.css`就知道这是一个css组件.规则也是同样的道理。

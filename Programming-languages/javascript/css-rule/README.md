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
//az_com 系统组件
az_com_report.css
az_com.layoutEditor.css
az_com.layoutEditor.sidebar.css
az_com.breadcrumb.css
az_com.menu.css
az_com.table.css
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
._u-utilityName {}

/*@example*/

    .az_u-clearfix {}

/* 通用的背景样式*/

._bg-colorName {} 

/*@example*/

    .az_bg-red {}
    .az_bg-redToBlue{}
    .az_bg-rainbow{}

/* Component */
.ComponentName {}

/* category 用于对组件进行分类
 目前类别
 _com 组件，页面上的所有都是组件
 _layout 布局
 */

/* 表示布局*/
._layout-ComponentName{}

/*@example*/

    .az_layout-header {}
    .az_layout-body {}
    .az_layout-footer {}


/* 表示组件 */
._com-ComponentName{}

/*@example*/

    .az_com-nav {}
    .az_com-button {}
    .az_com-menu {}
    .az_com-selector {}
    .az_com-slider {}

/* Component modifier */
.ComponentName__modifierName {}

/*@example*/

    .az_com-button__big {}
    .az_com-button__withIcon {}

/* Component descendant */
.ComponentName-descendant {}

/*@example*/
    .az_com-menu {}
    .az_com-menu-icon {}
    .az_com-menu-text {}

/* Component descendant modifier */
.ComponentName-descendant__modifierName {}

/*@example*/
    .az_com-menu-icon__right;

/* Component state (scoped to component)*/
.ComponentName.is-stateOfComponent {}

/*@example*/
    .az.is-rendered{}
    .az_com-menu.is-actived {}
    .az_com-button.is-disabled {}
    .az_com-window.is-mimimize {}


/* 
   js hook 用于提供给js文件使用的类名，这种是不会出现在css文件的
   开发人员见到这个前缀，就知道这个类名不是用于样式，而是js hook，不能随便删除
   而没有js前缀的，则可以随意重构，不会影响js文件
 */
.js-css-rule {}

/*@example*/
    .js-confirm {}  /*<button class="az_com-btn js-confirm">确定</button>*/
    .js-cancel {}
    .js-delete {}

```
如果有需要,可以在规则的前面加上系统前缀，如本实验中，全部规则都会加上`az`前缀 如 `.az_u-clearfix {}`

#### 关于Layout布局
布局的命名格式格式  `projectPrefix_layout-LayoutName`,添加这个标识符是为了更好的将布局类和组件类区分开来, 如果没有"_layout"在类名中，很难区分az-header到底是一个布局还是一个组件
```html
<div class="az_layout-header">
  <nav class="az-nav"> <!-- ... --></nav>
</div>
```
如果按照组件的思想，页面上一切皆为组件，那么布局也只是一个有其他组件构成的大组件而已，按照这个逻辑来讲，是不应该通过添加标识符来进行概念上的区分。那么，如“_layout”这个标识符的存在不是为了区分"组件"和"布局"这个两个实际上是一样的概念，而仅仅是为了阅读的方便。那就可以避免"组件"在概念上的不一致了。


#### 关于继承和组合

使用多个类名的组合来实现想要的样式

```html
<button class="az_com-btn az_com-btn__blue"></button>
```

`.az_com-btn` 代表的是一个按钮组件
`.az_com-btn__blue` 从规则格式可以看到，这是一个modifier 表示的是一个蓝色的按钮

通过这样一种组合形式来实现目标的样式, 如果要使用一个大按钮，只需要添加多一个类就能够达到目的，例如

```html
<button class="az_com-btn az_com-btn__big"></button>
```

在进一步，想要实现一个大的蓝色的按钮，同样只需要组合类名即可

```html
<button class="az_com-btn az_com-btn__big az_com-btn__blue"></button>
```

而另外一种方式是使用继承
```css
.az_com-btn,
.az_com-btn__blue,
.az_com-btn__yellow{
    /*按钮共有的样式*/
}

.az_com-btn__blue{ background: blue; }
.az_com-btn__yellow{ background: yellow; }
```
html这样子使用css规则:
```html
<button class="az-btn__blue"></button>
```

如果要实现一个大按钮，那么css规则就要改动两个位置，一个是共有的基类, 另外一个就是添加一个新的子类`.az_com-btn__big`修改后如下


```css
.az_com-btn,
.az_com-btn__blue,
.az_com-btn__yellow
.az_com-btn__big{
    /*按钮共有的样式*/
}

.az_com-btn__blue{ background: blue; }
.az_com-btn__yellow{ background: yellow; }
.az_com-btn__big{ font-size: 2rem; height: 50px;}
```
```html
<button class="az-btn__big"></button>
```


很明显，使用继承虽然可以减少class的数量，但是较难维护,还是组合的方式扩展性更好,而且可以开发者很容易通过良好命名的css规则就能够知道这个按钮的外观。同时因为类的粒度更小，更容易得到复用


#### 统一的概念

css文件名的命名规范和css规则的命名规范在概念上尽量统一，例如文件命名规范中'az_layout.header.css`  模块类型有归类的意思,而在css规则命名规范中，也是用了同样的形式来表示同样的概念 例如`.az_layout-header {}` 中的 "_layout"; 所以名为 'az_layout.header.css' 的css文件中的规则也是以 `.az_layout-header{}` 这样的形式存在的（除了划分子模块的分隔符有差异之外）


## 总结

**清晰统一的命名带来更好的自我描述性**
定义了这样子的规范之后，看文件名就可以知道这个文件的用途.例如看到`az_layout.header.css`文件，就知道这是一个布局文件，看到`az_com.nav.css`就知道这是一个css组件文件. 开发人员可以从文件名中就可以了解到文件的概要信息. css规则也是同样的道理。

(function () {

    'use strict';

    /**
     * 菜单节点格式
     * {
     *     id: 菜单Id {String}
     *     text: 菜单显示文本 {String}
     *     expanded: 是否展开 {Boolean}
     *     iconCssClass: 图标Css类 {String}
     *     checkbox: 开启checkbox功能 {Boolean} 如果父节点开启了checkbox功能，则该树的所有节点开启checkbox功能
     *     children: 子菜单 {Array}
     *     dnd: 开启拖拽功能 {Boolean}
     * }
     */

    var nodeTpl = _.template([
        '<li>',
            '<div class="title">',
                '<i class="<%=iconCssClass%>"></i>',
                '<span><%=text%></span>',
            '</div>',
            '<ul class="children"></ul>',
        '</li>'
    ].join(''));


    var leafTpl = _.template([
        '<li>',
            '<div class="title">',
                '<i class="<%=iconCssClass%>"></i>',
                '<span><%=text%></span>',
            '</div>',
        '</li>'
    ].join(''));

    function MenuTree(element, options) {
        var $el = $(element);
        this.$el =$el;
        var root = options.data;
        var tree = buildTree(root);
        var $tree = buildDOMTree(tree);
        $el.append($tree);
        this.initDnD();
        return this;
    }

    MenuTree.prototype = {
        constructor: MenuTree,
        initDnD: function () {
            var $ul = this.$el.find('ul');
            $ul.sortable({
                placeholder: "ui-state-highlight",
                connectWith: "ul"
            });
            var $li = this.$el.find('li');
            $li.droppable({
                //activeClass: "ui-state-hover",
                //hoverClass: "ui-state-active",
            });
            $ul.disableSelection();
        }
    };

    function buildTree(root) {
        var tree = new TreeNode(_.extend({
            parent: null,
            children: []
        }, _.omit(root, 'children')));
        var _queue_ = [];
        var node, item, currentNode = tree, parentNode, itemChildren;
        _queue_ = _queue_.concat([].concat(root.children).reverse());
        while(_queue_.length) {
            item = _queue_.pop();
            while(currentNode.children.length === currentNode.orginChildLen) {
                currentNode = currentNode.parent;
            }
            node = new TreeNode(_.extend({
                parent: currentNode,
                children: []
            }, _.omit(item, 'children')));
            //将节点插入到树中
            currentNode.appendChild(node);
            itemChildren = item.children;
            if (!_.isEmpty(itemChildren)) {
                _queue_ = _queue_.concat([].concat(itemChildren).reverse());
                node.orginChildLen = itemChildren.length;
                currentNode = node;
            }
        }
        return tree;
    }


    function buildDOMTree(root) {
        var $node;
        if (root.isLeaf()) {
            $node = $(leafTpl(root));
        } else {
            var fragment = document.createDocumentFragment() 
            _.each(root.children, function (child) {
                fragment.appendChild(buildDOMTree(child)[0]);
            });
            $node = $(nodeTpl(root));
            $node.find('.children').append(fragment);
        }
        return $node;
    }



    $.fn.menuTree = function (option) {
        var args = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
        return this.each(function () {
            var $this = $(this),
                menuTree = $this.data('menuTree');
            if (!menuTree) {
                // new 一个 MenuTree 放到内存中
                menuTree = new MenuTree(this, typeof option === 'object' ? option : {});
                $this.data('menuTree', menuTree);
            }
            // 执行方法/命令
            if (typeof option === 'string' && menuTree[option]) {
                menuTree[option].apply(menuTree, args);
            }
        });
    };

    function TreeNode(data) {
        _.extend(this, {
            iconCssClass: ''
        }, data);
        this.children = data.children || [];
    }

    TreeNode.prototype.isLeaf = function () {
        return this.children.length === 0;
    };

    TreeNode.prototype.appendChild = function (node) {
        return this.children.push(node);
    };

    TreeNode.prototype.removeChild = function (node) {
        var index = _.findIndex(this.children, function (child, index) {
            if (node === child && (_.isString(node) && node === child.id)) {
                return true;
            }
        });
        return this.children.splice(index, 1);
    };

    TreeNode.prototype.hasChild = function () {
        return this.children.length > 0;
    };
     
    TreeNode.prototype.isRoot = function () {
        return this.parent == null;
    };

    

    return MenuTree;
})();


define(function (require, exports, module) {
    'use strict';

    var $ = require('core/selector');

    /**
     * 异步调整函数
     * @param  {DOM}   items
     * @param  {Function}   process 执行调整细节的函数
     * @param  {Object}   context 上下文环境
     * @param  {Function} callback 调整结束的回调函数
     * @return {Object} stopper
     */
    var timedChunk = function (items, process, context, callback) {
            var stopper = {}, timer, todo;
            function start() {
                //复制Array
                todo = [].concat(items);
                if (todo.length > 0) {
                    (function loop() {
                        var start = +new Date(),
                            item;
                        do {
                            item = todo.shift();
                            process.call(context, item);
                        } while (todo.length > 0 && (+new Date() - start < 50));
                        if (todo.length > 0) {
                            timer = setTimeout(loop, 25);
                        } else {
                            if (callback) {
                                callback.call(context, items);
                            }
                        }
                    }());
                } else {
                    if (callback) {
                        callback.call(context, items);
                    }
                }
            }
            stopper.stop = function () {
                if (timer) {
                    clearTimeout(timer);
                    todo = [];
                }
            };
            // 启动函数，防止同步时立刻被清掉了
            stopper.start = start;
            return stopper;
        },
        Waterfall = function (container, options) {
            var $container = $(container),
                self = this,
                _conWidth = $container.width(),
                _colNum,
                _adjuster, _adder, _colCount = [],
                tmpItem, areadyInfoToLoadMore = false,
                _items, resizeTimer, scrollTimer, $items, _colHeights = [],
                conf,
                defaultConf = $.fn.waterfall.defaultConf,
                getMinHeightIndex = function () {
                    var minIndex, minValue = Number.MAX_VALUE,
                        i;
                    for (i = 0; i <= _colNum; i++) {
                        if (_colHeights[i] === 0) {
                            minIndex = i;
                            break;
                        }
                        if (_colHeights[i] < minValue) {
                            minIndex = i;
                            minValue = _colHeights[i];
                        }
                    }
                    return minIndex;
                },
                getMaxHeightIndex = function () {
                    var i, maxIndex = -1,
                        maxValue = 0;
                    for (i = _colHeights.length; i >= 0; i--) {
                        if (_colHeights[i] > maxValue) {
                            maxIndex = i;
                            maxValue = _colHeights[i];
                        }
                    }
                    return maxIndex;
                },
                initParams = function () {
                    var i;
                    _colCount = [];
                    _colHeights = [];
                    _items = [];
                    for (i = 0; i < _colNum; i++) {
                        _items[i] = [];
                        _colCount[i] = 0;
                        _colHeights[i] = 0;
                    }
                },
                calculate = function () {
                    _conWidth = $container.width();
                    if (conf.colNum !== null) {
                        conf.colWidth = _conWidth / conf.colNum;
                        _colNum = conf.colNum;
                    } else {
                        _colNum = Math.floor(_conWidth / (conf.colWidth));
                        if (_colNum > conf.maxColNum) {
                            _colNum = conf.maxColNum;
                        }
                        if (_colNum < conf.minColNum) {
                            _colNum = conf.minColNum;
                        }
                    }
                },
                adjustItem = function (item) {
                    if (!conf.adjust) {
                        return;
                    }
                    var left, top, height, imgWidth, imgHeight, newImgHeight, newImgWidth, imgMarginL, imgMarginR, paddingR, paddingL, itemPL, itemPR, itemPT, itemPB, img, $item = $(item),
                        minHeightColIndex = getMinHeightIndex(); //get col of minimal height
                    img = $item.find('img');
                    itemPR = parseInt($item.css('padding-right'), 10);
                    itemPL = parseInt($item.css('padding-left'), 10);
                    itemPT = parseInt($item.css('padding-top'), 10);
                    itemPB = parseInt($item.css('padding-bottom'), 10);
                    if (img.length !== 0) {
                        imgMarginR = parseInt(img.css('margin-right'), 10);
                        imgMarginL = parseInt(img.css('margin-left'), 10);
                        paddingR = parseInt($item.css('padding-right'), 10);
                        paddingL = parseInt($item.css('padding-left'), 10);
                        newImgWidth = conf.colWidth - (paddingR + imgMarginR + imgMarginL + paddingL);
                        //修改图片尺寸
                        imgHeight = img.height();
                        imgWidth = img.width();
                        newImgHeight = imgHeight * newImgWidth / imgWidth;
                        img.width(newImgWidth);
                        img.height(newImgHeight);
                    }
                    $item.width(conf.colWidth - itemPL - itemPR);
                    left = minHeightColIndex * (conf.colWidth + conf.spaceHori);
                    top = _colHeights[minHeightColIndex] + conf.spaceVert;
                    height = Math.floor($item.height()) + itemPT + itemPB;
                    item.style.position = 'absolute';
                    item.style.left = left + 'px';
                    item.style.top = top + 'px';
                    $item.data('col', minHeightColIndex);
                    $item.data('row', _items[minHeightColIndex].length);
                    _items[minHeightColIndex].push({
                        col: minHeightColIndex,
                        row: _items[minHeightColIndex].length,
                        top: top,
                        left: left,
                        height: height,
                        value: item
                    });
                    // 更新高度数组
                    _colHeights[minHeightColIndex] += (height + conf.spaceVert);
                    $container.css('height', _colHeights[minHeightColIndex] + 'px');
                },

                addItem = function (item) {
                    $container.append(item);
                    adjustItem(item);
                    if (conf.addEffect) {
                        $(item).addClass(conf.addEffect);
                    }
                },
                getItems = function (col, row) {
                    if (col !== undefined) {
                        if (row !== undefined) {
                            return _items[col][row];
                        }
                        return _items[col];
                    }
                };
            //合并用户配置和默认配置
            conf = typeof options === 'string' ? defaultConf : $.extend({}, defaultConf, options || {});
            tmpItem = $container.find(conf.item).first();


            $.extend(this, {
                init: function () {
                    if (conf.adjust) {
                        $container.css('visibility', 'hidden');
                    }
                    this.adjust();
                    $container.css('visibility', 'visible');
                },
                /**
                 * 调整瀑布流
                 * @return {[type]} [description]
                 */
                adjust: function () {
                    if (!conf.adjust) {
                        return;
                    }
                    var oldWidth = tmpItem.width(),
                        nums, process = function (item) {
                            adjustItem(item);
                            nums--;
                            if (nums <= 0) {
                                _adjuster = 0;
                            }
                        };
                    calculate();
                    if (_colNum === _colHeights.length && conf.maxColNum !== null && oldWidth === _conWidth) {
                        return;
                    }
                    initParams();
                    if (self.isAdjusting()) {
                        _adjuster.stop();
                        _adjuster = null;
                    }
                    $items = $container.find(conf.item);
                    if ($items.length === 0) {
                        return;
                    }
                    nums = $items.length;
                    _adjuster = timedChunk($items.get(), process, self, function () {
                        var maxIndex = getMaxHeightIndex();
                        if ($container.css('visibility') !== 'visible') {
                            $container.css('visibility', 'visible');
                        }
                        $container.css('height', (_colHeights[maxIndex] + conf.spaceVert) + 'px');
                        $container.trigger('ui-waterfall-adjustComplete', []);
                    });
                    _adjuster.start();
                },
                /**
                 * 删除瀑布流块
                 * @param  {dom} itemDom [要删除的数据块dom]
                 */
                removeItem: function (itemDom) {
                    var $item = $(itemDom),
                        items, item, row = $item.data('row'),
                        col = $item.data('col');
                    items = getItems(col);
                    item = items[row];
                    self.adjustItem(itemDom, function () {
                        $item.remove();
                        return 0;
                    }, function () {
                        //调整剩下元素的坐标
                        var i;
                        items.splice(item.row, 1);
                        for (i = item.row; i < items.length; i++) {
                            items[i].row -= 1;
                            row = $(items[i].value).data('row', items[i].row);
                        }
                        $container.trigger('ui-waterfall-deleteComplete', []);
                    });
                },
                /**
                 * 调整单个瀑布流块
                 * @param  {DOM}   itemDom  需要调整的数据块DOM
                 * @param  {Function}   process  处理函数
                 * @param  {Function} callback 回调函数
                 */
                adjustItem: function (itemDom, process, callback) {
                    var i, originHeight, newHeight, diff, row, maxIndex, col, $item, items;
                    $item = $(itemDom);
                    row = $item.data('row');
                    col = $item.data('col');
                    items = getItems(col);
                    originHeight = Math.floor($item.height());
                    if (process) {
                        process.call(self);
                    }
                    newHeight = Math.floor($item.height());
                    diff = newHeight - originHeight;
                    //删除一整个元素，要把元素之间的间隔也删除
                    if (newHeight === 0) {
                        diff = diff - conf.spaceVert;
                    }
                    _colHeights[col] += diff;
                    for (i = row + 1; i < items.length; i++) {
                        itemDom = items[i].value;
                        itemDom.style.top = (parseInt(itemDom.style.top, 10) + diff) + 'px';
                    }
                    if (callback) {
                        callback.call(self);
                    }
                    maxIndex = getMaxHeightIndex();
                    //将容器调整到最大高度
                    $container.css('height', (_colHeights[maxIndex] + conf.spaceVert) + 'px');
                    $container.trigger('ui-waterfall-adjustComplete', []);
                },
                /**
                 * 添加瀑布流块
                 * @param {Array|DOM} items 瀑布流块
                 */
                addItems: function (items) {
                    var nums, process = function (item) {
                            addItem(item);
                            nums--;
                            if (nums <= 0) {
                                _adder = 0;
                            }
                        };
                    nums = items.length || 1; //items只有一个，且items是一个dom，不是数组
                    _adder = timedChunk(
                    items, process, self, function () {
                        $('#debug').append('<br>');
                        $container.css('height', (_colHeights[getMaxHeightIndex()] + conf.spaceVert) + 'px');
                        $container.trigger('ui-waterfall-addComplete', []);
                        areadyInfoToLoadMore = false;
                    });
                    _adder.start();
                },
                /**
                 * 是否在调整中
                 * @return {Boolean}
                 */
                isAdjusting: function () {
                    return !!_adjuster;
                },
                /**
                 * 是否添加中
                 * @return {Boolean}
                 */
                isAdding: function () {
                    return !!_adder;
                },
                /**
                 * 获得最高列的高度
                 * @return {Int}
                 */
                getMinHeight: function () {
                    var index;
                    if ((index = getMinHeightIndex()) >= 0) {
                        return _colHeights[index];
                    }
                    return -1;
                },
                /**
                 * 获取Container
                 * @return {Dom}
                 */
                getContainer: function () {
                    return $container;
                }
            }); //end of $.extend()
            $(window).resize(function () {
                var oldWidth = tmpItem.width();
                if (!resizeTimer) {
                    calculate();
                    if (_colNum === _colHeights.length && conf.maxColNum !== Number.MAX_VALUE && oldWidth === _conWidth) {
                        return;
                    }
                    resizeTimer = setTimeout(function () {
                        self.adjust();
                        console.log('调整');
                        resizeTimer = null;
                    }, 400);
                }
            });
            $(window).on('scroll', function () {
                if (areadyInfoToLoadMore) {
                    return;
                }
                var scrollTop = document.body.scrollTop,
                    top = $container.offset().top,
                    diff, minHeight = _colHeights[getMinHeightIndex()];
                if (self.isAdding()) {
                    console.log('adding,no need load');
                    return;
                }
                diff = scrollTop - top;
                if (diff + $(window).height() >= minHeight + 20) {
                    console.log('scroll');
                    if (!scrollTimer) {
                        scrollTimer = setTimeout(function () {
                            $container.trigger('ui-waterfall-needLoad');
                            scrollTimer = null;
                            areadyInfoToLoadMore = true;
                        }, 2);
                    }
                }
            });
            return this.init();
        }; //end of var waterfall = function () {}
    $.fn.waterfall = function (options) {
        var data, args = Array.prototype.slice.call(arguments);

        return this.each(function () {
            var $this = $(this);
            data = $this.data('waterfall');
            if (!data) {
                $this.data('waterfall', (data = new Waterfall(this, options)));
            }

            if (typeof options === 'string') {
                args.splice(0, 1);
                data[options].apply(data, args);
            }
        });
    };

    $.fn.waterfall.defaultConf = {
        minColNum: 0,
        //min column nums
        colWidth: 100,
        // column width
        colNum: null,
        //列数colNum与colWidth不可以同时配置
        maxColNum: Number.MAX_VALUE,
        // max column number
        item: 'li',
        adjust: true,
        spaceHori: 6,
        //space between each item in horizon
        spaceVert: 6,
        //space between each item in vertical
        addEffect: 0 // effect when add items
    };

    module.exports = Waterfall;
});
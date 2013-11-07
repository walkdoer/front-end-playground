

JavaScript包括以下几个部分：

   * ECMAScript，描述了该语言的语法和基本对象
   * 文档对象模型（DOM），描述处理网页内容的方法和接口

        + DOM是HTML和XML的API， 将页面和javascript连接在一起. 

   * 浏览器对象模型（BOM），描述与浏览器进行交互的方法和接口

        + 要在网页中使用javascript来访问浏览器，就必须通过BOM提供的对象。
        + window对象包含 location,navigator,screen,history

基本特点：

   * 是一种解释性脚本语言（代码不进行预编译）
   * 主要用来向HTML页面添加交互行为。
   * 可以直接嵌入HTML页面，但写成单独的js文件有利于结构和行为的分离。


================= JAVASCRIPT ==================







1.  数据类型


   * 简单数据类型： string , number , boolean, null , undefined
   * 其他的都是对象：包括Function, Array等等






2. 作用域

    * 函数作用域， 所以就有了在函数体顶部申明变量的一个建议

        var foo = function () {
            var a = 3,
                b = 5,
                bar = function () {
                    var b = 10, c = 10;
                    a += b + c;
                };
            bar();
        }

    * 作用域链   // ref http://www.cnblogs.com/ziyunfei/archive/2012/11/17/2768967.html

3.  闭包

     闭包的原理：内部函数可以访问外部函数作用域，外部函数无法访问内部函数作用域

     "特权方法"

     function Person(name) {
        var type = '动物';

        this.name = name;

        this.getType = function () {
            return type;
        }
        this.getName = function () {
            return name;
        };
        this.setName = function (_name) {
            name = _name;
        }
     };
     person = new Person('betman');
     person.getType();


     闭包的作用

       * 实现信息隐藏，即私有变量
       * 保存信息到内存中


        var name = "The Window";　　
        var object = {　　　　
            name: "My Object",
            getNameFunc: function() {　　　　　　
                return function() {　　　　　　　　
                    return this.name;　　　　　　
                };　　　　
            }　　
        };　　
        alert(object.getNameFunc()());

        ---------------------------------

        var name = "The Window";　　
        var object = {　　　　
            name: "My Object",
            getNameFunc: function() {　　　　　　
                var that = this;　　　　　　
                return function() {　　　　　　　　
                    return that.name;　　　　　　
                };　　　　
            }　　
        };　　
        alert(object.getNameFunc()());

    "存在问题：使用得不好可能内存泄露"

     //例子 一个DOM对象和一个JavaScript对象之间就存在着循环引用
        function outerFn(dom) {
            //Dom对象div 通过func属性 引用了内部函数innerFn
            dom.func = function innerFn() {
                //内部函数innerFn的作用域链上的活动对象的属性 'dom' 引用着Dom对象div
            }
        }
        var div = document.createElement("DIV");
        outerFn(div);



4. 回调

    JavaScript 事件驱动编程范式

        * 好处

            + "避免阻塞"

        * 坏处:

            + "代码难以维护",
            + "callback Hell"  //Ref(http://callbackhell.com/)

    //例子1： 最常见的事件绑定
        var testDom = document.getElementById('test');
        testDom.onclick = function () {
            //伦家被点击了
        };

        $('#test').on('click', function (event) {
            //伦家又被点击了
        })


    // 例子2 ajax异步请求

        ajax(param, function () {
            //请求成功的回调
        }, function () {
            //请求失败的回调
        })

    // 例子3 瞧瞧神马是CallBack Hell    Promise  Pushlish 

    var db = require("some-db-abstraction");
    function handleWithdrawal(req,res){  
        try {
            var amount=req.param("amount");
            db.select("* from sessions where session_id=?",req.param("session_id"),function(err,sessiondata) {
                if (err) throw err;
                db.select("* from accounts where user_id=?",sessiondata.user_ID),function(err,accountdata) {
                    if (err) throw err;
                        if (accountdata.balance < amount) throw new Error('insufficient funds');
                        db.execute("withdrawal(?,?),accountdata.ID,req.param(amount)", function(err,data) {
                            if (err) throw err;
                            res.write("withdrawal OK, amount: "+ req.param("amount"));
                            db.select("balance from accounts where account_id=?", accountdata.ID,function(err,balance) {
                                if (err) throw err;
                                res.end("your current balance is "  + balance.amount);
                            });
                        });
                    });
                });
        } catch(err) {
            res.end("Withdrawal error: "  + err.message);
        }
    }

5. 级联
    var a = getElement('myBoxDiv');
        getElement('myBoxDiv')
            .move(350, 150)
            .width(100)
            .height(100)
            .color('red')
            .border('10px outset')
            .padding('4px')
            .appendText("Please stand by")
            .on('mousedown', function (m) {
                this.startDrag(m, this.getNinth(m));
            }).
            .on('mousemove', 'drag')
            .on('mouseup', 'stopDrag')
            .later(2000, function (  ) {
                this
                    .color('yellow')
                    .setHTML("What hath God wraught?")
                    .slide(400, 40, 200, 200);
            })
            .tip("This box is resizeable");


7. 几个例子测试一下大家的理解

    //例子1

        function foo(x) {
            return x * 2;
        }
        var foo;
        console.debug(foo);

    //例子2

        function bar(x, y, a) {
            arguments[2] = 10;
            console.debug(a);
        }
        bar(1, 2, 3);

    //例子3

        function test() {
            var a,b,d,c;
            alert(this);



        }
        test.call(null);

    //例子4

        if (!("num" in window)) {
            var num = 1;
        }
        alert(num);

        var num;
        if (!("num" in window)) {
            num = 1;
        }
        alert(num);





在项目中使用 `console.log`来输出调试信息是一个很常见的手段，但是要上线的时候，要进行排查，并删除console.log的代码，这是一个很痛苦的过程。

所以，如果有一个debug模块，要上线的时候只需要关闭console即可，不需要删除调试信息，这样子，需要的时候还可以通过一些参数配置来进行开启，方便线上的调试。

参考
1. http://benalman.com/projects/javascript-debug-console-log/
2. http://elijahmanor.com/grunt-away-those-pesky-console-log-statements/
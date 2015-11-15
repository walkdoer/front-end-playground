看了这一篇博文之后 [If This Then Node.js](https://auth0.com/blog/2015/07/28/if-this-then-node-dot-js-extending-ifttt-with-webtask-dot-io/?ref=slicedham)， 按照这个教程写了一个demo。

其中利用了几个开源免费的互联网服务

- [webtask](https://webtask.io/)
- [mongolab](https://mongolab.com/)


使用

```

wt create --secret MONGO_URL=mongodb://<user>:<password>@ds053184.mongolab.com:53184/pocketifttt insert_hook.js

https://webtask.it.auth0.com/api/run/wt-zhangmhao-gmail_com-0/hello?webtask_no_cache=1

> wt create --secret MONGO_URL=mongodb://<user>:<password>@ds053184.mongolab.com:53184/pocketifttt list_view.js

https://webtask.it.auth0.com/api/run/wt-zhangmhao-gmail_com-0/list_view?webtask_no_cache=1

```

访问服务

```
curl https://webtask.it.auth0.com/api/run/wt-zhangmhao-gmail_com-0/hello?webtask_no_cache=1&title=hooly high&excerpt=niubility test
```

通过浏览器访问列表地址： https://webtask.it.auth0.com/api/run/wt-zhangmhao-gmail_com-0/list_view?webtask_no_cache=1

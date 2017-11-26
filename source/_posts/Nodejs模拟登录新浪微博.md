---
title: Nodejs模拟登录新浪微博
tags:
  - Nodejs
categories:
  - Nodejs
date: 2017-02-15 22:57:36
---

有时候我们需要对某个微博进行一些数据分析，例如绘制出微博转发网络图(参见{% post_link 使用D3.js绘制微博转发网络图 %}），为了获取这些数据，我们可以使用微博 API ，但是微博 API 会有很多限制，有时并不能获取到我们想要的数据，所以我便开发出了这个 Nodejs 模拟登录新浪微博模块，[源代码](https://github.com/ruansongsong/nodejs-weibo-login/)放在了Github上，欢迎 star 。
<!--more-->
## 浏览器登录微博过程分析
- 打开 chrome ，输入 weibo.com；
- 按 `F12` 打开控制台，选择 `Network` 并勾选 `Preserve log` ，目的是当 chrome 跳转网页时仍能保持上一个网页的网络记录.由于 `Network` 中有很多不相关的记录，可以点击 clear 圆形按钮清除记录；
- 输用户名和密码

### 网络记录分析
登录成功后我们可以看到很多网络记录，但是很多和登录过程并不相关，和登录相关的 URL 请求顺序如下：
```
https://login.sina.com.cn/sso/prelogin.php?entry=weibo&callback=sinaSSOController.preloginCallBack&su=MTg4MTMyOTg2Mzg%3D&rsakt=mod&checkpin=1&client=ssologin.js(v1.4.18)&_=1487157457960
http://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.18)
http://passport.weibo.com/wbsso/login?url=http%3A%2F%2Fweibo.com%2Fajaxlogin.php%3Fframelogin%3D1%26callback%3Dparent.sinaSSOController.feedBackUrlCallBack%26sudaref%3Dweibo.com&ticket=ST-MTc0NTYwMjYyNA==-1487157464-xd-ACD65572C42B046CE6CD3ADD3BE4EDCE-1&retcode=0
http://weibo.com/ajaxlogin.php?framelogin=1&callback=parent.sinaSSOController.feedBackUrlCallBack&sudaref=weibo.com
```
注：以上 URL 请求没有包括需要输入验证码情况，但是我写的登录模块包括了需要验证码登录的情况

下面我们就对以上请求的 URL 一一来分析
#### 登录前的数据请求
将此链接复制粘贴到浏览器中
```
https://login.sina.com.cn/sso/prelogin.php?entry=weibo&callback=sinaSSOController.preloginCallBack&su=MTg4MTMyOTg2Mzg%3D&rsakt=mod&checkpin=1&client=ssologin.js(v1.4.18)&_=1487157457960
```
我们可以发现返回的数据如下
```javascript
sinaSSOController.preloginCallBack(
    {
        retcode: 0, // 表示成功
        servertime: 1487158318, // 系统生产的时间戳，加密会用到
        pcid: "gz-d2a42925df36167af726eea773aca9c648cf", // 电脑id，验证码会用到
        nonce: "X6PF4I", // 随机生成的值，加密会用到
        pubkey: "EB2A38568661887FA180BDDB5CABD5F21C7BFD59C090CB2D245A87AC253062882729293E5506350508E7F9AA3BB77F4333231490F915F6D63C55FE2F08A49B353F444AD3993CACC02DB784ABBB8E42A9B1BBFFFB38BE18D78E87A0E41B9B8F73A928EE0CCEE1F6739884B9777E4FE9E88A1BBE495927AC4A799B3181D6442443", // 公钥，加密会用到
        rsakv: "1330428213", // POST 登录数据会用到
        is_openlock: 0,
        lm: 1,
        smsurl: "https://login.sina.com.cn/sso/msglogin?entry=weibo&mobile=18813298638&s=4bd6540d4525782db01f0e90f17440d9",
        showpin: 0, // 验证码，若为1则表示需要验证码
        exectime: 13
    }
)
```
以上这些数据是为了后面登录做准备的。写了注释的那些数据会用到，其他数据登录过程不会用到。
#### 登录
获取到登录前的一些数据后，我们就可以根据这些数据构建好需要 POST 的数据，然后向下面 URL 发送请求进行登录
```
http://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.18)

```
该请求返回的数据如下
```html
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=GBK" />
<title>����ͨ��֤</title>


<script charset="utf-8" src="http://i.sso.sina.com.cn/js/ssologin.js"></script>
</head>
<body>
���ڵ�¼ ...
<script>
try{
    sinaSSOController.setCrossDomainUrlList(
        {"retcode":0,
        "arrURL":["http:\/\/passport.97973.com\/sso\/crossdomain?action=login","http:\/\/passport.weibo.cn\/sso\/crossdomain?action=login"
]});}
                catch(e){
                        var msg = e.message;
                        var img = new Image();
                        var type = 1;
                        img.src = 'http://login.sina.com.cn/sso/debuglog?msg=' + msg +'&type=' + type;
                }try{sinaSSOController.crossDomainAction('login',function(){location.replace('http://passport.weibo.com/wbsso/login?url=http%3A%2F%2Fweibo.com%2Fajaxlogin.php%3Fframelogin
%3D1%26callback%3Dparent.sinaSSOController.feedBackUrlCallBack&ticket=ST-MTc0NTYwMjYyNA==-1487160249-tc-966B317EEE53E7796EBB0433F1DFA107-1&retcode=0');});}
                catch(e){
                        var msg = e.message;
                        var img = new Image();
                        var type = 2;
                        img.src = 'http://login.sina.com.cn/sso/debuglog?msg=' + msg +'&type=' + type;
                }
</script>
</body>
</html>
```
其中最重要的是这段代码
```javascript
location.replace('http://passport.weibo.com/wbsso/login?url=http%3A%2F%2Fweibo.com%2Fajaxlogin.php%3Fframelogin
%3D1%26callback%3Dparent.sinaSSOController.feedBackUrlCallBack&ticket=ST-MTc0NTYwMjYyNA==-1487160249-tc-966B317EEE53E7796EBB0433F1DFA107-1&retcode=0')
```
`location.replace()` 函数中的 URL 便是登录过程中第3个 URL ，并且第三个 URL 包含了第4个 URL，当浏览器进入第 3 个 URL 会自动跳转到第 4 个 URL，然后 cookie 就被保存到本地了，以后对微博的任何请求都会带上这个 cookie ，有了这个 cookie ，我们就可以尽情的获取数据了。
```
http://passport.weibo.com/wbsso/login?url=http%3A%2F%2Fweibo.com%2Fajaxlogin.php%3Fframelogin%3D1%26callback%3Dparent.sinaSSOController.feedBackUrlCallBack%26sudaref%3Dweibo.com&ticket=ST-MTc0NTYwMjYyNA==-1487157464-xd-ACD65572C42B046CE6CD3ADD3BE4EDCE-1&retcode=0
```
分析完浏览器登录的整个流程后，下面我们就可以用 Nodejs 来进行登录了

## Nodejs 登录
这里讲主要的代码结构，完整代码在[源代码](https://github.com/ruansongsong/nodejs-weibo-login/)中，有详细的注释。在代码中采用了 ES6 语法，并且使用了 Promise + async/await 来解决登录过程中的异步问题。发现 async/await 写异步代码真的好爽啊！

### 登录主要过程

1. 登录微博，保存获取到的cookie
2. 每次访问微博都带上cookie

### 源代码目录结构说明
```
- nodejs-weibo-login
--- /lib
------ encode_post_data.js
------ sso_encoder.js
------ weibo_login.js
--- cookie.txt
--- index.js
--- pinCode.png
```
- `weibo_login.js` 模块：微博登录代码，实现了微博登录流程的各个步骤
- `encode_post_data.js` 模块： 对用户名和密码编码和加密，构建出登录的 POST 的数据
- `sso_encoder.js` 模块：加密的一些函数，提取自http://login.sina.com.cn/js/sso/ssologin.js,
- `index.js` : 主文件，运行代码`node --harmony-async-await index.js`，注意需要 nodejs 版本大于 7.0
- `cookie.txt` ：登录成功后保存的 cookie 文件
- `pinCode.png` ：验证码图片，如果需要验证码会将图片保存下来然后再输入验证码

使用方法请参照[源代码](https://github.com/ruansongsong/nodejs-weibo-login/)

## 后续
登录成功后我们就可以获取自己想要的数据了，然后再对获取到的数据进行分析，分析例子可以参照我的博文{% post_link 使用D3.js绘制微博转发网络图 %}

## 心得
用 Nodejs 写这个模块时，遇到过一些困难，比如分析整个登录流程时，需要判断出登录的哪些网络记录有用，哪些没用，同时涉及到加密等问题，看起来博客写得比较简单，但是实际分析还是比较难的，同时也解决了登录时遇到验证码的问题。最开始我使用的是回调函数和 Promise 来写代码，但是在写的过程中发现好难写，要考虑到各种异步情况，而且可读性也非常差，最终还是使用了 Promise + async/await 来解决遇到的这些问题。第一次写博客，欢迎大家提出一些意见和建议 ^_^ 。
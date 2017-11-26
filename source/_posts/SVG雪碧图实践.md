---
title: SVG雪碧图实践
date: 2017-02-16 17:26:16
tags:
- gulp
- SVG
---
在平常的网页开发中，我们经常会遇到很多小图标，为了减少 HTTP 请求量，提高页面加载速度，我们通常会把这些小图标整合到一个图片文件中，然后通过 CSS 的背景定位来显示相应的小图标。但是在遇到高清屏时，图片显示可能会失真，所以就不得不准备不同规格的图片。有些情况我们也可使用 icon font 但是它也有一些缺点，也并不是一个很好的解决方案。而如今随着 SVG 的浏览器支持程度越来越好 ([SVG支持情况](http://caniuse.com/#search=SVG))，SVG 可以算得上是很好的解决方案了。下面就来说说如何实现 SVG 雪碧图。
<!--more-->
## SVG 的优点
SVG 是基于矢量的图形，放大缩小它都不会失真，而且压缩后的 SVG 文件大小相比于图片文件来说更小，相信未来的趋势是 SVG ！

## 工具
`gulp` ： 将多个 SVG 图标文件合成为一个文件

其中需要下载的模块为 `gulp` 、`gulp-svg-sprite`， `svg-sprite`

## 模块安装
```bash
npm install gulp --save-dev
npm install gulp-svg-sprite --save-dev
npm install svg-sprite --save-dev
```

## gulpfile.js 文件配置
新建 `gulpfile.js` 文件，配置如下：
```javascript
var gulp = require('gulp'),
    svgSprite = require('gulp-svg-sprite');
gulp.task('sprite', function() {
    gulp.src('./src/svg/*.svg') // src/svg/目录下的所有svg文件
        .pipe(svgSprite({
            mode: {
                symbol: true // 参数必须有
            }
        }))
        .pipe(gulp.dest('./dist/svg')) // 输出
})
```
`gulp-svg-sprite` 模块文档请移步 [gulp-svg-sprite 文档](https://github.com/jkphl/gulp-svg-sprite)，上面有很多配置选项，比如批量改变 SVG 尺寸等等。

## 运行
```bash
gulp sprite
```
这样就生成了合并并且压缩后的 SVG 文件，下面就可以运用到网页上了

### 加载 SVG 文件
我们可以使用内联的方法将 SVG 代码放入 HTML 文件中，并设置其 `display: none` , 也可使用外链形式，但是外链形式不支持 IE ，所以最好的方法是使用 AJAX 来获取 SVG 文件，代码如下：
```html
<script>
    // svg 文件的位置
    var svgUrl = "./images/svg.svg";
    if (window.addEventListener) {
        var div = document.createElement("div"); // 创建div
        div.style.display = "none"; // 不让其显示
        document.body.appendChild(div);
        // 载入SVG，使用了 localStorage 来保存svg文件
        if (localStorage.getItem(svgUrl)) {
            // 本地获取，减少请求
            div.innerHTML = localStorage.getItem(svgUrl);
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("get", svgUrl);
            xhr.onload = function() {
                if (xhr.responseText) {
                    div.innerHTML = xhr.responseText;
                    // 保存到localStorage
                    localStorage.setItem(svgUrl, xhr.responseText);
                }
            };
            xhr.send(null);
        }
    }
</script>
```
## 运用 SVG
我们是如何显示不同的图标呢，答案是生成后的 SVG 文件中有很多 `<symbol>` 标签，每个标签就代表一个图标文件，其中 id 属性就是我们小图标的文件名，然后我们可以在 HTML 中用`<symbol>` 标签的 id 值引用不同的图标，如下所示

```html
<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#facebook"></use></svg>
<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#twitter"></use></svg>

``` 



## 代码包及示例
截图
![分享](/images/svg/demo_1.png)

[示例](https://ruansongsong.github.io/demo/svg-sprite/)

[代码包](https://ruansongsong.github.io/demo/svg-sprite/demo.rar)

## 参考博客
http://www.zhangxinxu.com/wordpress/2014/07/introduce-svg-sprite-technology/
---
title: flex布局总结
date: 2017-02-19 23:49:27
visible: hide
tags:
- notes
- css
- flex
categories: 笔记 # flex布局总结
---
Flex是Flexible Box的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。
<!--more-->
## flex 容器
```css
.box {
  display: flex; // 或者 inline-flex
}
// 注：有些要加前缀，用 autoprefixer 即可
```
设为 flex 布局后，子元素的 float、clear、和 vertical-align 属性都将失效

### 容器属性
- flex-direction: 属性决定主轴的方向（即项目的排列方向）
- flex-wrap: 默认情况下，项目都排在一条线（又称"轴线"）上。flex-wrap属性定义，如果一条轴线排不下，如何换行。
- flex-flow: flex-flow属性是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。
- justify-content：属性定义了项目在主轴上的对齐方式
- align-items: 定义项目在交叉轴生如何对其，上下轴
- align-content：多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

### 项目属性
- order：属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。
- flex-grow：属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
- flex-shrink：属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
- flex-basis：属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
- flex：flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
- align-self：align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

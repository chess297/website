---
title: HTML 基础知识
sidebar_position: 1
---

## 1. HTML 简介

HTML（超文本标记语言，HyperText Markup Language）是创建网页的标准标记语言，描述了网页的结构和内容。

### 什么是 HTML？

HTML 是一种通过标签来描述网页内容的语言，浏览器通过解析这些标签将内容呈现给用户。HTML 文档包含一系列的元素，这些元素告诉浏览器如何显示内容。

### HTML 的历史和发展

- 1991 年：Tim Berners-Lee 创建了 HTML
- 1995 年：HTML 2.0 发布
- 1997 年：HTML 3.2 发布
- 1999 年：HTML 4.01 发布
- 2000 年：XHTML 1.0 发布（结合 XML 语法的 HTML）
- 2014 年：HTML5 成为正式推荐标准
- 现在：HTML 持续演进，不断添加新功能和规范

### HTML5 的新特性

HTML5 引入了许多新的元素和功能，使得网页开发更加强大和灵活：

- 语义化标签：如 `<header>`, `<footer>`, `<article>`, `<section>` 等
- 多媒体标签：如 `<audio>`, `<video>` 等
- 图形支持：`<canvas>` 和 `<svg>` 元素
- 本地存储：localStorage 和 sessionStorage
- 表单增强：新的 input 类型和属性
- 地理定位 API：获取用户位置信息
- 拖放 API：简化拖放功能实现
- WebWorkers：在后台运行脚本
- WebSockets：实现客户端和服务器之间的双向通信

## 2. HTML 基本结构

### HTML 文档结构

一个基本的 HTML 文档包括以下结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>网页标题</title>
  </head>
  <body>
    <!-- 网页内容 -->
    <h1>这是一个标题</h1>
    <p>这是一个段落。</p>
  </body>
</html>
```

- `<!DOCTYPE html>`：声明文档类型
- `<html>`：根元素，包含整个 HTML 文档
- `<head>`：包含元数据、引用外部资源等，不在页面上显示
- `<meta>`：提供网页的元信息
- `<title>`：定义网页的标题
- `<body>`：包含页面上显示的所有内容

### 元素和标签

HTML 元素由开始标签、内容和结束标签组成：

```html
<tagname>内容</tagname>
```

例如：

- `<h1>这是一个标题</h1>`
- `<p>这是一个段落</p>`

某些元素是空元素，只有开始标签：

```html
<br />
<img src="image.jpg" alt="图片描述" />
<input type="text" />
```

在 HTML5 中，空元素不需要关闭，但在 XHTML 中需要：`<br />`, `<img src="image.jpg" alt="图片描述" />`

### 属性

HTML 元素可以有属性，提供关于元素的额外信息：

```html
<element attribute="value">内容</element>
```

常见的属性：

- `id`：定义元素的唯一标识
- `class`：定义元素的类名，用于 CSS 样式和 JavaScript
- `style`：定义元素的内联 CSS 样式
- `title`：定义元素的额外信息，通常显示为工具提示
- `src`：定义媒体元素的源 URL
- `href`：定义链接的目标 URL

## 3. 文本和段落标签

### 标题标签

HTML 提供六级标题，从 `<h1>` 到 `<h6>`：

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

### 段落和格式化

```html
<!-- 段落 -->
<p>这是一个段落</p>

<!-- 换行 -->
<p>第一行<br />第二行</p>

<!-- 水平线 -->
<hr />

<!-- 预格式化文本 -->
<pre>
    这是预格式化文本
    它会保留空格和换行
</pre>

<!-- 文本格式化 -->
<p><b>粗体文本</b></p>
<p><strong>重要文本</strong></p>
<p><i>斜体文本</i></p>
<p><em>强调文本</em></p>
<p><mark>标记文本</mark></p>
<p><small>小号文本</small></p>
<p><del>删除文本</del></p>
<p><ins>插入文本</ins></p>
<p><sub>下标</sub> 和 <sup>上标</sup></p>
```

### 引用和注释

```html
<!-- 块引用 -->
<blockquote cite="https://www.example.com">这是一段长引用</blockquote>

<!-- 短引用 -->
<p><q>这是一段短引用</q></p>

<!-- 缩写 -->
<p><abbr title="超文本标记语言">HTML</abbr></p>

<!-- 地址 -->
<address>
  作者信息<br />
  公司名称<br />
  电子邮件
</address>

<!-- 作品引用 -->
<p><cite>HTML 教程</cite> 作者张三</p>

<!-- HTML 注释 -->
<!-- 这是一个注释，不会在浏览器中显示 -->
```

## 4. 链接和锚点

### 基本链接

```html
<!-- 基本链接 -->
<a href="https://www.example.com">访问示例网站</a>

<!-- 新窗口打开链接 -->
<a href="https://www.example.com" target="_blank">在新窗口打开</a>

<!-- 链接到页面内的 ID -->
<a href="#section1">跳转到第一部分</a>

<!-- 目标 ID -->
<h2 id="section1">第一部分</h2>
```

### 链接属性

- `href`：指定链接的目标 URL
- `target`：指定链接文档的打开位置
  - `_blank`：新窗口或标签页
  - `_self`：当前框架或窗口（默认）
  - `_parent`：父框架
  - `_top`：整个窗口
- `download`：指定下载的文件名
- `rel`：指定链接与当前文档的关系
- `title`：提供链接的额外信息

### 页面内跳转

```html
<!-- 创建目录 -->
<h2>目录</h2>
<ul>
  <li><a href="#section1">第一部分</a></li>
  <li><a href="#section2">第二部分</a></li>
  <li><a href="#section3">第三部分</a></li>
</ul>

<!-- 目标部分 -->
<h2 id="section1">第一部分</h2>
<p>内容...</p>

<h2 id="section2">第二部分</h2>
<p>内容...</p>

<h2 id="section3">第三部分</h2>
<p>内容...</p>

<!-- 返回顶部链接 -->
<a href="#">返回顶部</a>
```

## 5. 图像和多媒体

### 图像标签

```html
<!-- 基本图像 -->
<img src="image.jpg" alt="图片描述" />

<!-- 设置宽度和高度 -->
<img src="image.jpg" alt="图片描述" width="500" height="300" />

<!-- 响应式图像 -->
<img src="image.jpg" alt="图片描述" style="max-width:100%;height:auto;" />
```

### 图像属性

- `src`：图像的源 URL
- `alt`：当图像无法显示时的替代文本（重要的可访问性属性）
- `width` 和 `height`：图像的宽度和高度（像素）
- `title`：鼠标悬停时显示的提示文本
- `loading="lazy"`：延迟加载图像，提升性能

### 响应式图像

```html
<!-- 根据不同屏幕大小提供不同分辨率的图像 -->
<picture>
  <source media="(min-width: 1200px)" srcset="image-large.jpg" />
  <source media="(min-width: 768px)" srcset="image-medium.jpg" />
  <img src="image-small.jpg" alt="图片描述" />
</picture>

<!-- 根据不同的设备像素比提供不同的图像 -->
<img
  src="image-1x.jpg"
  srcset="image-1x.jpg 1x, image-2x.jpg 2x, image-3x.jpg 3x"
  alt="图片描述"
/>
```

### 视频和音频

```html
<!-- 视频 -->
<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4" />
  <source src="movie.ogg" type="video/ogg" />
  您的浏览器不支持视频标签。
</video>

<!-- 音频 -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg" />
  <source src="audio.ogg" type="audio/ogg" />
  您的浏览器不支持音频标签。
</audio>
```

### 视频和音频属性

- `controls`：显示控制面板
- `autoplay`：自动播放
- `loop`：循环播放
- `muted`：静音
- `preload`：预加载方式（auto/metadata/none）
- `poster`：视频封面图像（仅视频）

## 6. 列表

### 无序列表

```html
<ul>
  <li>项目一</li>
  <li>项目二</li>
  <li>项目三</li>
</ul>
```

### 有序列表

```html
<ol>
  <li>第一步</li>
  <li>第二步</li>
  <li>第三步</li>
</ol>

<!-- 更改起始编号 -->
<ol start="5">
  <li>第五项</li>
  <li>第六项</li>
</ol>

<!-- 更改编号类型 -->
<ol type="A">
  <li>项目 A</li>
  <li>项目 B</li>
</ol>
```

### 定义列表

```html
<dl>
  <dt>HTML</dt>
  <dd>超文本标记语言，用于创建网页。</dd>

  <dt>CSS</dt>
  <dd>层叠样式表，用于设计网页的样式。</dd>

  <dt>JavaScript</dt>
  <dd>一种脚本语言，用于创建动态网页内容。</dd>
</dl>
```

### 嵌套列表

```html
<ul>
  <li>
    水果
    <ul>
      <li>苹果</li>
      <li>香蕉</li>
      <li>橙子</li>
    </ul>
  </li>
  <li>
    蔬菜
    <ul>
      <li>胡萝卜</li>
      <li>土豆</li>
      <li>西红柿</li>
    </ul>
  </li>
</ul>
```

## 7. 表格

### 基本表格

```html
<table border="1">
  <caption>
    员工信息表
  </caption>
  <tr>
    <th>姓名</th>
    <th>部门</th>
    <th>薪资</th>
  </tr>
  <tr>
    <td>张三</td>
    <td>市场部</td>
    <td>5000</td>
  </tr>
  <tr>
    <td>李四</td>
    <td>技术部</td>
    <td>6000</td>
  </tr>
</table>
```

### 表格结构

```html
<table border="1">
  <caption>
    季度销售数据
  </caption>

  <!-- 表头 -->
  <thead>
    <tr>
      <th>产品</th>
      <th>一季度</th>
      <th>二季度</th>
      <th>三季度</th>
      <th>四季度</th>
    </tr>
  </thead>

  <!-- 表格主体 -->
  <tbody>
    <tr>
      <td>产品 A</td>
      <td>100</td>
      <td>150</td>
      <td>200</td>
      <td>180</td>
    </tr>
    <tr>
      <td>产品 B</td>
      <td>80</td>
      <td>120</td>
      <td>140</td>
      <td>160</td>
    </tr>
  </tbody>

  <!-- 表格脚注 -->
  <tfoot>
    <tr>
      <td>总计</td>
      <td>180</td>
      <td>270</td>
      <td>340</td>
      <td>340</td>
    </tr>
  </tfoot>
</table>
```

### 单元格合并

```html
<table border="1">
  <tr>
    <th>姓名</th>
    <th colspan="2">联系方式</th>
  </tr>
  <tr>
    <td>张三</td>
    <td>电话：123456</td>
    <td>邮箱：zhangsan@example.com</td>
  </tr>
  <tr>
    <td rowspan="2">李四</td>
    <td>电话：654321</td>
    <td>个人邮箱：lisi@example.com</td>
  </tr>
  <tr>
    <td>电话：111111</td>
    <td>工作邮箱：work@example.com</td>
  </tr>
</table>
```

## 8. 表单

### 基本表单

```html
<form action="/submit" method="post">
  <label for="username">用户名：</label>
  <input type="text" id="username" name="username" /><br /><br />

  <label for="password">密码：</label>
  <input type="password" id="password" name="password" /><br /><br />

  <input type="submit" value="提交" />
  <input type="reset" value="重置" />
</form>
```

### 输入元素类型

```html
<!-- 文本输入 -->
<input type="text" name="username" placeholder="请输入用户名" />

<!-- 密码输入 -->
<input type="password" name="password" />

<!-- 单选按钮 -->
<input type="radio" id="male" name="gender" value="male" />
<label for="male">男</label>
<input type="radio" id="female" name="gender" value="female" />
<label for="female">女</label>

<!-- 复选框 -->
<input type="checkbox" id="bike" name="vehicle" value="Bike" />
<label for="bike">自行车</label>
<input type="checkbox" id="car" name="vehicle" value="Car" />
<label for="car">汽车</label>

<!-- 下拉列表 -->
<select name="city">
  <option value="beijing">北京</option>
  <option value="shanghai">上海</option>
  <option value="guangzhou">广州</option>
  <option value="shenzhen">深圳</option>
</select>

<!-- 多行文本 -->
<textarea name="message" rows="4" cols="50">请输入内容...</textarea>

<!-- 文件上传 -->
<input type="file" name="fileupload" />

<!-- 隐藏字段 -->
<input type="hidden" name="secretKey" value="123456" />

<!-- 按钮 -->
<input type="button" value="点击按钮" />
<button type="button">点击按钮</button>
```

### HTML5 新增输入类型

```html
<!-- 电子邮件 -->
<input type="email" name="email" placeholder="请输入电子邮件" />

<!-- URL -->
<input type="url" name="website" placeholder="请输入网址" />

<!-- 数字 -->
<input type="number" name="quantity" min="1" max="5" />

<!-- 范围滑块 -->
<input type="range" name="points" min="0" max="10" />

<!-- 日期 -->
<input type="date" name="birthday" />

<!-- 时间 -->
<input type="time" name="meeting-time" />

<!-- 日期时间 -->
<input type="datetime-local" name="meeting" />

<!-- 月份 -->
<input type="month" name="month" />

<!-- 周 -->
<input type="week" name="week" />

<!-- 颜色选择器 -->
<input type="color" name="favcolor" />

<!-- 搜索框 -->
<input type="search" name="search" placeholder="搜索..." />

<!-- 电话号码 -->
<input type="tel" name="phone" pattern="[0-9]{11}" placeholder="请输入手机号" />
```

### 表单属性

- `action`：表单提交的 URL
- `method`：提交方法（get/post）
- `target`：提交后在哪里显示响应
- `enctype`：提交的编码类型
- `autocomplete`：表单自动完成
- `novalidate`：禁用表单验证

### 输入限制和验证

```html
<!-- 必填字段 -->
<input type="text" name="username" required />

<!-- 最小/最大长度 -->
<input type="text" name="username" minlength="3" maxlength="12" />

<!-- 模式匹配（正则表达式） -->
<input type="text" name="username" pattern="[A-Za-z]{3,}" />

<!-- 数字范围 -->
<input type="number" name="age" min="18" max="100" />

<!-- 占位符文本 -->
<input type="text" name="username" placeholder="请输入用户名" />

<!-- 禁用字段 -->
<input type="text" name="username" disabled />

<!-- 只读字段 -->
<input type="text" name="username" readonly value="当前用户" />
```

## 9. 语义化标签

### 页面结构标签

```html
<header>
  <h1>网站标题</h1>
  <nav>
    <ul>
      <li><a href="#">首页</a></li>
      <li><a href="#">关于</a></li>
      <li><a href="#">联系</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <header>
      <h2>文章标题</h2>
      <p>发布日期：2025年4月24日</p>
    </header>

    <section>
      <h3>第一部分</h3>
      <p>内容...</p>
    </section>

    <section>
      <h3>第二部分</h3>
      <p>内容...</p>
    </section>

    <footer>
      <p>作者：张三</p>
    </footer>
  </article>

  <aside>
    <h3>相关文章</h3>
    <ul>
      <li><a href="#">相关文章一</a></li>
      <li><a href="#">相关文章二</a></li>
    </ul>
  </aside>
</main>

<footer>
  <p>&copy; 2025 我的网站. 保留所有权利.</p>
</footer>
```

### 语义标签的优势

1. **可访问性**：帮助屏幕阅读器和辅助技术理解网页结构
2. **SEO**：搜索引擎更容易理解页面内容和结构
3. **代码可维护性**：代码结构更清晰，易于维护
4. **未来兼容**：更好地适应新的浏览器功能和设备

## 10. HTML 实体和特殊字符

HTML 实体用于显示保留字符（如 `<`, `>`, `&` 等）和特殊字符：

```html
<!-- 保留字符 -->
&lt; 表示 < （小于符号） &gt; 表示 > （大于符号） &amp; 表示 & （和号） &quot;
表示 " （双引号） &apos; 表示 ' （单引号）

<!-- 特殊字符 -->
&copy; 表示 © （版权符号） &reg; 表示 ® （注册商标） &trade; 表示 ™ （商标）
&euro; 表示 € （欧元） &pound; 表示 £ （英镑） &yen; 表示 ¥ （日元/人民币）
&cent; 表示 ¢ （美分） &deg; 表示 ° （度） &plusmn; 表示 ± （正负号） &times;
表示 × （乘号） &divide; 表示 ÷ （除号） &frac14; 表示 ¼ （四分之一） &frac12;
表示 ½ （二分之一） &frac34; 表示 ¾ （四分之三） &nbsp; 表示不换行空格
```

## 总结

HTML 基础知识涵盖了构建网页所需的核心概念和元素。随着网络技术的发展，HTML5 提供了更丰富的标签和功能，使得开发者可以创建更加语义化、交互性强的网页。掌握这些基础知识是成为一名前端开发者的第一步。

要进一步提升 HTML 技能，可以：

1. 学习 CSS 来美化网页
2. 学习 JavaScript 来添加交互功能
3. 研究更高级的 HTML5 API 和特性
4. 了解响应式设计原则和可访问性最佳实践

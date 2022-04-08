<br>
<h2 align="center">uni-app 课程表组件</h2>
<br>
<p align='center'>
  <img src="images/light.png" height="350"></img>
  <img src="images/dark.png" height="350"></img>
</p>

<br>

## 特性
- 🗓  可视化周选择、课程删除/置顶、课程详情卡片

- ⚡️ [Vue 3](https://github.com/vuejs/vue-next), [Vite 2](https://github.com/vitejs/vite), [pnpm](https://pnpm.js.org/), [ESBuild](https://github.com/evanw/esbuild) - 就是快！

- 🍍 [使用 Pinia 的状态管理](https://pinia.esm.dev/)

- 🎨 [UnoCSS](https://github.com/unocss/unocss) - 高性能且极具灵活性的即时原子化 CSS 引擎

- 😃 [各种图标集为你所用](https://github.com/antfu/unocss/tree/main/packages/preset-icons)

- 🔥 使用 [新的 `<script setup>` 语法](https://github.com/vuejs/rfcs/pull/227)

- 📥 [API 自动加载](https://github.com/antfu/unplugin-auto-import) - 直接使用 Composition API 无需引入

- 🦾 TypeScript 的类型检查

<br>

## 预配置

### UI 框架

- [UnoCSS](https://github.com/antfu/unocss) - 高性能且极具灵活性的即时原子化 CSS 引擎

### Icons

- [Iconify](https://iconify.design) - 使用任意的图标集，浏览：[🔍Icônes](https://icones.netlify.app/)
- [UnoCSS 的纯 CSS 图标方案](https://github.com/antfu/unocss/tree/main/packages/preset-icons)

### 插件

- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - 直接使用 Composition API 等，无需导入
- [`vite-plugin-unocss-to-uni`](https://github.com/zguolee/vite-plugin-unocss-to-uni) - UnoCSS 到 UniApp 的转换器

<br>


## 使用方法

[uni-app 项目支持 vue 3.0 介绍，及升级指南](https://ask.dcloud.net.cn/article/37834)

### 课表数据说明

```javascript
[
  // 第一周课表
  [
    // 周一课表
    [
      // 节次 1-2 课表
      [
        // 课程 1
        {课程1},
        // 冲突课程 2
        {课程2}
      ],
      // 节次 3-4 课表
      [
        {课程1}
      ],
      // 节次 5-6 课表
      [],
      ...
    ],
    // 周二课表
    [],
    // 周三课表
    [],
    ...
  ],
  // 第二周课表
  [],
  // 第三周课表
  [],
  ...
]
```

<br>

## 更新日志

### Version 2.0.0

1. F 升级到 Vue 3

2. F 深色主题

### Version 1.x

[ColorTimetable Vue2版本](https://github.com/zguolee/ColorTimetable/tree/vue2)


<br>

## 开源许可

本项目使用开源许可证 License MIT ，代码开源仅供学习交流。

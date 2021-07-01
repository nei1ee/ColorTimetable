# uni-app 课程表组件

## 界面预览

![](https://cdn.jsdelivr.net/gh/zguolee/cloud_images/timetable-color.jpg)![](https://cdn.jsdelivr.net/gh/zguolee/cloud_images/timetable-feat.jpg)

## 目录结构

```
.
├── App.vue
├── LICENSE
├── README.md
├── components
│   └── timetable
│       ├── icon.css
│       └── timetableBody.vue
├── main.js
├── manifest.json
├── pages
│   └── index
│       └── index.vue
├── pages.json
├── static
│   ├── guest.js
│   └── logo.png
├── store
│   ├── index.js
│   └── modules
│       └── timetable.js
└── uni.scss
```

## 课表数据说明

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

## 使用方法

>  `static` 目录下 `guest.js`为测试课表文件
1. 将 `components` 目录下 `timetable`文件夹拷贝至你所在的项目中
2. 将 `store` 目录下 `modules` 文件夹拷贝至相应文件夹中
3. 修改 `store.js` 文件添加以下代码

```js
import Vue from 'vue'
import Vuex from 'vuex'

import timetable from '@/store/modules/timetable'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    timetable
  }
})

export default store
```

4. 修改 `main.js` 文件添加以下代码

```js
import Vue from 'vue'
import App from './App'
import store from './store'
...
Vue.prototype.$store = store
...
const app = new Vue({
  store,
  ...App,
})
app.$mount()
```

5. 引入组件，相关代码如下：

```vue
<template>
  <view>
    <!-- 课表主体 -->
    <timetable-body></timetable-body>
    ...
  </view>
</template>

<script>
  import {
    mapState,
    mapGetters
  } from 'vuex'
  import {
    timetableData
  } from '../../static/guest.js'
  // 课表主体
  import timetableBody from '../../components/timetable/timetableBody.vue'
  export default {
    data() {
      return {}
    },
    components: {
      timetableBody
    },
    onLoad() {
      // 设置开学时间
      this.$store.commit('timetable/setStartDay', '2021/03/01 00:00:00')
      // 初始化课表数据
      this.$store.commit('timetable/setTimetableList', timetableData)
    },
    computed: {
      ...mapState('timetable', [
        'showTimetableWeek',
        'bgImage'
      ]),
      ...mapGetters('timetable', [
        'originalWeekIndex',
        'currentWeekIndex',
        'weekWeekIndex'
      ])
    },
    watch: {
      currentWeekIndex(newVal, oldVal) {
        uni.setNavigationBarTitle({
          title: `第${newVal + 1}周课表`
        })
      }
    }
  }
</script>
```

## 开源许可

本项目使用开源许可证 License GPLv3 ，代码开源仅供学习交流，禁止私用、商用，违者必究。

## 更新日志

#### Version 1.1.0

1. F 使用 vuex
2. U 课表色卡
3. U 冲突课程显示方式
4. A 课程详情卡片
5. A 删除课程、课程置顶

#### Version 1.0.1

1. A 周课表背景
2. U 更换周课表切换配色
3. U 优化体验

#### Version 1.0.0

1. A 课程切换
2. A 冲突课程折角
3. A 周课表色卡切换



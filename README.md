## uni-app 课程表组件

### 界面预览

![](https://cdn.jsdelivr.net/gh/zguolee/cloud_images/timetable-image.jpeg)

### 已实现

- 仿超级课程表周数切换
- 课程冲突显示
- 周课表色卡切换

### 目录结构

```
timetable
├─.gitattributes
├─.gitignore
├─App.vue
├─README.md
├─main.js
├─manifest.json
├─pages.json
├─uni.scss
├─utils
|   └timeUtils.js
├─static
|   ├─guest.js
|   └logo.png
├─pages
|   ├─index
|   |   └index.vue
├─components
|     ├─timetable
|     |     ├─courseItem.vue
|     |     ├─timetableBody.vue
|     |     └timetableWeek.vue
```

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

### 使用方法

>  `static` 目录下 `guest.js`为测试课表文件
1. 将 `components` 目录下 `timetable`文件夹拷贝至你所在的项目中
2. 将 `utils` 目录下 `timeUtils.js` 文件拷贝至合适的文件夹中
3. 修改 `main.js` 文件添加以下代码

```js
import Vue from 'vue'
import App from './App'
...
// 引入时间处理工具包
import timeUtils from 'utils/timeUtils.js'
Vue.prototype.$timeUtils = timeUtils
...
app.$mount()
```

4. 引入组件，相关代码如下：

```vue
<template>
  <view>
    <view class="" style="display: flex;">
      <button type="default" size="mini"
        @click="showTimetableWeek = !showTimetableWeek">{{showTimetableWeek ? '隐藏周选择' : '显示周选择'}}</button>
      <button type="default" size="mini" @click="colorArrayIndex=0">色卡1</button>
      <button type="default" size="mini" @click="colorArrayIndex=1">色卡2</button>
    </view>
    <timetable-week v-if="showTimetableWeek" :timetableList="timetableList" :currentWeekIndex="currentWeekIndex"
      :originalWeekIndex="originalWeekIndex"></timetable-week>
    <timetable-body :timetableList="timetableList" :startDay="startDay" :currentWeekIndex="currentWeekIndex"
      :colorArrayIndex="colorArrayIndex">
    </timetable-body>
  </view>
</template>

<script>
  // 离线数据
  import {
    timetableData
  } from '../../static/guest.js'
  // 周索引切换组件
  import timetableWeek from '../../components/timetable/timetableWeek.vue'
  // 课表主体
  import timetableBody from '../../components/timetable/timetableBody.vue'
  export default {
    data() {
      return {
        // 课表数据
        timetableList: null,
        // 开学时间
        startDay: '2021/03/01 00:00:00',
        // 当前周索引
        originalWeekIndex: 0,
        // 跳转周索引
        currentWeekIndex: 0,
        // 色卡索引
        colorArrayIndex: 0,
        showTimetableWeek: false
      }
    },
    components: {
      timetableWeek,
      timetableBody
    },
    onLoad() {
      this.timetableList = timetableData
      // 获取当前周索引
      this.originalWeekIndex = this.$timeUtils.getCurrentWeekIndex(this.startDay)
      this.currentWeekIndex = this.originalWeekIndex

      // 监听周索引变化
      const that = this
      uni.$on('changeWeekIndex', function(data) {
        that.currentWeekIndex = data.newWeekIndex
        // 设置标题
        uni.setNavigationBarTitle({
          title: `第${that.currentWeekIndex+1}周课表`
        })
      })

      uni.setNavigationBarTitle({
        title: `第${that.currentWeekIndex+1}周课表`
      })
    }
  }
</script>

```


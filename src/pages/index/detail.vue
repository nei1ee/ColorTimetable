<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { cloneDeep } from 'lodash-es'
import type { CourseModel } from '@/store/modules/course'
import { useAppStore } from '@/store/modules/app'
import { useCourseStore } from '@/store/modules/course'

const appStore = useAppStore()

const defaultCourse: CourseModel = {
  title: '',
  location: '课程地点',
  week: 1,
  weeks: [1, 3, 5],
  start: 1,
  duration: 2,
}

const courseStore = useCourseStore()
const courseList = ref<CourseModel[]>([])

const originalCourseTitle = ref('')
const courseTitle = ref('')
const isUpdate = ref(false)

onLoad((option: any) => {
  isUpdate.value = !!option?.course
  if (isUpdate.value) {
    const courseListTemp = courseStore.courseList.filter(item => item.title === option?.course)
    for (const courseItem of courseListTemp)
      courseList.value.push(cloneDeep(courseItem))
    originalCourseTitle.value = option?.course
    courseTitle.value = option?.course
  }
  else {
    courseList.value = [defaultCourse]
  }
})

function handleDeleteCourseItem(courseIndex: number) {
  uni.showModal({
    title: '警告',
    content: '确定删除该时间段的课程吗？',
    success: (res) => {
      if (res.confirm)
        courseList.value.splice(courseIndex, 1)
    },
  })
}

function navigateBack() {
  uni.navigateBack({})
}

function handleAddNewTime() {
  courseList.value.push(cloneDeep(courseList.value[courseList.value.length - 1]))
}

function handleSaveCourse() {
  if (!courseTitle.value) {
    uni.showToast({
      title: '请输入课程名称',
      icon: 'none',
    })
    return
  }
  for (const courseItem of courseList.value)
    Object.assign(courseItem, { title: courseTitle.value })

  if (isUpdate.value)
    courseStore.deleteCourseItemByTitle(originalCourseTitle.value)

  courseStore.setCourseList(courseStore.courseList.concat(courseList.value))
  uni.showModal({
    title: '提示',
    content: '保存成功',
    showCancel: false,
  })
}

const showWeekActionSheet = ref(false)
const clickedIndex = ref(-1)
const clickedWeeks = ref<number[]>([])

function handleShowWeekActionSheet(clickIndex: number) {
  showWeekActionSheet.value = true
  clickedIndex.value = clickIndex
  clickedWeeks.value = courseList.value[clickIndex].weeks
}

/**
 * transform weeks to string eg: [1, 2, 3, 5, 6, 8] to '1-3,5-6,8'
 * @param weeks week list
 */
function transformArray2String(weeks: number[]): string {
  let weeksString = ''
  for (let i = 0; i < weeks.length; i++) {
    if (i === 0) {
      weeksString += weeks[i]
    }
    else {
      if (weeks[i] !== weeks[i - 1] + 1) {
        const last = weeksString.split(',')[weeksString.split(',').length - 1]
        if (Number.parseInt(last) !== weeks[i - 1])
          weeksString += `-${weeks[i - 1]}`
        weeksString += `,${weeks[i]}`
      }
      else {
        if (i === weeks.length - 1)
          weeksString += `-${weeks[i]}`
      }
    }
  }
  return weeksString
}

function handleClickWeek(week: number) {
  if (!clickedWeeks.value.includes(week)) {
    clickedWeeks.value.push(week)
    clickedWeeks.value.sort((a, b) => a - b)
  }
  else {
    const index = clickedWeeks.value.indexOf(week)
    clickedWeeks.value.splice(index, 1)
  }
}

function handleConfirmWeekActionSheet() {
  showWeekActionSheet.value = false
  courseList.value[clickedIndex.value].weeks = clickedWeeks.value
}

const showTimeActionSheet = ref(false)
const timeValue = ref([1, 1, 1])

function handleShowTimeActionSheet(clickIndex: number) {
  showTimeActionSheet.value = true
  clickedIndex.value = clickIndex
  const { week, start, duration } = courseList.value[clickIndex]
  timeValue.value = [week, start, duration]
}

const timeList = [
  ['星期数', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
  ['开始节次', '第1节', '第2节', '第3节', '第4节', '第5节', '第6节', '第7节', '第8节', '第9节'],
  ['持续节次', '持续1节', '持续2节', '持续3节', '持续4节', '持续5节', '持续6节', '持续7节', '持续8节'],
]

function handleTimeChange(e: any) {
  const value = e.detail.value
  courseList.value[clickedIndex.value].week = value[0] ? value[0] : 1
  courseList.value[clickedIndex.value].start = value[1] ? value[1] : 1
  courseList.value[clickedIndex.value].duration = value[2] ? value[2] : 1
}

function handleConfirmTimeActionSheet() {
  showTimeActionSheet.value = false
}
</script>

<template>
  <div class="font-mono text-gray-500" :class="appStore.darkMode ? 'dark' : ''">
    <div class="bg-gray-100 dark:(bg-#121212 !text-gray-200) ">
      <!-- custom bar -->
      <div class="bg-white top-0 sticky dark:bg-#121212">
        <div
          class="text-center px-6 relative"
          :style="{ 'margin-top': `${appStore.statusBarHeight}px`, 'height': `${appStore.customBarHeight - appStore.statusBarHeight}px` }"
        >
          <div class="h-full text-xl left-4 i-carbon-chevron-left absolute" @click="navigateBack" />
          <div class="flex h-full mx-auto w-20 justify-center items-center inline-block">
            {{ isUpdate ? '编辑课程' : '添加课程' }}
          </div>
        </div>
      </div>

      <div class="overflow-y-scroll" :style="{ height: `calc(100vh - ${appStore.customBarHeight}px)` }">
        <div class="bg-white mb-4 py-1 justify-center items-start dark:bg-#121212">
          <div class="px-4">
            <div class="text-lg">
              通用信息
            </div>
          </div>
          <div class="flex px-4 justify-start items-center">
            <div class="min-w-14">
              名称
            </div>
            <input v-model="courseTitle" class="w-full" type="text" placeholder="输入课程名（必填）">
          </div>
        </div>

        <template v-for="(courseItem, courseIndex) of courseList" :key="courseIndex">
          <div class="bg-white flex flex-col mb-4 py-1 gap-2 justify-center dark:bg-#121212">
            <div class="flex px-4 justify-between items-center">
              <div class="text-lg">
                {{ `时间段${courseList.length > 1 ? courseIndex + 1 : ''}` }}
              </div>
              <div class="text-red-500 i-carbon-delete" @click="handleDeleteCourseItem(courseIndex)" />
            </div>
            <div class="flex px-4 justify-start items-center">
              <div class="min-w-14">
                地点
              </div>
              <input v-model="courseItem.location" class="w-full" type="text" placeholder="输入上课地点（选填）">
            </div>
            <div class="flex px-4 justify-start items-center">
              <div class="min-w-14">
                周数
              </div>
              <div class="w-full" @click="handleShowWeekActionSheet(courseIndex)">
                {{ transformArray2String(courseItem.weeks) }}
              </div>
            </div>
            <div class="flex px-4 justify-start items-center">
              <div class="min-w-14">
                时间
              </div>
              <div class="w-full" @click="handleShowTimeActionSheet(courseIndex)">
                {{ `${timeList[0][courseItem.week]} 第${courseItem.start}-${courseItem.start + courseItem.duration - 1}节` }}
              </div>
            </div>
          </div>
        </template>

        <div class="flex flex-col pb-safe gap-1 justify-center">
          <div
            class="flex bg-green-500 h-12 text-white text-center justify-center items-center"
            hover-class="bg-green-600" :hover-stay-time="150" @click="handleAddNewTime"
          >
            <div class="i-carbon-add" />
            添加其他时间段
          </div>
          <div
            class="flex bg-blue-500 h-12 text-white text-center justify-center items-center"
            hover-class="bg-blue-600" :hover-stay-time="150" @click="handleSaveCourse"
          >
            保存
          </div>
        </div>
      </div>

      <!-- week action sheet -->
      <div @touchmove.prevent>
        <div
          class="bg-white w-full min-h-10 transition-all ease-in-out z-100 duration-300 fixed dark:bg-#121212"
          :class="showWeekActionSheet ? 'bottom-0' : '-bottom-full'"
        >
          <div class="flex flex-col py-6 gap-6">
            <div class="flex font-medium text-xl px-4 justify-between items-center">
              选择上课周
              <div class="font-normal text-base text-green-500" @click="handleConfirmWeekActionSheet">
                确定
              </div>
            </div>
            <div class="grid p-1 gap-1 grid-cols-5 justify-center items-center">
              <template v-for="(item, index) of 20" :key="index">
                <div
                  class="flex h-8 text-center text-white transition-all inline-block justify-center items-center"
                  :class="clickedWeeks.includes(index + 1) ? 'bg-blue-500' : 'bg-gray-300'"
                  @click="handleClickWeek(index + 1)"
                >
                  {{ item }}
                </div>
              </template>
            </div>
          </div>
          <div
            class="flex pb-safe border-t-4 border-gray-200 h-12 text-lg justify-center items-center dark:border-opacity-20"
            hover-class="bg-gray-200 bg-opacity-50" :hover-stay-time="150" @click="showWeekActionSheet = false"
          >
            关闭
          </div>
        </div>
        <div
          class=" bg-dark-100 bg-opacity-50 transition-all top-0 right-0 bottom-0 left-0 z-90 fixed"
          :class="showWeekActionSheet ? 'opacity-100 visible' : 'opacity-0 invisible'"
          @click="showWeekActionSheet = false"
        />
      </div>

      <!-- time action sheet -->
      <div @touchmove.prevent>
        <div
          class="bg-white w-full min-h-10 transition-all ease-in-out z-100 duration-300 fixed dark:bg-#121212"
          :class="showTimeActionSheet ? 'bottom-0' : '-bottom-full'"
        >
          <div class="flex flex-col py-6 gap-6">
            <div class="flex font-medium text-xl px-4 justify-between items-center">
              选择上课周
              <div class="font-normal text-base text-green-500" @click="handleConfirmTimeActionSheet">
                确定
              </div>
            </div>
            <picker-view class="h-40" :value="timeValue" @change="handleTimeChange">
              <picker-view-column>
                <div v-for="(item, index) in timeList[0]" :key="index" class="flex justify-center items-center">
                  {{ item }}
                </div>
              </picker-view-column>
              <picker-view-column>
                <div v-for="(item, index) in timeList[1]" :key="index" class="flex justify-center items-center">
                  {{ item }}
                </div>
              </picker-view-column>
              <picker-view-column>
                <div v-for="(item, index) in timeList[2]" :key="index" class="flex justify-center items-center">
                  {{ item }}
                </div>
              </picker-view-column>
            </picker-view>
          </div>
          <div
            class="flex pb-safe border-t-4 border-gray-200 h-12 text-lg justify-center items-center dark:border-opacity-20"
            hover-class="bg-gray-200 bg-opacity-50" :hover-stay-time="150" @click="showTimeActionSheet = false"
          >
            关闭
          </div>
        </div>
        <div
          class=" bg-dark-100 bg-opacity-50 transition-all top-0 right-0 bottom-0 left-0 z-90 fixed"
          :class="showTimeActionSheet ? 'opacity-100 visible' : 'opacity-0 invisible'"
          @click="showTimeActionSheet = false"
        />
      </div>
    </div>
  </div>
</template>


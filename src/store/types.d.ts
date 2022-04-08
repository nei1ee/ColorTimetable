export interface CourseModel {
  // 课程名
  title: string
  // 地点
  location: string
  // 上课时间
  time: string
  // 开始节次
  start: number
  // 持续节次
  duration: number
  // 上课周数
  week: number
  // 上课周次
  weeks: []
  // 教师
  teacher?: string
  // 学分
  credit: number
  // 学时
  period: number
}

export type CourseList = CourseModel[][][][]

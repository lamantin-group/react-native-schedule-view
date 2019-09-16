import { DateObject } from './react-native-calendars'

export type Slot = {
  id?: string
  enabled: boolean
  time: Date
}

export type SlotMap = {
  [day: string]: Slot[]
}

export type Marked = {
  today: boolean
  selected: boolean
  marked: boolean
  enabled: boolean
  manual: boolean
}
export type MarkedDay = Marked

export type DayProps = {
  dateObject: DateObject
  enabled: boolean
  selected: boolean
  today: boolean
}

export type SlotProps = {
  formatter?: (slot: Slot) => string
  selected: boolean
  enabled: boolean
  slot: Slot
}

export type StringsDateCalendar = {
  // eslint-disable-next-line prettier/prettier
  selectDate: string
  selectTime: string
  date: string
  time: string
}

export type StringsTimeCalendar = {
  noAvailableItems: string
}

/**
 * Used for determinate and chunk slots by day
 */
export type DayKey = string

import { DayKey } from './DayKey'

export type Slot = {
  id?: string
  time: Date
}

export type SlotMap = {
  [day: string]: Slot[]
}

import { DayKey } from './DayKey'

export type Slot = {
  id?: string
  enabled: boolean
  time: Date
}

export type SlotMap = {
  [day: string]: Slot[]
}

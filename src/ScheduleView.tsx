import React, { Component } from 'react'
import { Text, View, ViewStyle, Image } from 'react-native'
import { Calendar } from './react-native-calendars'
import XDate from 'xdate'
import { Circle } from './Circle'
import { ClickableView } from './ClickableView'
import { DayKey } from './DayKey'
import { Slot, SlotMap } from './Slot'
import { StateView } from './StateView'
import { TimeCalendar } from './TimeCalendar'
import { DateObject } from 'react-native-calendars'
export interface ScheduleViewProps {
  slots: SlotMap

  showTime: boolean
  showDate: boolean

  style?: ViewStyle
  isLoading?: boolean
  today?: Date

  renderDay?: (dayProps: DayProps) => React.ReactNode
  renderTime?: (slotProps: SlotProps) => React.ReactNode
  renderArrow?: (direction: 'left' | 'right') => React.ReactNode

  mapSlotsToSingleDay?: (day: DayKey, slots: Slot[]) => MarkedDay

  onDateChanges?: (date: DayKey | null, slot: Slot | null) => void
  onMonthChanges?: (year: number, month: number) => void

  /**
   * Format selected date
   */
  formatDate?: (date: DayKey) => string

  /**
   * Format day showed in TimeCalendar header
   */
  formatHeaderDay?: (date: DayKey) => string

  formatTime?: (slot: Slot) => string

  strings?: {
    select_date: string
    select_time: string
    date: string
    time: string
  }
}

export interface ScheduleViewState {
  selectedDate: DayKey | null // key for map of slots
  selectedSlot: Slot | null
  currentDateHack: Date // used for navigate by calendar months
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

export class ScheduleView extends Component<ScheduleViewProps, ScheduleViewState> {
  static defaultProps = {
    style: {},
    slots: {},
    mapSlotsToSingleDay: () => {
      return {}
    },
    onDateChanges: (date: Date, slot?: Slot) => {},
    formatDate: (date: DayKey) => date,
    formatTime: (slot: Slot) => slot.time.toLocaleTimeString(),
    formatHeaderDay: undefined,
    isLoading: false,
    onMonthChanges: (year: number, month: number) => {},

    strings: {
      select_date: 'Select date',
      select_time: 'Select time',
      time: 'Time',
      date: 'Date',
    },

    renderArrow: (direction: 'left' | 'right') => {
      // return null
      return (
        <Image
          style={{
            height: 24,
            width: 24,
            transform: [{ rotate: direction === 'left' ? '180deg' : '0deg' }],
          }}
          source={require('../assets/ic_arrow/ic_arrow.png')}
        />
      )
    },
    renderDay: (dayProps: DayProps) => {
      let style = {
        circle: {
          color: 'transparent',
        },
        text: {
          color: 'gray',
        },
      }

      if (dayProps.enabled) {
        style = {
          circle: {
            color: 'transparent',
          },
          text: {
            color: 'black',
          },
        }
      }

      if (dayProps.today) {
        style = Object.assign(style, {
          circle: {
            color: 'transparent',
            borderColor: 'black',
          },
          text: {
            color: 'black',
          },
        })
      }

      if (dayProps.selected) {
        style = Object.assign(style, {
          circle: {
            color: 'gray',
          },
          text: {
            color: 'white',
          },
        })
      }

      return (
        <Circle {...style.circle} size={28} borderWidth={1}>
          <Text style={{ color: style.text.color }}>{dayProps.dateObject.day}</Text>
        </Circle>
      )
    },
    renderTime: (slotProps: SlotProps) => {
      return <Text>{slotProps.formatter(slotProps.slot)}</Text>
    },
  }

  constructor(props: ScheduleViewProps) {
    super(props)
    this.state = {
      selectedDate: null,
      selectedSlot: null,
      currentDateHack: new Date(),
    }
  }

  componentDidUpdate(
    prevProps: Readonly<ScheduleViewProps>,
    prevState: Readonly<ScheduleViewState>
  ) {
    const { onDateChanges } = this.props
    const { selectedDate, selectedSlot } = this.state

    const isDateChanges = prevState.selectedDate !== selectedDate
    const isSlotChanges = prevState.selectedSlot !== selectedSlot
    if (isDateChanges || isSlotChanges) {
      const payload: any = {
        showCancel: !!(selectedDate || selectedSlot),
        currentDateHack: selectedDate ? new Date(selectedDate) : new Date(),
      }
      // ? need close schedule after select slot
      // if (isSlotChanges) {
      //   payload.showTime = false
      //   payload.showDate = false
      // }
      this.setState(payload)
      onDateChanges && onDateChanges(selectedDate, selectedSlot)
    }
  }

  onPressClear = () => {
    this.clearTime()
  }

  clearTime() {
    this.setState({
      selectedDate: null,
      selectedSlot: null,
    })
  }

  renderCalendar() {
    const { showTime, showDate, formatHeaderDay } = this.props
    const { selectedDate, selectedSlot, currentDateHack } = this.state
    const {
      slots,
      isLoading,
      onMonthChanges,
      mapSlotsToSingleDay,
      renderDay,
      renderTime,
      renderArrow,
      formatTime,
    } = this.props
    const markedDates: { [day: string]: MarkedDay } = { ...slots }
    if (showDate) {
      const today = new Date().toISOString().slice(0, 10) // yyyy-mm-dd
      Object.keys(slots).forEach(key => {
        // const timeSlots: Slot[] = markedDates[key] || []
        // const firstTimeSlot = timeSlots[0] || {}
        // const isHasDoctors = firstTimeSlot.availableDoctorsCount > 0 // todo: move it into props function
        // const isHasDoctors = !!_.find(timeSlots, element => element.availableDoctorsCount > 0) // todo: move it into props function
        // const isHasDoctors = true // todo: move it into props function
        markedDates[key] = {
          today: key === today,
          selected: key === selectedDate,
          marked: true,
          enabled: true,
          manual: true,
          ...mapSlotsToSingleDay!(key, slots[key]),
        }
      })

      return (
        <Calendar
          displayLoadingIndicator={isLoading}
          markingType="custom"
          markedDates={markedDates}
          onMonthChange={date => {
            onMonthChanges && onMonthChanges(date.year, date.month)
          }}
          current={currentDateHack}
          disabledByDefault
          renderArrow={renderArrow}
          hideExtraDays
          onPressArrowRight={addMonth => {
            const nextMonth = new XDate(currentDateHack).addMonths(1)
            this.setState({
              currentDateHack: nextMonth.toDate(),
            })
            addMonth()
          }}
          onPressArrowLeft={substractMonth => {
            const prevMonth = new XDate(currentDateHack).addMonths(-1)
            this.setState({
              currentDateHack: prevMonth.toDate(),
            })
            substractMonth()
          }}
          dayComponent={props => {
            console.log(props)
            const { date } = props

            const isEnabled = props.marking.manual
              ? props.marking.enabled
              : props.state !== 'disabled'

            const isSelected = props.marking.selected
            const isToday = props.marking.today

            const dayProps: DayProps = {
              enabled: isEnabled,
              selected: isSelected,
              today: isToday,
              dateObject: date,
            }

            return (
              <ClickableView
                onPress={() =>
                  this.setState({
                    selectedDate: date.dateString,
                  })
                }
                disabled={!isEnabled}>
                {renderDay && renderDay(dayProps)}
              </ClickableView>
            )
          }}
        />
      )
    }

    if (showTime) {
      return (
        <TimeCalendar
          slots={slots}
          keyExtractor={slot => slot.time.toDateString()}
          selectedDate={selectedDate}
          onSlotSelected={(day: DayKey, slot: Slot) => {
            this.setState({
              selectedDate: day,
              selectedSlot: slot,
            })
          }}
          formatHeaderDay={formatHeaderDay}
          renderArrow={renderArrow}
          renderSlot={(props, slot) => {
            const selected = slot.time === (selectedSlot || {}).time
            const disabled = !slot.enabled
            if (disabled && selected) {
              this.setState({
                selectedSlot: null,
              })
            }
            const slotProps: SlotProps = {
              formatter: formatTime,
              selected: selected,
              enabled: !disabled,
              slot: slot,
            }
            return (
              <ClickableView key={props.key} onPress={props.onPress} disabled={disabled}>
                <StateView
                  enabled={!disabled}
                  style={{
                    borderColor: 'gray',
                    borderWidth: selected ? 1 : 0,
                    padding: 4,
                    borderRadius: 4,
                  }}>
                  {renderTime && renderTime(slotProps)}
                </StateView>
              </ClickableView>
            )
          }}
        />
      )
    }

    return null
  }

  render() {
    const { style } = this.props

    return <View style={style}>{this.renderCalendar()}</View>
  }
}

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Text, View, ViewStyle, TouchableOpacity } from 'react-native'
import { Slot, SlotMap } from './Slot'
import { DayKey } from './DayKey'
import { StateView } from './StateView'

/**
 * Split array into chunks by predifined length
 */
export function chunk<T>(array: T[], length: number): T[][] {
  const chunks = []
  let i = 0
  const n = array.length

  while (i < n) {
    chunks.push(array.slice(i, (i += length)))
  }

  return chunks
}

export interface TimeCalendarProps {
  slots: SlotMap

  renderArrow: (direction: 'left' | 'right') => React.ReactNode
  renderSlot: (
    props: {
      onPress: () => void
      key: string
      timeFormatter: (time: Date) => string
    },
    slot: Slot
  ) => React.ReactNode

  /**
   * Invoked only when user select available slot
   */
  onSlotSelected: (date: DayKey, slot: Slot) => void

  selectedDate: DayKey | null | undefined

  /**
   * Number of columns
   *
   * @default 4
   */
  columns: number

  strings: {
    no_available_times: string
  } | null

  keyExtractor: (slot: Slot) => string

  style?: ViewStyle

  timeFormatter: (time: Date) => string
  dateFormatter: (date: DayKey) => string
}

export interface TimeCalendarState {
  // user for determinate date for render
  showDate: DayKey

  // used for independent changes of internal date
  changeDayClicked: boolean
}

export class TimeCalendar extends Component<TimeCalendarProps, TimeCalendarState> {
  static defaultProps = {
    columns: 4,
    slots: [],
    keyExtractor: (slot: Slot) => slot.id,
    renderSlot: (props: any, slot: Slot) => {
      // return <Text>{props.timeFormatter(slot.time)}</Text>
      return <Text>{''}</Text>
    },
    timeFormatter: (time: any) => time,
    dateFormatter: (time: Date) => time,
    // onSelectedNewDate: null,
    onSlotSelected: (dayKey: DayKey, slot: Slot) => {
      console.warn('not implemented onSelectedSlot: ' + JSON.stringify(slot))
    },
    style: {},
    strings: {
      no_available_times: 'No have available slots',
    },
  }

  state = {
    showDate: undefined,
    changeDayClicked: false,
  }

  componentDidMount() {
    const { slots, selectedDate } = this.props
    let showDate = selectedDate
    if (!showDate) {
      showDate = this.selectDefaultDay(slots)
    }

    this.setState({
      showDate: showDate,
      changeDayClicked: false,
    })
  }

  componentDidUpdate(
    prevProps: Readonly<TimeCalendarProps>,
    prevState: Readonly<TimeCalendarState>
  ) {
    const { selectedDate } = this.props
    const { changeDayClicked } = this.state

    if (changeDayClicked) {
      // do not update state
    } else if (selectedDate) {
      const isChangedFromProps = prevProps.selectedDate !== selectedDate
      if (isChangedFromProps) {
        this.setState({
          changeDayClicked: false,
          showDate: selectedDate,
        })
      }
    }
  }

  onClickPrevDay = (currentIndex: number, days: DayKey[]) => {
    const prevDay = days[currentIndex - 1]
    this.setState({
      showDate: prevDay,
      changeDayClicked: true,
    })
  }

  onClickNextDay = (currentIndex: number, days: DayKey[]) => {
    const nextDay = days[currentIndex + 1]
    this.setState({
      showDate: nextDay,
      changeDayClicked: true,
    })
  }

  selectDefaultDay(slots: SlotMap): DayKey {
    return Object.keys(slots)[0]
  }

  renderHeader(slots: SlotMap, showDate: DayKey, dateFormatter: (date: DayKey) => string) {
    // const groupedByDays = groupBy(slots, item => item.dateString)
    // const formattedDays = Array.from(groupedByDays.keys())
    // const indexOfDay = indexOf(formattedDays, element => {
    //   return element === TimeHelper.format(date, TimeHelper.PATTERN_YEAR_MONTH_DAY)
    // })
    const days = Object.keys(slots)
    const indexOfDay = days.findIndex(day => day === showDate)

    const hasPrevDay = indexOfDay !== 0
    const hasNextDay = indexOfDay !== days.length - 1
    const { renderArrow } = this.props
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          paddingVertical: 12,
          paddingHorizontal: 16,
          alignItems: 'center',
        }}>
        {hasPrevDay && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              zIndex: 1,
              left: 16,
            }}
            onPress={() => {
              this.onClickPrevDay(indexOfDay, days)
            }}>
            {renderArrow('left')}
          </TouchableOpacity>
        )}

        <Text
          style={{
            textAlign: 'center',
            flexGrow: 1,
            fontSize: 16,
            fontWeight: '100',
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 0,
          }}>
          {dateFormatter(showDate)}
        </Text>

        {hasNextDay && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              end: 16,
              zIndex: 1,
            }}
            onPress={() => {
              this.onClickNextDay(indexOfDay, days)
            }}>
            {renderArrow('right')}
          </TouchableOpacity>
        )}
      </View>
    )
  }

  renderEmpty() {
    const { strings } = this.props
    return (
      <Text style={{ textAlign: 'center', marginTop: 16, marginHorizontal: 16 }}>
        {strings!.no_available_times}
      </Text>
    )
  }

  render() {
    const { showDate } = this.state
    if (!showDate) return this.renderEmpty()

    const {
      slots,
      columns,
      dateFormatter,
      timeFormatter,
      onSlotSelected,
      style,
      renderSlot,
      keyExtractor,
    } = this.props
    if (!slots) return this.renderEmpty()

    // const groupedByDays = groupBy(slots, time => time.dateString)
    // const formatedShowDay = TimeHelper.format(showDate.date, TimeHelper.PATTERN_YEAR_MONTH_DAY)
    const daySlots: Slot[] = slots[showDate]!!
    const rows = chunk(daySlots, columns)

    return (
      <View style={style}>
        {this.renderHeader(slots, showDate, dateFormatter)}
        {rows.map((column, indexColumn) => (
          <View
            key={column.map(slot => keyExtractor(slot)).join(';')}
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            {column.map(slot => {
              return renderSlot(
                {
                  onPress: () => onSlotSelected(showDate!, slot),
                  key: keyExtractor(slot),
                  timeFormatter: timeFormatter,
                },
                slot
              )
            })}
          </View>
        ))}
      </View>
    )
  }
}

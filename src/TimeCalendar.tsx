import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Text, View, ViewStyle, TouchableOpacity } from 'react-native'
import { Slot } from './Slot'
import { DayKey } from './DayKey'
// import { chunk } from '../../helpers/Utils'
// import strings from '../../localization'
// import ClickableView from '../common/ClickableView'
// import { colors } from '../common/CommonStyles'
// import { iconChevronLeft, iconChevronRight } from '../common/IconsSet'

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
  slots: Map<DayKey, Slot[]>

  renderSlot: (
    props: {
      onPress: () => void
      key: string
    },
    slot: Slot
  ) => React.ReactNode

  /**
   * Invoked only when user select available slot
   */
  onSlotSelected: (date: DayKey, slot: Slot) => void

  selectedDate: DayKey | null

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

  timeFormatter: (time: any) => string
  dateFormatter: (date: any) => string
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
    renderSlot: (slot: Slot) => {
      return <Text>{slot.time}</Text>
    },
    timeFormatter: (time: any) => time,
    dateFormatter: (time: any) => time,
    // onSelectedNewDate: null,
    onSlotSelected: (dayKey: DayKey, slot: Slot) => {
      console.warn('not implemented onSelectedSlot: ' + JSON.stringify(slot))
    },
    selectedDate: null,
    style: {},
    strings: {
      no_available_times: 'No have available slots',
    },
  }

  componentDidMount() {
    const { slots, selectedDate } = this.props
    let showDate = selectedDate
    if (!showDate) {
      showDate = this.selectDefaultDay(slots)
    }

    this.setState({
      showDate: showDate,
    })
  }

  componentDidUpdate(
    prevProps: Readonly<TimeCalendarProps>,
    prevState: Readonly<TimeCalendarState>
  ) {
    const { selectedDate } = this.props
    const { showDate, changeDayClicked } = this.state

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

  selectDefaultDay(slots: Map<DayKey, Slot[]>): DayKey {
    return slots.keys().next().value
  }

  renderHeader(
    slots: Map<DayKey, Slot[]>,
    showDate: DayKey,
    dateFormatter: (date: DayKey) => string
  ) {
    // const groupedByDays = groupBy(slots, item => item.dateString)
    // const formattedDays = Array.from(groupedByDays.keys())
    // const indexOfDay = indexOf(formattedDays, element => {
    //   return element === TimeHelper.format(date, TimeHelper.PATTERN_YEAR_MONTH_DAY)
    // })
    const days = Array.from(slots.keys())
    const indexOfDay = days.findIndex(day => day === showDate)

    const hasPrevDay = indexOfDay !== 0
    const hasNextDay = indexOfDay !== days.length - 1

    const styleIcon = {
      size: 16,
      color: 'blue', // todo: move into props
    }
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
            onPress={() => {
              this.onClickPrevDay(indexOfDay, days)
            }}>
            {/* // todo: move into props */}
            {/* {iconChevronLeft(styleIcon)} */}
          </TouchableOpacity>
        )}

        <Text
          style={{
            textAlign: 'center',
            flexGrow: 1,
            fontSize: 16,
            fontWeight: '100',
          }}>
          {dateFormatter(showDate)}
        </Text>

        {hasNextDay && (
          <TouchableOpacity
            onPress={() => {
              this.onClickNextDay(indexOfDay, days)
            }}>
            {/* // todo: move into props */}
            {/* {iconChevronRight(styleIcon)} */}
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
    const daySlots: Slot[] = slots.get(showDate)!!
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
                  onPress: () => onSlotSelected(showDate, slot),
                  key: keyExtractor(slot),
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

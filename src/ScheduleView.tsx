import React, { Component } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import { Calendar } from 'react-native-calendars'
import XDate from 'xdate'
import { Circle } from './Circle'
// import TimeHelper from '../../helpers/TimeHelper'
// import strings from '../../localization'
// import Circle from '../common/Circle'
import { ClickableView } from './ClickableView'
import { DayKey } from './DayKey'
import { Slot } from './Slot'
import { StateView } from './StateView'
// import { CommonStyles } from '../common/CommonStyles'
// import { cancelIcon, iconCalendar, iconClock } from '../common/IconsSet'
// import StateView from '../common/StateView'
// import colors from '../common/styles/colors'
// import textStyles from '../common/styles/textStyles'
import { TimeCalendar } from './TimeCalendar'
export interface ScheduleViewProps {
  slots: Map<DayKey, Slot[]>

  style?: ViewStyle
  isLoading?: boolean

  onDateChanges?: (date: DayKey | null, slot: Slot | null) => void
  onMonthChanges?: (year: number, month: number) => void

  formatterSelectedDay?: (date: DayKey) => string
  formatterSelectedTime?: (slot: Slot) => string

  strings?: {
    select_date: string
    select_time: string
    date: string
    time: string
  }
}

export interface ScheduleViewState {
  showCalendar: boolean
  showTime: boolean
  selectedDate: DayKey | null // key for map of slots
  selectedSlot: Slot | null
  showCancel: boolean
  currentDateHack: Date // used for navigate by calendar months
}

export class ScheduleView extends Component<ScheduleViewProps, ScheduleViewState> {
  static defaultProps = {
    style: {},
    slots: {},
    onDateChanges: (date: Date, slot?: Slot) => {},
    formatterSelectedDay: (date: Date) => date,
    formatterSelectedTime: (slot: Slot) => slot.time,
    isLoading: false,
    onMonthChanges: (year: number, month: number) => {},

    strings: {
      select_date: 'Select date',
      select_time: 'Select time',
      time: 'Time',
      date: 'Date',
    },
  }

  constructor(props: ScheduleViewProps) {
    super(props)
    this.state = {
      showCalendar: false,
      showTime: false,
      selectedDate: null,
      selectedSlot: null,
      showCancel: false,
      currentDateHack: new Date(),
    }
  }

  componentDidUpdate(
    prevProps: Readonly<ScheduleViewProps>,
    prevState: Readonly<ScheduleViewState>
  ) {
    const { slots, onDateChanges } = this.props
    const { selectedDate, selectedSlot } = this.state

    const isDateChanges = prevState.selectedDate !== selectedDate
    const isSlotChanges = prevState.selectedSlot !== selectedSlot
    if (isDateChanges || isSlotChanges) {
      const payload: any = {
        showCancel: !!(selectedDate || selectedSlot),
        currentDateHack: selectedDate ? new Date(selectedDate) : new Date(),
      }
      if (isSlotChanges) {
        payload.showTime = false
        payload.showCalendar = false
      }
      this.setState(payload)
      onDateChanges && onDateChanges(selectedDate, selectedSlot)
    }
  }

  onClickShowCalendar = () => {
    this.setState(prevState => ({
      showCalendar: !prevState.showCalendar,
      showTime: false,
    }))
  }

  onClickShowTime = () => {
    this.setState(prevState => ({
      showCalendar: false,
      showTime: !prevState.showTime,
    }))
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

  renderBottomView() {
    const { showCalendar, showTime, selectedDate, selectedSlot, currentDateHack } = this.state
    const { slots, isLoading, onMonthChanges } = this.props
    const markedDates = { ...slots }
    if (showCalendar) {
      const today = new Date().toISOString().slice(0, 10) // yyyy-mm-dd
      Object.keys(slots).forEach(key => {
        const timeSlots = markedDates.get(key) || []
        // const firstTimeSlot = timeSlots[0] || {}
        // const isHasDoctors = firstTimeSlot.availableDoctorsCount > 0 // todo: move it into props function
        // const isHasDoctors = !!_.find(timeSlots, element => element.availableDoctorsCount > 0) // todo: move it into props function
        const isHasDoctors = true // todo: move it into props function
        markedDates.set(key, {
          // ...original,
          today: key === today,
          selected: key === selectedDate,
          marked: true,
          enabled: isHasDoctors,
          manual: true,
          // disableTouchEvent: !isHasDoctors,
        })
      })

      return (
        <Calendar
          // customStyles={undefined}
          onMonthChange={date => {
            onMonthChanges && onMonthChanges(date.year, date.month)
          }}
          current={currentDateHack}
          disabledByDefault
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

            // const isEnabled = props.marking.manual
            //   ? props.marking.enabled
            //   : props.state !== 'disabled'
            // const isSelected = props.marking.selected
            // const isToday = props.marking.today

            // let style = { ...styleDisabled }
            const style = {}

            // if (isEnabled) {
            // style = { ...styleDay }
            // }

            // if (isToday) {
            // style = Object.assign(style, styleToday)
            // }

            // if (isSelected) {
            // style = Object.assign(style, styleSelected)
            // }

            return (
              <ClickableView
                onPress={() =>
                  this.setState({
                    selectedDate: date.dateString,
                  })
                }
                // disabled={!isEnabled}>
                disabled={false}>
                {/* <Circle size={28} {...style.circle}> */}
                <Circle size={28}>
                  <Text
                    style={{
                      // ...textStyles.common,
                      textAlign: 'center',
                      // ...style.text,
                    }}>
                    {date.day}
                  </Text>
                </Circle>
              </ClickableView>
            )
          }}
          displayLoadingIndicator={isLoading}
          markingType="custom"
          markedDates={markedDates}
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
          renderSlot={(props, slot) => {
            // todo: fixme
            // let textStyle = stylesTime.common
            const textStyle = {}
            const containerStyle: ViewStyle = {
              borderRadius: 4,
              paddingHorizontal: 8,
              marginVertical: 4,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }
            const selected = slot.time === (selectedSlot || {}).time
            const disabled = false // todo: move it to props
            // const { promoted } = slot

            // todo: refactor this
            // if (disabled) textStyle = stylesTime.disabled
            // if (promoted) {
            //   textStyle = stylesTime.promoted
            //   containerStyle.borderWidth = 1
            //   containerStyle.borderColor = colors.divider
            // }
            // if (selected) {
            //   textStyle = stylesTime.selected
            //   containerStyle.backgroundColor = colors.divider
            // }

            // todo: need refactor this place should be in another place, not in render
            // this determinate state, where user select date and after fetch new slots, this slot was disabled
            if (disabled && selected) {
              this.setState({
                selectedSlot: null,
              })
            }

            return (
              <StateView {...props} enabled={!disabled} style={containerStyle}>
                <Text
                  style={{
                    ...textStyle,
                    paddingVertical: 5,
                  }}>
                  {slot.time}
                </Text>
              </StateView>
            )
          }}
        />
      )
      // return (
      //   <TimeCalendar
      //     slots={slots}
      //     timeFormatter={time => TimeHelper.formatTime(time)}
      //     dateFormatter={date => TimeHelper.format(date, TimeHelper.PATTERN_DATE_WITH_DAY_OF_WEEK)}
      //     keyExtractor={slot => slot.displayDateTime}
      //     renderTime={(props, slot) => {
      //       let textStyle = stylesTime.common
      //       const containerStyle = {
      //         borderRadius: 4,
      //         paddingHorizontal: 8,
      //         marginVertical: 4,
      //         flex: 1,
      //         justifyContent: 'center',
      //         alignItems: 'center',
      //       }
      //       const selected = slot.displayDateTime === (selectedSlot || {}).displayDateTime
      //       const disabled = slot.availableDoctorsCount <= 0
      //       const { promoted } = slot

      //       if (disabled) textStyle = stylesTime.disabled
      //       if (promoted) {
      //         textStyle = stylesTime.promoted
      //         containerStyle.borderWidth = 1
      //         containerStyle.borderColor = colors.divider
      //       }
      //       if (selected) {
      //         textStyle = stylesTime.selected
      //         containerStyle.backgroundColor = colors.divider
      //       }

      //       // todo: need refactor this place should be in another place, not in render
      //       // this determinate state, where user select date and after fetch new slots, this slot was disabled
      //       if (disabled && selected) {
      //         this.setState({
      //           selectedSlot: null,
      //         })
      //       }

      //       return (
      //         <StateView
      //           {...props}
      //           enabled={!disabled}
      //           style={{
      //             ...containerStyle,
      //           }}>
      //           <Text
      //             style={{
      //               ...textStyle,
      //               paddingVertical: 5,
      //             }}>
      //             {slot.displayTime}
      //           </Text>
      //         </StateView>
      //       )
      //     }}
      //     selectedDate={selectedDate}
      //     onSelectedSlot={slot => {
      //       this.setState({
      //         selectedSlot: slot,
      //         selectedDate: slot.displayDate,
      //       })
      //     }}
      //   />
      // )
    }

    return null
  }

  render() {
    const { style, strings, formatterSelectedDay, formatterSelectedTime } = this.props
    const { selectedDate, selectedSlot, showCancel } = this.state

    const titleDate = selectedDate ? formatterSelectedDay!(selectedDate) : strings!.select_date
    const titleTime = selectedSlot ? formatterSelectedTime!(selectedSlot) : strings!.select_time

    return (
      <View
        style={{
          ...style,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <ClickableView
            style={{ flexDirection: 'row', flexGrow: 1 }}
            onPress={this.onClickShowCalendar}>
            {/* {iconCalendar()} */}
            <View style={{ marginStart: 8 }}>
              <Text>{strings!.date}</Text>
              <Text>{titleDate}</Text>
            </View>
          </ClickableView>

          <ClickableView
            style={{ flexDirection: 'row', flexGrow: 1 }}
            onPress={this.onClickShowTime}>
            {/* {iconClock()}  todo */}
            <View style={{ marginStart: 8 }}>
              <Text>{strings!.time}</Text>
              <Text>{titleTime}</Text>
            </View>
          </ClickableView>

          {showCancel && (
            <ClickableView onPress={this.onPressClear}>
              {/* {cancelIcon({
                size: 24,
              })} */}
              {/* // todo */}
            </ClickableView>
          )}
        </View>

        {this.renderBottomView()}
      </View>
    )
  }
}

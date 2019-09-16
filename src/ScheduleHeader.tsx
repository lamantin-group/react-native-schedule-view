import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { ClickableView } from './ClickableView'

export interface ScheduleHeaderProps {
  onPressDate: () => void
  onPressTime: () => void
  date: string
  time: string
  strings?: {
    date: string
    time: string
  }
}

export class ScheduleHeader extends Component<ScheduleHeaderProps> {
  static defaultProps = {
    strings: {
      date: 'Date',
      time: 'Time',
    },
  }

  render() {
    const { onPressDate, onPressTime, date, time, strings } = this.props
    return (
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 4,
        }}>
        <ClickableView style={{ flexDirection: 'row', flexGrow: 1 }} onPress={onPressDate}>
          <View style={{ marginStart: 8 }}>
            <Text>{strings && strings.date}</Text>
            <Text>{date}</Text>
          </View>
        </ClickableView>

        <ClickableView style={{ flexDirection: 'row', flexGrow: 1 }} onPress={onPressTime}>
          <View style={{ marginStart: 8 }}>
            <Text>{strings && strings.time}</Text>
            <Text>{time}</Text>
          </View>
        </ClickableView>
      </View>
    )
  }
}

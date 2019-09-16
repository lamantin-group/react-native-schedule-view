/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { Fragment, Component } from 'react'
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native'
import XDate from 'xdate'
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen'
import { SwitchView } from 'react-native-lamantin'

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
})

import { ScheduleView, DayKey, Slot } from 'react-native-library'
import { ScheduleHeader } from '../src/ScheduleHeader'
import { SlotMap } from '../src/Types'

function getDate(xDate: XDate): string {
  return xDate.toISOString().slice(0, 10)
}

interface AppState {
  date?: DayKey | null
  slot?: Slot | null
  showTime: boolean
  showDate: boolean
  slots: SlotMap
}

export default class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props)
    const yesterday = new XDate().addDays(-1)
    const today = new XDate()
    const tomorrow = new XDate().addDays(1)

    const slots: SlotMap = {}
    slots[getDate(yesterday)] = [
      {
        time: yesterday.toDate(),
        enabled: true,
      },
      {
        time: new XDate(yesterday).addHours(1).toDate(),
        enabled: false,
      },
    ]

    slots[getDate(today)] = [
      {
        time: new XDate(today).addHours(-1).toDate(),
        enabled: true,
      },
      {
        time: today.toDate(),
        enabled: true,
      },
      {
        time: new XDate(today).addHours(1).toDate(),
        enabled: false,
      },
    ]

    slots[getDate(tomorrow)] = [
      {
        time: new XDate(tomorrow).addHours(-1).toDate(),
        enabled: true,
      },
      {
        time: tomorrow.toDate(),
        enabled: true,
      },
      {
        time: new XDate(tomorrow).addHours(1).toDate(),
        enabled: true,
      },
    ]
    this.state = {
      slots,
      showTime: true,
      showDate: false,
    }
  }

  render() {
    const { date, slot, showDate, showTime, slots } = this.state

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            style={{
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}>
            <Text style={{ fontSize: 24, marginBottom: 16 }}>Settings</Text>

            <SwitchView
              checked={showDate}
              title="Show date"
              style={{ marginBottom: 16 }}
              onChanges={checked => this.setState({ showDate: checked })}
            />

            <SwitchView
              style={{ marginBottom: 16 }}
              checked={showTime}
              title="Show time"
              onChanges={checked => this.setState({ showTime: checked })}
            />

            <ScheduleHeader
              date={date ? date.toString() : 'Select date'}
              time={slot ? `${slot.time.getHours()}:${slot.time.getMinutes()}` : 'Select time'}
              onPressTime={() =>
                this.setState({
                  showDate: false,
                  showTime: !showTime,
                })
              }
              onPressDate={() =>
                this.setState({
                  showDate: !showDate,
                  showTime: false,
                })
              }
            />
            <View style={{ height: 1 }} />
            <ScheduleView
              slots={slots}
              showDate={showDate}
              showTime={showTime}
              formatTime={(slot: Slot) => `${slot.time.getHours()}:${slot.time.getMinutes()}`}
              onDateChanges={(date?: DayKey, slot?: Slot) => {
                this.setState({
                  date: date,
                  slot: slot,
                })
              }}
            />

            <Text style={{ fontSize: 18, marginTop: 24 }}>Slots</Text>
            <Text>{JSON.stringify(slots, null, '\t')}</Text>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    )
  }
}

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { Fragment } from 'react'
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native'
import XDate from 'xdate'
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen'

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
import { SlotMap } from '../src/Slot'

function getDate(xDate: XDate): string {
  return xDate.toISOString().slice(0, 10)
}

const App = () => {
  const yesterday = new XDate().addDays(-1)
  const today = new XDate()
  const tomorrow = new XDate().addDays(1)

  const slots: SlotMap = {}
  // 2019-12-31 -> YYYY-MM-DD
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

  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <ScheduleView
            slots={slots}
            formatTime={(slot: Slot) => `${slot.time.getHours()}:${slot.time.getMinutes()}`}
          />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  )
}

export default App

import React, { PureComponent } from 'react'
import { View, ViewStyle } from 'react-native'

export type CircleProps = {
  size: number
  color?: string
  borderColor?: string
  borderWidth?: number
  style?: ViewStyle
}

export class Circle extends PureComponent<CircleProps> {
  static defaultProps = {
    color: '#000',
    size: 4,
    style: {},
    borderColor: 'transparent',
    borderWidth: 0,
  }

  render() {
    const { color, size, style, children, borderColor, borderWidth } = this.props
    return (
      <View
        style={{
          height: size,
          width: size,
          backgroundColor: color,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: borderColor,
          borderWidth: borderWidth,
          ...style,
        }}>
        {children}
      </View>
    )
  }
}

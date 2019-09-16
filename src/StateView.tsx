import React, { Component, ReactNode } from 'react'
import { Animated, TouchableOpacity, ViewStyle, View } from 'react-native'

interface StateViewProps extends Readonly<{ children?: ReactNode }> {
  /**
   * Use for indicate state of view: enabled or disabled
   */
  enabled?: boolean

  /**
   * Use for change opacity of disabled state;
   * 0 - transparent
   * 1 - visible
   */
  disabledOpacity?: number

  style?: ViewStyle

  duration: number
}

/**
 * Wrapper for create disabled state for each view.
 *
 * This is achieved by applying an opacity mask on childs inside StateView.
 * Use *disabledOpacity* option for change opacity level, where 0 - transparent and 1 - visible.
 */
export class StateView extends Component<StateViewProps> {
  static defaultProps = {
    enabled: true,
    disabledOpacity: 0.3,
    style: {},
    duration: 300,
  }

  state = {
    animatedOpacity: new Animated.Value(this.props.enabled ? 1 : this.props.disabledOpacity!!),
  }

  componentDidUpdate(prevProps: StateViewProps, prevState: StateViewProps) {
    const { enabled, disabledOpacity, duration } = this.props
    const { animatedOpacity } = this.state
    const hasChanges = enabled !== prevProps.enabled

    if (hasChanges) {
      const toEnabled = enabled && !prevProps.enabled

      Animated.timing(animatedOpacity, {
        toValue: toEnabled ? 1 : disabledOpacity!!,
        duration: duration,
      }).start()
    }
  }

  render() {
    const { animatedOpacity } = this.state
    const { enabled, children, style } = this.props
    return (
      <Animated.View
        style={style}
        pointerEvents={enabled ? 'auto' : 'none'}
        opacity={animatedOpacity}>
        {children}
      </Animated.View>
    )
  }
}

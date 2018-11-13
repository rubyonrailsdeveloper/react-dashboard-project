import { Button } from '@blueprintjs/core'
import * as React from 'react'
import { TimeRange } from 'src/store/metrics/metrics-model'

interface TimeRangeButtonProps {
  value: TimeRange
  onClick: (timeRange: TimeRange) => void
  range: TimeRange
}

export default class TimeRangeButton extends React.Component<TimeRangeButtonProps> {
  handleOnClick = () => this.props.onClick(this.props.range)

  render() {
    const { range, value } = this.props

    return <Button onClick={this.handleOnClick} text={range} active={value === range} />
  }
}

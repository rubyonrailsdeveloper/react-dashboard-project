import { Classes } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import TimeRangeButton from 'src/components/TimeRangeToolbar/internal/TimeRangeButton'
import { TimeRangeToolbarProps } from 'src/components/TimeRangeToolbar/internal/types'
import { TimeRange } from 'src/store/metrics/metrics-model'

class TimeRangeShortToolbar extends React.Component<TimeRangeToolbarProps> {
  render() {
    return (
      <div className={classes(Classes.BUTTON_GROUP, this.props.className)}>
        <TimeRangeButton
          onClick={this.props.onChange}
          range={TimeRange.THIRTY_MINUTES}
          value={this.props.active}
          key={TimeRange.THIRTY_MINUTES}
        />
        <TimeRangeButton
          onClick={this.props.onChange}
          range={TimeRange.HOUR}
          value={this.props.active}
          key={TimeRange.HOUR}
        />
        <TimeRangeButton
          onClick={this.props.onChange}
          range={TimeRange.THREE_HOURS}
          value={this.props.active}
          key={TimeRange.THREE_HOURS}
        />
      </div>
    )
  }
}
export default TimeRangeShortToolbar

import { Classes } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import TimeRangeButton from 'src/components/TimeRangeToolbar/internal/TimeRangeButton'
import { TimeRangeToolbarProps } from 'src/components/TimeRangeToolbar/internal/types'
import { TimeRange } from 'src/store/metrics/metrics-model'

class TimeRangeLongToolbar extends React.Component<TimeRangeToolbarProps> {
  render() {
    return (
      <div className={classes(Classes.BUTTON_GROUP, this.props.className)}>
        <TimeRangeButton
          onClick={this.props.onChange}
          range={TimeRange.HOUR}
          value={this.props.active}
          key={TimeRange.HOUR}
        />
        <TimeRangeButton
          onClick={this.props.onChange}
          range={TimeRange.TWO_HOURS}
          value={this.props.active}
          key={TimeRange.TWO_HOURS}
        />
        <TimeRangeButton
          onClick={this.props.onChange}
          range={TimeRange.SIX_HOURS}
          value={this.props.active}
          key={TimeRange.SIX_HOURS}
        />
        <TimeRangeButton
          onClick={this.props.onChange}
          range={TimeRange.TWELVE_HOURS}
          value={this.props.active}
          key={TimeRange.TWELVE_HOURS}
        />
        <TimeRangeButton
          onClick={this.props.onChange}
          range={TimeRange.DAY}
          value={this.props.active}
          key={TimeRange.DAY}
        />
        <TimeRangeButton
          onClick={this.props.onChange}
          range={TimeRange.WEEK}
          value={this.props.active}
          key={TimeRange.WEEK}
        />
        <TimeRangeButton
          onClick={this.props.onChange}
          range={TimeRange.MONTH}
          value={this.props.active}
          key={TimeRange.MONTH}
        />
      </div>
    )
  }
}
export default TimeRangeLongToolbar

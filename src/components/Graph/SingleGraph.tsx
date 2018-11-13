import { Button, Classes, IconClasses, Tooltip } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import { MetricObj } from 'src/components/Graph/internal/types'
import withGraphFilters, { GraphFiltersInjectedProps } from 'src/components/Graph/withGraphFilters'
import InlineDialog from 'src/components/InlineDialog/InlineDialog'
import TimeRangeLongToolbar from 'src/components/TimeRangeToolbar/TimeRangeLongToolbar'
import { TimeRange } from 'src/store/metrics/metrics-model'

interface SingleGraphProps extends GraphFiltersInjectedProps {
  metricObj: MetricObj
  onUpdateTimeRange: (metricObj: MetricObj) => void
  onRefresh: (metricObj: MetricObj) => void
  className?: string
}

class SingleGraph extends React.Component<SingleGraphProps> {
  defaultTimeRange = TimeRange.HOUR

  componentDidUpdate(oldProps: SingleGraphProps) {
    if (oldProps.timeRange !== this.props.timeRange) {
      this.props.setTimeRange(this.props.timeRange)
    }
  }

  componentDidMount() {
    // reset time range in url
    if (this.props.timeRange !== this.defaultTimeRange) {
      this.props.setTimeRange(this.defaultTimeRange)
      return
    }

    this.props.onUpdateTimeRange({ ...this.props.metricObj, timeRange: this.props.timeRange })
  }

  componentWillReceiveProps(nextProps: SingleGraphProps) {
    if (nextProps.timeRange !== this.props.timeRange) {
      this.props.onUpdateTimeRange({ ...this.props.metricObj, timeRange: nextProps.timeRange })
    }
  }

  // this function was created, to reset time when dialog is closed
  closeDialogAndResetTime(isDialogOpen: boolean, closeCallback: () => void) {
    return () => {
      if (!isDialogOpen) return
      this.props.setTimeRange(this.defaultTimeRange)
      closeCallback()
    }
  }

  refreshMetric = () => {
    this.props.onRefresh(this.props.metricObj)
  }

  render() {
    const { children, className, metricObj, setTimeRange } = this.props
// console.log('SingleGraph.render(), className: %o', className)
    return (
      <InlineDialog className={this.props.className}>
        {({ closeDialog, isDialogOpen, openDialog }) => (
          <div
            className={classes('single-graph', className, isDialogOpen && 'dialog-open')}
            onClick={openDialog}
          >
            <div className="single-graph-header">
              <div className="single-graph-header-left">
                <span className="graph-name">{metricObj.metric.label}</span>
                <span className="graph-unit">({metricObj.metric.unit})</span>
              </div>
              <div className="single-graph-header-right">
                <div className="single-graph-fullscreen-operations">
                  <TimeRangeLongToolbar active={this.props.timeRange} onChange={setTimeRange} />
                  <div className="single-graph-operations">
                    <Button iconName={IconClasses.REFRESH} onClick={this.refreshMetric}>
                      Refresh
                    </Button>
                  </div>
                </div>
                <div className="single-graph-operations">
                  <Tooltip content={isDialogOpen ? 'Close' : 'Fullscreen'}>
                    <Button
                      iconName={isDialogOpen ? IconClasses.CROSS : IconClasses.FULLSCREEN}
                      className={Classes.MINIMAL}
                      onClick={this.closeDialogAndResetTime(isDialogOpen, closeDialog)}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className={classes('single-graph-visualization', className, metricObj.metric.label)}>{children}</div>
          </div>
        )}
      </InlineDialog>
    )
  }
}

export default withGraphFilters((props: SingleGraphProps) => props.metricObj.metric.name)(
  SingleGraph
)

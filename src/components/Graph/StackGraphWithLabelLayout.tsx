// import { Button } from '@blueprintjs/core'
import classes from 'classnames'
import _last from 'lodash-es/last'
import * as React from 'react'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import { getStackMetrics } from 'src/components/Graph/GraphData'
import StackGraph, { StackGraphProps } from 'src/components/Graph/internal/StackGraph'
import { Metric, MetricsActions, TimeSeries } from 'src/components/Graph/internal/types'
import { getStepBaseOnTimeRange } from 'src/components/Graph/internal/utils'
import { namespaceUrl, pipelineUrl, topicUrl } from 'src/routes'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import { StackQueryMetricGroup, TimeRange } from 'src/store/metrics/metrics-model'
import {
  getStackMetricsIsLoading,
  getStackMetricsLoadingError,
} from 'src/store/metrics/metrics-reducer'
import { stackQueryEncoder } from 'src/store/metrics/query-encoders'
import { State } from 'src/store/root-reducer'
import { formatDecimal } from 'src/util/formating'
import { assertUnreachable } from 'src/util/misc'

export interface StackGraphOwnDataProps {
  className?: string
  groupBy: StackQueryMetricGroup
  metric: Metric
  timeRange: TimeRange
  refreshInterval?: number
  hideGridlines?: boolean
  hideYAxis?: boolean
  disableInteractions?: boolean
}

interface StackGraphWithLabelProps
  extends MetricsActions,
    StackGraphProps,
    StackGraphOwnDataProps {}

interface StackGraphWithLabelLayoutState {
  labels: string[]
  isAvg: boolean
}

interface LabelItemProps {
  label: string
  value: number | string
  stripeColor: string
  urlFn: typeof pipelineUrl
}

class StackGraphWithLabelLayout extends React.Component<
  StackGraphWithLabelProps,
  StackGraphWithLabelLayoutState
> {
  state = {
    labels: [],
    isAvg: false,
  }

  static buildQuery({ groupBy, metric, timeRange, refreshInterval }: StackGraphWithLabelProps) {
    return {
      step: getStepBaseOnTimeRange(timeRange),
      metric: metric.name,
      id: groupBy,
      completePayload: true,
      timeRange,
      autoRefresh:
        refreshInterval && refreshInterval > 0 ? { interval: refreshInterval } : undefined,
    }
  }

  componentWillUpdate(nextProps: StackGraphWithLabelProps) {
    const { groupBy, metric, timeRange, refreshInterval } = nextProps
    if (
      groupBy !== this.props.groupBy ||
      metric !== this.props.metric ||
      timeRange !== this.props.timeRange ||
      refreshInterval !== this.props.refreshInterval
    ) {
      if (this.props.refreshInterval) this.cancelAutoRefresh(this.props)
      this.requestMetrics(nextProps)
    }
  }

  componentDidMount() {
    this.requestMetrics(this.props)
  }

  componentWillUnmount() {
    if (this.props.refreshInterval) this.cancelAutoRefresh(this.props)
  }

  requestMetrics(props: StackGraphWithLabelProps) {
    this.props.triggerStackQueryMetrics(StackGraphWithLabelLayout.buildQuery(props))
  }

  cancelAutoRefresh(props: StackGraphWithLabelProps) {
    this.props.cancelQueryAutoRefresh({
      encodedValue: stackQueryEncoder(StackGraphWithLabelLayout.buildQuery(props)),
    })
  }

  getAvg = (dataset: TimeSeries[]): number => {
    return parseFloat(
      formatDecimal(
        dataset.reduce((acum, timeSeries) => (acum += timeSeries[1]), 0) / dataset.length,
        3
      )
    )
  }

  getCurrent = (dataset: TimeSeries[]): number => {
    return parseFloat(formatDecimal(_last(dataset)![1], 3))
  }

  getUrlFn = (groupBy: StackQueryMetricGroup) => {
    switch (groupBy) {
      case StackQueryMetricGroup.PIPELINE:
        return pipelineUrl
      case StackQueryMetricGroup.NAMESPACE:
        return namespaceUrl
      case StackQueryMetricGroup.TOPIC:
        return topicUrl
      default:
        return assertUnreachable(groupBy)
    }
  }

  toggleValueType = () => {
    this.setState(prevState => ({ isAvg: !prevState.isAvg }))
  }

  render() {
    const { error, isLoading, groupBy,
      // metric,
      showLoadingIndicator, className, hideGridlines, hideYAxis, disableInteractions } = this.props
    let { dataSets } = this.props
    const { isAvg } = this.state
    const urlFn = this.getUrlFn(groupBy)
    const getValue = isAvg ? this.getAvg : this.getCurrent

    // TODO: [ofer: 6-Mar-18]: Do this at a lower level??
    dataSets = dataSets.map(ds => {
      ds.values = ds.values.map(dsv => {
        dsv.metadata.label = dsv.metadata.label.replace('persistent://', '')
        return dsv
      })
      return ds
    })
    return (
      <div className={`stack-graph-with-label ${className}`}>
        <div className="stack-graph-with-label-items-wrapper">
          {/* <div className="stack-graph-with-label-items-header">
            <Button className="button-tab" onClick={this.toggleValueType} active={!isAvg}>
              Current
            </Button>
            <Button className="button-tab" onClick={this.toggleValueType} active={isAvg}>
              Average
            </Button>
          </div> */}
          <div className="stack-graph-with-label-items">
            {dataSets
              .sort(
                (dataSetA, dataSetB) =>
                  getValue(dataSetB.values[0].dataset) - getValue(dataSetA.values[0].dataset)
              )
              .map(dataSet => (
                <LabelItem
                  value={getValue(dataSet.values[0].dataset)}
                  label={(dataSet.metric as any)[groupBy]}
                  key={(dataSet.metric as any)[groupBy]}
                  urlFn={urlFn}
                  stripeColor={dataSet.values[0].metadata.className}
                />
              ))}
          </div>
        </div>
        <div className="stack-graph-with-label-graphs-wrapper">
          {/* <div className="stack-graph-with-label-graph-header">
            <span className="graph-name">Top 10 {metric.label}</span>
          </div> */}

          <div className="stack-graph-with-label-graph">
            <StackGraph
              hideGridlines={hideGridlines}
              hideYAxis={hideYAxis}
              disableInteractions={disableInteractions}
              dataSets={dataSets}
              error={error}
              isLoading={isLoading}
              showLoadingIndicator={showLoadingIndicator}
              xAxisHeight="25px"
            />
          </div>
        </div>
      </div>
    )
  }
}

const LabelItem: React.SFC<LabelItemProps> = ({ value, label, stripeColor, urlFn }) => {
  label = label.replace('persistent://', '') // TODO: [ofer: 5-Mar-18]: Do this at a lower level??
  return (
    <div className="label-item-wrap">
      {/* todo: ids are different than prometheus implementation*/}
      {/* todo: replace div "label-item" with <Link /> "label-item" once id's and prometheus labels are unified*/}
      {/* <Link className="label-item" to={urlFn({ id: '/x/x/x' })}> */}
      <div className="label-item">
        <div className="color">
          <span className={classes('circle', stripeColor)} />{' '}
        </div>
        <div className="name">{label}</div>
        <div className="value">{value}</div>
      </div>
      {/* </Link> */}
    </div>
  )
}

export default connect(() => {
  const selector = getStackMetrics()

  return (state: State, { groupBy, metric, timeRange }: StackGraphOwnDataProps) => {
    const query = {
      metric: metric.name,
      step: getStepBaseOnTimeRange(timeRange),
      id: groupBy,
      completePayload: true,
      timeRange,
    }

    return {
      dataSets: selector(state, query),
      isLoading: getStackMetricsIsLoading(state, query),
      error: getStackMetricsLoadingError(state, query),
    }
  }
}, metricsActions)(StackGraphWithLabelLayout)

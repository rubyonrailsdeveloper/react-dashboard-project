import classes from 'classnames'
import * as React from 'react'
import { MetricObj } from 'src/components/Graph/internal/types'
import MultipleGraphs, { MultipleGraphsItem } from 'src/components/Graph/MultipleGraphs'
import TimeRangeShortToolbar from 'src/components/TimeRangeToolbar/TimeRangeShortToolbar.tsx'
import { NestedId } from 'src/store/constants'
import { TimeRange } from 'src/store/metrics/metrics-model'

export interface GraphToRender {
  title: string | null
  metricsToRender: MetricObj[]
}

type LayoutGeneratorBaseProps<GraphProps, MetricsConnect> = MetricsConnect &
  NestedId & {
    children: (props: GraphProps) => React.ReactNode
    graphsToRender: GraphToRender[]
    timeRange: TimeRange
    noInteractions?: boolean
  }

interface HideToolbar {
  hideToolbar: boolean
  onTimeRangeChange?: never
}

interface OnTimeRangeChange {
  hideToolbar?: never
  onTimeRangeChange: (timeRange: TimeRange) => void
}

type OneofHideToolbarOrTimeRangeChange = HideToolbar | OnTimeRangeChange

type LayoutGeneratorProps<GraphProps, MetricsConnect> = LayoutGeneratorBaseProps<
  GraphProps,
  MetricsConnect
> &
  OneofHideToolbarOrTimeRangeChange

interface PartialGraphProps {
  graphsToRender: GraphToRender[]
  [k: string]: any
}

// Because the complexity of generic interfaces used to create this component
// This has to be created as a HOC
const makeMultipleGraphsLayout = <GraphProps, MetricsConnect>(): React.SFC<
  LayoutGeneratorProps<GraphProps, MetricsConnect>
> => {
  return ({
    children,
    graphsToRender,
    hideToolbar,
    noInteractions,
    ...props
  }: PartialGraphProps) => {
    return (
      <div className="dashboard-graphs">
        <div className={classes('dashboard-graphs-toolbar', hideToolbar && 'hide')}>
          <h4>Metrics</h4>
          <TimeRangeShortToolbar onChange={props.onTimeRangeChange} active={props.timeRange} />
        </div>

        {graphsToRender.map(({ metricsToRender, title }, i) => (
          <MultipleGraphs title={title} key={i} noInteractions={noInteractions}>
            {multipleGraphsProps =>
              metricsToRender.map((metricToRender, j, arr) => (
                <MultipleGraphsItem
                  metric={metricToRender.metric}
                  key={j}
                  icon={metricToRender.icon}
                  className={metricToRender.className}
                >
                  {multipleGraphsItemProps =>
                    (children as any)({
                      ...props,
                      ...multipleGraphsProps,
                      ...multipleGraphsItemProps,
                      maxValue: metricToRender.maxValue,
                      hasXAxis: j === arr.length - 1,
                    })
                  }
                </MultipleGraphsItem>
              ))
            }
          </MultipleGraphs>
        ))}
      </div>
    )
  }
}

export default makeMultipleGraphsLayout

import { Icon } from '@blueprintjs/core'
import Plottable from 'plottable'
import { Time } from 'plottable/build/src/scales'
import * as React from 'react'
import { addSyncPointerInteraction } from 'src/components/Graph/internal/GraphInteractions'
import { LineGraphOwnProps } from 'src/components/Graph/internal/LineGraph'
import { GraphComponents, Metric } from 'src/components/Graph/internal/types'
import InfoTooltip from 'src/components/InfoTooltip/InfoTooltip'

interface MultipleGraphsProps {
  children: (props: LineGraphOwnProps) => React.ReactNode
  title: string | null
  noInteractions?: boolean
}

interface ChildrenProps {
  metric: Metric
}

interface MultipleGraphsItemProps {
  children: (props: ChildrenProps) => React.ReactNode
  icon?: React.ReactElement<Icon>
  metric: Metric
  className?: string
}

export const MultipleGraphsItem: React.SFC<MultipleGraphsItemProps> = ({
  icon,
  metric,
  children,
  className
}) => {
  const { description, label, unit } = metric
  // console.log(4444444);
  // console.log(metric);

  return (
    <div className="multiple-graphs-visualizations-item">
      <div className="multiple-graphs-visualizations-item-label">
        <div className="label-text">
          {icon && <span className="graph-icon">{icon}</span>}
          <span className="graph-name-wrapper">
            <span className="graph-name">{label}</span>
            <span className="graph-unit">({unit})</span>
          </span>
        </div>
        {description && <InfoTooltip title={label} body={description} />}
      </div>
      <div className="multiple-graphs-visualizations-item-graph">{children({ metric })}</div>
    </div>
  )
}

class MultipleGraphs extends React.Component<MultipleGraphsProps> {
  static graphConfig = {
    graphHeight: '50px',
    hasDots: true,
    xAxisHeight: '25px',
    hasPointerInteraction: true
  }
  graphsToSync: GraphComponents[] = []
  xScale: Time = new Plottable.Scales.Time()

  // Since children componentDidMount is dispatched first, based on current React implementation,
  // It's correct to asume that this function will run after all its children are mounter
  componentDidMount() {
    if (this.props.noInteractions) return
    this.graphsToSync.forEach(({ plot }) => addSyncPointerInteraction(plot, this.graphsToSync))
  }

  addToSyncArr = (grapComponents: GraphComponents) => {
    this.graphsToSync.push(grapComponents)
  }

  render() {
    const { children, title } = this.props

    return (
      <div className="multiple-graphs">
        {title && <div className="multiple-graphs-header">{title}</div>}
        <div className="multiple-graphs-visualizations">
          {children({
            onMount: this.addToSyncArr,
            xScale: this.xScale,
            ...MultipleGraphs.graphConfig,
            className: 'graph-line-metric-rate-in'
          })}
        </div>
      </div>
    )
  }
}

export default MultipleGraphs

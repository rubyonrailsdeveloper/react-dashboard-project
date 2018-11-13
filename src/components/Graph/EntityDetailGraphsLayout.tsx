import { Button, IconClasses } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import { EntityDetailGraphChildrenProps, MetricObj } from 'src/components/Graph/internal/types'
import { GraphCategory } from 'src/components/Graph/internal/types'
import SingleGraph from 'src/components/Graph/SingleGraph'
import { CategoryToolbarProps } from 'src/components/GraphsCategoryToolbar/internal/CategoryToolbar'

interface EntityDetailGraphsLayoutProps {
  categoryToolbar: (props: CategoryToolbarProps) => React.ReactNode
  children: (props: EntityDetailGraphChildrenProps) => React.ReactNode
  initialCategory: GraphCategory
  metricsToRender: MetricObj[]
  onHardRefresh: (metricObj?: MetricObj) => void
  onUpdateCategory: (newActiveCategory: GraphCategory) => void
  onUpdateMetricObj: (metricObjToUpdate: MetricObj) => void
}

export default class EntityDetailGraphsLayout extends React.Component<
  EntityDetailGraphsLayoutProps
> {
  static xAxisHeight = '25px'
  static graphConfig = {
    hasDots: true,
    hasGridlines: true,
    hasPointerInteraction: true,
    hasXAxis: true,
    hasYAxis: true,
    graphHeight: `calc(100% - ${EntityDetailGraphsLayout.xAxisHeight})`,
  }

  refreshAllMetrics = () => {
    this.props.onHardRefresh()
  }

  render() {
    return (
      <div className="entity-detail-graphs">
        <div className="entity-detail-graphs-toolbar">
          {this.props.categoryToolbar({
            initialCategory: this.props.initialCategory,
            onClick: this.props.onUpdateCategory,
          })}
          <Button iconName={IconClasses.REFRESH} onClick={this.refreshAllMetrics}>
            Refresh
          </Button>
        </div>

        <div className="entity-detail-graphs-layout">
          {this.props.metricsToRender.map(metricObj => (
            <div
              className={classes('entity-detail-graphs-item', metricObj.className)}
              key={metricObj.id}
            >
              <SingleGraph
                metricObj={metricObj}
                onUpdateTimeRange={this.props.onUpdateMetricObj}
                onRefresh={this.props.onHardRefresh}
              >
                {this.props.children({
                  metric: metricObj.metric,
                  timeRange: metricObj.timeRange!,
                  ...EntityDetailGraphsLayout.graphConfig,
                  xAxisHeight: EntityDetailGraphsLayout.xAxisHeight,
                })}
              </SingleGraph>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

import * as React from 'react'
import { connect } from 'react-redux'
import { MetricsActions } from 'src/components/Graph/internal/types'
import withGraphFilters, { GraphFiltersInjectedProps } from 'src/components/Graph/withGraphFilters'
import { NodeMetrics } from 'src/scenes/NodeDetail/NodeDashboardMetrics'
import { NestedId } from 'src/store/constants'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import { NodeLimits } from 'src/store/node/node-model'

interface OwnProps extends NestedId, GraphFiltersInjectedProps {
  limits: NodeLimits
}

interface ContainerMetricsProps extends OwnProps, MetricsActions {}

const ContainerMetrics: React.SFC<ContainerMetricsProps> = props => {
  return <NodeMetrics containers={props.id} {...props} />
}

export default withGraphFilters(() => 'metrics')<OwnProps>(
  connect(null, metricsActions)(ContainerMetrics)
)

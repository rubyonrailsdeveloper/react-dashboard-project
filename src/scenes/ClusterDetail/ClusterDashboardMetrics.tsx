import * as React from 'react'
import { connect } from 'react-redux'
import { MetricsActions } from 'src/components/Graph/internal/types'
import withGraphFilters, { GraphFiltersInjectedProps } from 'src/components/Graph/withGraphFilters'
import { GroupMetrics } from 'src/scenes/GroupDetail/GroupDashboardMetrics'
import { NestedId } from 'src/store/constants'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import * as namespaceActions from 'src/store/namespace/namespace-actions'
import { Namespace } from 'src/store/namespace/namespace-model'
import { makeGetNamespacesByCluster } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'

type NamespaceActions = typeof namespaceActions

interface OwnProps extends NestedId, GraphFiltersInjectedProps {}

interface ClusterMetricsProps extends OwnProps, MetricsActions, NamespaceActions {
  namespaces: Namespace[]
  cluster: string
}

const ClusterMetrics = (props: ClusterMetricsProps) => <GroupMetrics {...props} />

export default withGraphFilters(() => 'metrics')(
  connect(
    () => {
      const filterNamespaces = makeGetNamespacesByCluster()

      return (state: State, { id }: OwnProps) => ({
        namespaces: filterNamespaces(state, { cluster: id }),
        cluster: id,
      })
    },
    { ...metricsActions, ...namespaceActions }
  )(ClusterMetrics)
)

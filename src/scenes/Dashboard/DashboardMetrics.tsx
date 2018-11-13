import * as React from 'react'
import { dashboardMetrics } from 'src/components/Graph/metrics'
import StackGraphWithLabelLayout from 'src/components/Graph/StackGraphWithLabelLayout'
import withGraphFilters, { GraphFiltersInjectedProps } from 'src/components/Graph/withGraphFilters'
import BtmPanel from 'src/components/BtmPanel/BtmPanel'
import GraphPanel from 'src/components/GraphPanel/GraphPanel'
// import TimeRangeShortToolbar from 'src/components/TimeRangeToolbar/TimeRangeShortToolbar.tsx'
import { dashboardRefreshRate } from 'src/store/constants'
import { StackQueryMetricGroup } from 'src/store/metrics/metrics-model'

const DashboardMetrics: React.SFC<GraphFiltersInjectedProps> = props => (
  <section className="dashboard-section dashboard-section-topstreams">
    {/* <div className="dashboard-graphs-toolbar">
      <TimeRangeShortToolbar onChange={props.setTimeRange} active={props.timeRange} />
    </div> */}
    <BtmPanel header="Top Pipelines By " className="dashboard-section-item dashboard-toppipelines">
      <StackGraphWithLabelLayout
        showLoadingIndicator={false}
        metric={dashboardMetrics.DASHBOARD_CPU_USED}
        groupBy={StackQueryMetricGroup.PIPELINE}
        timeRange={props.timeRange}
        refreshInterval={dashboardRefreshRate}
        hideGridlines={false}
        hideYAxis={false}
        disableInteractions={true}
      />
    </BtmPanel>

    <GraphPanel header="Top Topics By " className="dashboard-section-item dashboard-toppipelines">
      <StackGraphWithLabelLayout
        metric={dashboardMetrics.TOPIC_BACKLOG}
        groupBy={StackQueryMetricGroup.TOPIC}
        showLoadingIndicator={false}
        timeRange={props.timeRange}
        refreshInterval={dashboardRefreshRate}
        hideGridlines={false}
        hideYAxis={false}
        disableInteractions={true}
      />
    </GraphPanel>
  </section>
)

export default withGraphFilters(() => 'metrics')(DashboardMetrics)

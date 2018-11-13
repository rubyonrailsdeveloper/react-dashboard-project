import * as React from 'react'
import { Metric } from 'src/components/Graph/internal/types' // , MetricsActions, TimeSeries
import Panel from 'src/components/Panel/Panel'
import { StackQueryMetricGroup, TimeRange } from 'src/store/metrics/metrics-model'

interface TopByPanelProps {
  limit?: number
  showLoadingIndicator?: boolean
  groupBy: StackQueryMetricGroup
  metric: Metric
  timeRange: TimeRange
  refreshInterval?: number
}

class TopByPanel extends React.Component<TopByPanelProps> {
  render() {
    return (
      <Panel header={`Top [] By [] []`} className="top-by-panel">
        <div>[list of items]</div>
        <div>[Graph]</div>
      </Panel>
    )
  }
}

export default TopByPanel

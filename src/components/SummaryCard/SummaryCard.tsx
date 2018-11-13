import * as React from 'react'
import DashboardSummary, { HealthCount } from 'src/components/DashboardSummary/DashboardSummary'
import Card from 'src/components/Panel/Card'
import { Health } from 'src/store/constants'

interface SummaryCardProps {
  header: string | React.ReactNode
  healthSummary: WithHealth[] | null
  to?: string
  className?: string
}

export interface WithHealth {
  health: Health
}

interface SummaryCardState {
  healthCounts: HealthCount
}

export default class SummaryCard extends React.Component<SummaryCardProps, SummaryCardState> {
  render() {
    return (
      <Card header={this.props.header} {...this.props}>
        <DashboardSummary healthSummary={this.props.healthSummary} />
      </Card>
    )
  }
}

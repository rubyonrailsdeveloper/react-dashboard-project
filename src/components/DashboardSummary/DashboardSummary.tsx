import { Tooltip } from '@blueprintjs/core'
import countBy from 'lodash-es/countBy'
import omit from 'lodash-es/omit'
import orderBy from 'lodash-es/orderBy'
import sum from 'lodash-es/sum'
import * as React from 'react'
import LabeledStatusCounter from 'src/components/LabeledStatusCounter/LabeledStatusCount'
import { WithHealth } from 'src/components/SummaryCard/SummaryCard'
import { Health, healthSortWeight } from 'src/store/constants'

interface ItemsStatusSummaryProps {
  healthSummary: WithHealth[] | null
}

export type HealthCount = { [H in Health]?: number }

class ItemsStatusSummary extends React.Component<ItemsStatusSummaryProps> {
  state = { healthCounts: ItemsStatusSummary.getStatusCount(this.props.healthSummary) }

  static getStatusCount(healthSummary: WithHealth[] | null) {
    return countBy(healthSummary, ({ health }) => health)
  }

  componentWillReceiveProps({ healthSummary }: ItemsStatusSummaryProps) {
    if (healthSummary !== this.props.healthSummary)
      this.setState({ healthCounts: ItemsStatusSummary.getStatusCount(healthSummary) })
  }

  render() {
    const { healthCounts } = this.state
    const total = sum(Object.values(healthCounts))
    const healthOrder: Health[] = orderBy(
      Object.keys(omit(healthCounts, Health.OK)) as Health[],
      healthSortWeight,
      'desc'
    )
    return (
      <dl className="summary-list">
        <Tooltip content="Total">
          <dt className="summary-list-total labeled-status">
            <span className="labeled-status-label">{total}</span>
          </dt>
        </Tooltip>
        {healthOrder.map(health => (
          <LabeledStatusCounter key={health} health={health} count={healthCounts[health]!} />
        ))}
      </dl>
    )
  }
}

export default ItemsStatusSummary

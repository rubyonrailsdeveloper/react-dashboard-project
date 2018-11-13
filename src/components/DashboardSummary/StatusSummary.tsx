import { Tooltip } from '@blueprintjs/core'
import * as React from 'react'
import LabeledStatusCounter from 'src/components/LabeledStatusCounter/LabeledStatusCount'
import { Health } from 'src/store/constants'

interface ItemsStatusSummaryProps {
  count: StatusCount
}

interface StatusCount {
  total: number
  warning: number
  failing: number
}


class StatusSummary extends React.Component<ItemsStatusSummaryProps> {
  render() {
    const { count: {total, warning, failing} } = this.props
    return (
      <dl className="summary-list">
        <Tooltip content="Total">
          <dt className="summary-list-total labeled-status">
            <span className="labeled-status-label">{total}</span>
          </dt>
        </Tooltip>
        {warning && <LabeledStatusCounter health={Health.UNHEALTHY} count={warning} />}
        {failing && <LabeledStatusCounter health={Health.FAILING} count={failing} />}
      </dl>
    )
  }
}

export default StatusSummary

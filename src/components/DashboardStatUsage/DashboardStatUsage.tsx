import { Intent, Spinner } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import Card from 'src/components/Panel/Card'
import { formatDecimal, formatPercentage } from 'src/util/formating'

interface DashboardStatUsageProps {
  title: string
  unit: string
  used: number | null
  quota: number | null
  containerQuota?: number
  isLoading: boolean
}
// todo: check if this should be normalized with the table small charts
const percentageToIntent: (percentage: number) => Intent = percentage => {
  if (percentage < 0.6) {
    return Intent.SUCCESS
  } else if (percentage < 0.8) {
    return Intent.WARNING
  }
  return Intent.DANGER
}

const DashboardStatUsage: React.SFC<DashboardStatUsageProps> = ({
  title,
  unit,
  quota,
  used,
  containerQuota,
  isLoading,
}) => {
  const ratio = used && quota && used / quota
  const footer = containerQuota && (
    <dl className="stat-usage-footer">
      <dd>Quota per container:</dd>
      <dt>{`${containerQuota} ${unit}`}</dt>
    </dl>
  )
  const loading = ratio === null && isLoading

  return (
    <Card footer={footer}>
      <div className="stat-usage-info">
        <header className="stat-usage-header">{title}</header>
        <div className="stat-usage-values">
          <div className={classes('stat-usage-percentage', loading && 'pt-skeleton')}>
            {ratio ? formatPercentage(ratio) : '-'}
          </div>
          <div className={classes('stat-usage-ratio', loading && 'pt-skeleton')}>
            {`${used ? formatDecimal(used) : '-'}/${quota ? formatDecimal(quota) : '-'} ${unit}`}
          </div>
        </div>
      </div>
      <Spinner
        className="stat-usage-chart"
        value={loading ? undefined : ratio || 0}
        intent={loading ? undefined : percentageToIntent(ratio || 0)}
      />
    </Card>
  )
}

export default DashboardStatUsage

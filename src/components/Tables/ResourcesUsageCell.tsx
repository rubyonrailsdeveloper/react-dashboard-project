import { Classes, Intent } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import PieChartIcon from 'src/components/Symbols/PieChartIcon'
import { formatPercentage } from 'src/util/formating'

interface ResourcesUsageCellProps {
  metrics: MetricsTuple[]
}

export interface MetricsTuple {
  label?: string
  value: number | null
}

const ResourcesUsageCell: React.SFC<ResourcesUsageCellProps> = ({ metrics }) => (
  <div className="resources-usage-cell">
    {metrics.map(({ label, value }, key) => (
      <div key={key} className="resources-usage-cell-row">
        {label && <div className="resources-usage-cell-name">{label}</div>}
        {value !== null ? (
          <div
            className={classes(
              value >= 0.75 && Classes.intentClass(Intent.DANGER),
              'resources-usage-cell-value'
            )}
          >
            {formatPercentage(value)}
            <PieChartIcon value={value} />
          </div>
        ) : (
          '-'
        )}
      </div>
    ))}
  </div>
)

export default ResourcesUsageCell

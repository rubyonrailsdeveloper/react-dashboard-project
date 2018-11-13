import { Icon, IconName, Tooltip } from '@blueprintjs/core'
import * as React from 'react'

interface RatesCellProps {
  rates: RateCellData[]
}

export interface RateCellData {
  icon: IconName
  value: number | string
  secondary?: boolean
  title: string
}

const RatesCell: React.SFC<RatesCellProps> = ({ rates }) => (
  <div className="inputs-outputs-cell">
    {rates.map((rate, key) => (
      <Tooltip key={key} content={`${rate.value} ${rate.title}`}>
        <div className={`rates-cell${rate.secondary && '-secondary'}`}>
          {rate.value}
          <Icon iconName={rate.icon} />
        </div>
      </Tooltip>
    ))}
  </div>
)

export default RatesCell

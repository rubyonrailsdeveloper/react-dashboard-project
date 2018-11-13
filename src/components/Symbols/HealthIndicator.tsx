import { Tooltip } from '@blueprintjs/core'
import upperFirst from 'lodash-es/upperFirst'
import * as React from 'react'
import { healthClass } from 'src/constants'
import { Health } from 'src/store/constants'

export interface HealthIndicatorProps {
  health: Health
  labeled?: boolean
}

const HealthIndicator: React.SFC<HealthIndicatorProps> = ({ health, labeled }) =>
  labeled ? (
    <Tooltip content={upperFirst(health)} className="health-indicator">
      <span className={`health-indicator-icon ${healthClass(health)}`} />
    </Tooltip>
  ) : (
    <span className="health-indicator">
      <span className={`health-indicator-icon ${healthClass(health)}`} />
    </span>
  )

HealthIndicator.defaultProps = {
  labeled: true,
}

export default HealthIndicator

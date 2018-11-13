import { Tooltip } from '@blueprintjs/core'
import upperFirst from 'lodash-es/upperFirst'
import * as React from 'react'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import { healthClass } from 'src/constants'
import { Health } from 'src/store/constants'

interface LabeledStatusCounterProps {
  count: number
  health: Health
  label?: string | JSX.Element
}

const LabeledStatusCounter: React.SFC<LabeledStatusCounterProps> = ({ count, health, label }) => (
  <Tooltip content={label ? label : upperFirst(health)}>
    <dt className="labeled-status">
      <HealthIndicator health={health} labeled={false} />
      <span className={`${healthClass(health)} labeled-status-label`}>{count}</span>
    </dt>
  </Tooltip>
)

export default LabeledStatusCounter

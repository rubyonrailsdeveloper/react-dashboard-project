import * as React from 'react'
import { ContainerLike } from 'src/components/ContainerGrid/internal/types'

interface ContainerTooltipProps {
  container: ContainerLike
}

const ContainerTooltip: React.SFC<ContainerTooltipProps> = ({ container }) => (
  <div>
    <div className="container-tooltip-name">{container.id}</div>
    <div className="container-tooltip-instances">
      <b>{container.instances.length}</b> instances
    </div>
  </div>
)

export default ContainerTooltip

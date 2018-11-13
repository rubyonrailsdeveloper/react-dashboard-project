import * as React from 'react'
import { SquareGridLayout } from 'src/components/ContainerGrid/internal/square-grid-layout'
import { InstanceLike } from 'src/components/ContainerGrid/internal/types'
import { healthClass } from 'src/constants'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'


interface InstancesGridVizProps {
  instances: InstanceLike[]
  filterType: PhysicalPlanFilter
  filterValue: string
  layoutBuilder: SquareGridLayout
  padding: number
}

export class InstancesGridViz extends React.PureComponent<InstancesGridVizProps> {
  render() {
    const { instances, layoutBuilder, padding, filterValue } = this.props

    const layout = layoutBuilder(instances.length)
    const scale = 0.6
    const side = layout.length ? layout[0].side : 0
    const center = -(side / 2) * (scale - 1)
    const delta = padding + center

    // We need to find if any instances are filtered, if they are, we should mute the others
    const someFound = instances.some(n => n.name === filterValue)
    const instanceClassList: string[] = instances.map(n => someFound && n.name !== filterValue ? 'is-muted' : '')

    return layout.map((pos, i) => {
      const instance = instances[i]
      return (
        <rect
          key={instance.id}
          width={pos.side}
          height={pos.side}
          rx={pos.side / 2}
          ry={pos.side / 2}
          className={`instance-viz ${instanceClassList[i]} ${healthClass(instance.health)}`}
          transform={`translate(${pos.x + delta}, ${pos.y + delta}) scale(${scale})`}
        />
      )
    })
  }
}

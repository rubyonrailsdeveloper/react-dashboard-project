import { SVGTooltip } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import { Omit } from 'react-redux'
import ContainerTooltip from 'src/components/ContainerGrid/ContainerTooltip'
import { InstancesGridViz } from 'src/components/ContainerGrid/internal/InstancesGridViz'
import { SquareGridLayout } from 'src/components/ContainerGrid/internal/square-grid-layout'
import { ContainerLike } from 'src/components/ContainerGrid/internal/types'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'

interface ContainerGridItemProps extends Omit<React.SVGProps<SVGGElement>, 'onClick'> {
  container: ContainerLike
  filterType: PhysicalPlanFilter
  filterValue: string
  isHighlighted: boolean
  width: number
  height: number
  layoutBuilder: SquareGridLayout
  padding: number
  onClick: ContainerEventHandler
}

export type ContainerEventHandler = (c: ContainerLike) => void

export default class ContainerGridItem extends React.Component<ContainerGridItemProps> {
  handleOnClick = () => {
    this.props.onClick(this.props.container)
  }

  render() {
    const {
      width,
      height,
      container,
      filterType,
      filterValue,
      isHighlighted,
      layoutBuilder,
      padding,
      ...gProps
    } = this.props

    return (
      <SVGTooltip
        tooltipClassName="container-tooltip"
        hoverOpenDelay={250}
        content={<ContainerTooltip container={container} />}>
        <g className={classes('container-viz-g', isHighlighted && 'is-highlighted')}
          {...gProps}
          onClick={this.handleOnClick}>
          <rect
            className="container-viz"
            height={height}
            width={width}
            rx={width / 25}
            ry={width / 25}
          />
          <InstancesGridViz
            instances={container.instances}
            filterType={filterType}
            filterValue={filterValue}
            layoutBuilder={layoutBuilder}
            padding={padding}
          />
        </g>
      </SVGTooltip>
    )
  }
}

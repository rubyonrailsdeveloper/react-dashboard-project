import { Slider } from '@blueprintjs/core'
import { zoomIdentity, ZoomTransform } from 'd3-zoom'
import * as React from 'react'
import { ContainerEventHandler } from 'src/components/ContainerGrid/internal/ContainerGridItem'
import ContainerGridView, {
  ContainerGridViewOwnProps,
} from 'src/components/ContainerGrid/internal/ContainerGridView'
import { defaultMaxSide } from 'src/components/ContainerGrid/internal/square-grid-layout'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'

export interface ContainerGridWidgetProps {
  containers: ContainerGridViewOwnProps['containers']
  highlightedContainers: ContainerGridViewOwnProps['highlightedContainers']
  onContainerClick: ContainerEventHandler
  filterType: PhysicalPlanFilter
  filterValue: string
}

interface ContainerGridWidgetState {
  transform: ZoomTransform
  zoomEnabled: boolean
}

const ZOOM_MIN = 1
const ZOOM_MAX = 6

export default class ContainerGridWidget extends React.Component<
  ContainerGridWidgetProps,
  ContainerGridWidgetState
> {
  state = {
    transform: zoomIdentity,
    zoomEnabled: false,
  }

  width: number = 0
  height: number = 0

  handleOnZoom = (transform: ZoomTransform) => {
    if (this.state.zoomEnabled) this.setState({ transform })
  }

  handleOnSliderChange = (k: number) => {
    this.setState(({ transform }) => {
      const p0: [number, number] = [this.width / 2, this.height / 2]
      const p1 = transform.invert(p0)
      const x = p0[0] - p1[0] * k
      // Uncomment this line to zoom from the center vertically
      // const y = p0[1] - p1[1] * k

      return {
        transform: zoomIdentity.translate(x, 0).scale(k),
      }
    })
  }

  handleSizeChange = (width: number, height: number) => {
    this.width = width
    this.height = height
  }

  handleContainerSideChange = (side: number) => {
    this.setState({ zoomEnabled: side < defaultMaxSide })
  }

  render() {
    const { containers, highlightedContainers, onContainerClick, filterType, filterValue } = this.props
    const { transform, zoomEnabled } = this.state
    return [
      <ContainerGridView
        onSizeChange={this.handleSizeChange}
        key={0}
        containers={containers}
        highlightedContainers={highlightedContainers}
        filterType={filterType}
        filterValue={filterValue}
        transform={transform}
        zoomMin={ZOOM_MIN}
        zoomMax={ZOOM_MAX}
        onZoom={this.handleOnZoom}
        onContainerClick={onContainerClick}
        onContainerSideChange={this.handleContainerSideChange}
      />,
      zoomEnabled ? (
        <div key={1} className="container-grid-zoom-slider">
          <Slider
            min={ZOOM_MIN}
            max={ZOOM_MAX}
            stepSize={0.05}
            onChange={this.handleOnSliderChange}
            renderLabel={false}
            value={transform.k}
          />
        </div>
      ) : null,
    ]
  }
}

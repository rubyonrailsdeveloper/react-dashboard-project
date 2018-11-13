import { event, select, Selection } from 'd3-selection'
import { D3ZoomEvent, zoom, ZoomBehavior, ZoomTransform } from 'd3-zoom'
import ceil from 'lodash-es/ceil'
import floor from 'lodash-es/floor'
import get from 'lodash-es/get'
import * as React from 'react'
import sizeMe, { SizeMeWithHeightInjectedProps } from 'react-sizeme'
import { ContainerEventHandler } from 'src/components/ContainerGrid/internal/ContainerGridItem'
import {
  ContainersGridViz,
  ContainersGridVizProps,
} from 'src/components/ContainerGrid/internal/ContainersGridViz'
import squareGridLayout, {
  SquareGridLayout,
  SquarePosition,
} from 'src/components/ContainerGrid/internal/square-grid-layout'
import { ContainerLike } from 'src/components/ContainerGrid/internal/types'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'

export interface ContainerGridViewOwnProps {
  containers: ContainersGridVizProps['containers']
  highlightedContainers: ContainersGridVizProps['highlightedContainers']
  filterType: PhysicalPlanFilter
  filterValue: string
  transform: ZoomTransform
  zoomMin: number
  zoomMax: number
  onZoom: (transform: ZoomTransform) => void
  onSizeChange?: (width: number, height: number) => void
  onContainerSideChange: (side: number) => void
  onContainerClick: ContainerEventHandler
}

interface ContainerGridViewState {
  layout: SquarePosition[]
  childLayoutBuilder: SquareGridLayout
  childPadding: number
}

type ContainerGridViewProps = ContainerGridViewOwnProps & SizeMeWithHeightInjectedProps

class ContainerGridView extends React.PureComponent<
  ContainerGridViewProps,
  ContainerGridViewState
> {
  static rootStyle = { padding: 8 }

  state: ContainerGridViewState = {
    ...ContainerGridView.makeLayouts(
      this.props.containers,
      this.props.size.width,
      this.props.size.height,
      []
    ),
  }

  svg: Selection<Element, {}, null, undefined>
  zoom: ZoomBehavior<Element, {}>
  updateFrame?: number

  static makeLayouts(
    containers: ContainerLike[],
    width: number,
    height: number,
    currentLayout: SquarePosition[],
    childPadding?: number,
    childLayout?: SquareGridLayout
  ) {
    const containingPadding = ContainerGridView.rootStyle.padding * 2
    const layout = squareGridLayout({
      width: width - containingPadding,
      height: height - containingPadding,
      minSide: 10,
    })

    const containersLayout = layout(containers.length)
    const childSide = containersLayout.length > 0 ? containersLayout[0].side : 0

    if (!currentLayout.length || childSide !== currentLayout[0].side) {
      childPadding = childSide * 0.02
      const childPaddedSide = childSide - childPadding * 2
      childLayout = squareGridLayout({
        width: childPaddedSide,
        height: childPaddedSide,
        minSide: 0.1,
      })
    }

    return {
      layout: containersLayout,
      childPadding: childPadding!,
      childLayoutBuilder: childLayout!,
    }
  }

  componentWillReceiveProps({ containers, size: { width, height } }: ContainerGridViewProps) {
    const sizeChanged = width !== this.props.size.width || height !== this.props.size.height

    if (sizeChanged && this.props.onSizeChange) this.props.onSizeChange(width, height)

    if (sizeChanged || containers.length !== this.props.containers.length) {
      this.setState(({ layout, childPadding, childLayoutBuilder }) => {
        return ContainerGridView.makeLayouts(
          containers,
          width,
          height,
          layout,
          childPadding,
          childLayoutBuilder
        )
      })
    }
  }

  componentDidMount() {
    this.zoom = zoom<Element, {}>()
      .filter(() => {
        return event instanceof WheelEvent ? event.altKey || event.ctrlKey : true
      })
      .wheelDelta(() => {
        const { deltaY, deltaMode } = event as WheelEvent
        return -deltaY * (deltaMode ? 120 : 1) / 130
      })
      .on('zoom', () => {
        const transform = (event as D3ZoomEvent<Element, never>).transform
        if (this.props.transform !== transform) {
          this.props.onZoom(transform)
        }
      })

    this.svg.call(this.zoom)

    this.updateZoomBehaviour()

    this.checkSideChange(null)
  }

  componentDidUpdate(oldProps: ContainerGridViewProps, oldState: ContainerGridViewState) {
    if (oldProps.transform !== this.props.transform)
      this.svg.call(this.zoom.transform, this.props.transform)

    this.updateZoomBehaviour()

    this.checkSideChange(oldState.layout[0])
  }

  updateZoomBehaviour() {
    if (this.updateFrame) cancelAnimationFrame(this.updateFrame)

    this.updateFrame = requestAnimationFrame(() => {
      const item = this.state.layout[0]
      if (!item) return

      const { size: { width, height }, zoomMin, zoomMax, transform: { k } } = this.props
      const side = item.side
      const rowHeight = ceil(this.props.containers.length / floor(width / side)) * side
      const bHeight = Math.max(rowHeight, height)
      const yTranslateFactor = 0.2 / Math.sqrt(k)
      const xTranslateFactor = yTranslateFactor * (height / width)

      this.zoom
        .scaleExtent([zoomMin, zoomMax])
        .extent([[0, 0], [width, height]])
        .translateExtent([
          [width * -xTranslateFactor, bHeight * -yTranslateFactor],
          [width * (1 + xTranslateFactor), bHeight * (1 + yTranslateFactor)],
        ])
    })
  }

  checkSideChange(oldSquare: SquarePosition | null) {
    const current = this.state.layout[0]
    const currentSide = get(current, 'side', 0)
    const oldSide = get(oldSquare, 'side', 0)
    if (oldSide !== currentSide && !isNaN(currentSide))
      this.props.onContainerSideChange(currentSide)
  }

  setSvgRef = (ref: Element | null) => (this.svg = select(ref!)!)

  render() {
    const {
      transform,
      containers,
      filterType,
      filterValue,
      highlightedContainers,
      onContainerClick,
      size: { width, height },
    } = this.props
    const { layout, childPadding, childLayoutBuilder } = this.state

    return (
      <div className="container-grid-view" style={ContainerGridView.rootStyle}>
        <svg className="container-grid-view-viz" ref={this.setSvgRef}>
          {width &&
            height && (
              <g transform={transform.toString()}>
                <ContainersGridViz
                  layout={layout}
                  containers={containers}
                  filterType={filterType}
                  filterValue={filterValue}
                  highlightedContainers={highlightedContainers}
                  childPadding={childPadding}
                  childLayoutBuilder={childLayoutBuilder}
                  onContainerClick={onContainerClick}
                />
              </g>
            )}
        </svg>
      </div>
    )
  }
}

export default sizeMe({
  monitorHeight: true,
  refreshMode: 'debounce',
  noPlaceholder: true,
  refreshRate: 16 * 3,
})<ContainerGridViewOwnProps>(ContainerGridView)

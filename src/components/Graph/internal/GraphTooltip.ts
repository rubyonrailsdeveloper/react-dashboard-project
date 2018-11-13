import classes from 'classnames'
import { GraphMetadata } from 'src/components/Graph/internal/types'
import { PurePlotsToRender } from 'src/components/Graph/internal/types'
import { formatDecimal } from 'src/util/formating'

export default class GraphTooltip {
  static metricNameClass = 'metric-name'
  static metricValueClass = 'metric-value'
  private tooltip: d3.Selection<any, any, any, any>
  private fixed: boolean

  constructor(plot: PurePlotsToRender, fixed: boolean = false) {
    this.tooltip = plot
      .rootElement()
      .select('.component.component-group')
      .append('div')
      .attr('class', classes('graph-tooltip', fixed && 'fixed'))

    this.tooltip.append('div').attr('class', GraphTooltip.metricNameClass)

    this.tooltip.append('div').attr('class', GraphTooltip.metricValueClass)

    this.fixed = fixed
  }

  static pixelStringToNumber(pixel: string) {
    return parseInt(pixel.replace('px', ''), 10)
  }

  hide() {
    this.tooltip.style('display', 'none')
  }

  update(
    parentWidth: string,
    parentHeight: string,
    x: number,
    y: number,
    data: number,
    metadata: GraphMetadata
  ) {
    this.updateValues(data, metadata)
    this.updateWidth(parentWidth)
    this.updatePosition(
      GraphTooltip.pixelStringToNumber(parentWidth),
      GraphTooltip.pixelStringToNumber(parentHeight),
      x,
      y
    )
  }

  private calculateX(x: number, parentWidth: number) {
    const tooltipOffset = 10
    const tooltipWidth = GraphTooltip.pixelStringToNumber(this.tooltip.style('width'))
    const totalTooltipWidth = tooltipWidth + x

    if (tooltipWidth === parentWidth) return 0

    if (totalTooltipWidth > parentWidth) {
      x -= tooltipWidth + tooltipOffset
    } else {
      x += tooltipOffset
    }

    return x
  }

  private calculateY(y: number, parentHeight: number) {
    const tooltipHeight = GraphTooltip.pixelStringToNumber(this.tooltip.style('height'))
    const halfParentHeight = parentHeight / 2
    const halfToltipHeight = tooltipHeight / 2

    if (this.fixed) {
      return halfParentHeight + halfToltipHeight
    }

    // note: y is inverted (0 is at the top)
    // top limit
    if (y - halfToltipHeight < 0) {
      return parentHeight - tooltipHeight
    }

    // bottom limit
    if (y + halfToltipHeight > parentHeight) {
      return 0
    }

    return parentHeight - halfToltipHeight - y
  }

  private updatePosition(parentWidth: number, parentHeight: number, x: number, y: number) {
    this.tooltip.style('display', 'flex')
    this.tooltip.style('left', `${this.calculateX(x, parentWidth)}px`)
    this.tooltip.style('bottom', `${this.calculateY(y, parentHeight)}px`)
  }

  private updateValues(data: number, metadata: GraphMetadata) {
    const { className, label } = metadata

    this.tooltip.select(`.${GraphTooltip.metricNameClass}`).text(label)

    this.tooltip
      .select(`.${GraphTooltip.metricValueClass}`)
      .attr('class', classes(GraphTooltip.metricValueClass, className))
      .text(formatDecimal(data))
  }

  private updateWidth(parentWidth: string) {
    this.tooltip.style('max-width', parentWidth)
  }
}

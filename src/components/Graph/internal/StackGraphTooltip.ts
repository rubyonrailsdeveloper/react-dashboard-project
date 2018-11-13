import classes from 'classnames'
import { IPlotEntity } from 'plottable/build/src/plots'
import GraphTooltip from 'src/components/Graph/internal/GraphTooltip'
import { PurePlotsToRender } from 'src/components/Graph/internal/types'
import { formatDecimal } from 'src/util/formating'

export default class StackGraphTooltip {
  private metricHealthClass = 'metric-health'
  private tooltip: d3.Selection<any, any, any, any>
  private fixed: boolean

  constructor(plots: PurePlotsToRender[], fixed: boolean = false) {
    let tooltipItem
    this.tooltip = plots[0]
      .rootElement()
      .select('.component.component-group')
      .append('div')
      .attr('class', classes('stack graph-tooltip', fixed && 'fixed'))

    plots.forEach((_, i) => {
      tooltipItem = this.tooltip.append('div').classed(`stack-tooltip-item-${i}`, true)
      tooltipItem
        .append('div')
        .classed(this.metricHealthClass, true)
        .append('div')
        .classed('stripe', true)
      tooltipItem.append('div').classed(GraphTooltip.metricNameClass, true)
      tooltipItem.append('div').classed(GraphTooltip.metricValueClass, true)
    })

    this.fixed = fixed
  }

  hide() {
    this.tooltip.style('display', 'none')
  }

  update(parentWidth: string, parentHeight: string, x: number, y: number, points: IPlotEntity[]) {
    this.updateValues(points)
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

  private updateValues(points: IPlotEntity[]) {
    points.forEach(({ dataset, datum }, i) => {
      const { className, label } = dataset.metadata()
      const item = this.tooltip.select(`.stack-tooltip-item-${i}`)
      // tooltip item health
      item
        .select(`.${this.metricHealthClass}`)
        .attr('class', this.metricHealthClass)
        .select('.stripe')
        .classed(className, true)

      // tooltip item label
      item.select(`.${GraphTooltip.metricNameClass}`).text(label)

      // tooltip item value
      item
        .select(`.${GraphTooltip.metricValueClass}`)
        .attr('class', classes(GraphTooltip.metricValueClass))
        .text(formatDecimal(datum[1]))
    })
  }

  private updateWidth(parentWidth: string) {
    this.tooltip.style('max-width', parentWidth)
  }
}

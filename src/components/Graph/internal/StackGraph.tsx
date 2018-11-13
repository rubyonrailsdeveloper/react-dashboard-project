import Plottable from 'plottable'
import { Table } from 'plottable/build/src/components'
import { Line } from 'plottable/build/src/plots'
import * as React from 'react'
import {
  getDotsPlot,
  getGridlines,
  getGuideline,
  getLinePlot,
  getXAxis,
  getYAxis,
} from 'src/components/Graph/internal/GraphComponents'
import { addStackPointerInteraction } from 'src/components/Graph/internal/GraphInteractions'
import GraphMarkup from 'src/components/Graph/internal/GraphMarkup'
import StackGraphTooltip from 'src/components/Graph/internal/StackGraphTooltip'
import { StackDataSet } from 'src/components/Graph/internal/types'
import {
  convertToPlottableDataSet,
  getTime,
  getTimeValue,
} from 'src/components/Graph/internal/utils'

export interface StackGraphProps {
  dataSets: StackDataSet[]
  error: object | null
  isLoading: boolean
  showLoadingIndicator: boolean
  xAxisHeight?: string
  graphHeight?: string
  hideGridlines?: boolean
  hideYAxis?: boolean
  disableInteractions?: boolean
}

class StackGraph extends React.Component<StackGraphProps> {
  xAxisDiv: HTMLDivElement
  lineGraph: HTMLDivElement

  graph: Table
  xAxis: Table

  componentDidUpdate() {
    this.updateGraph()
  }

  componentDidMount() {
    this.draw()
  }

  draw() {
    const { dataSets, hideGridlines, hideYAxis, disableInteractions } = this.props

    if (dataSets && dataSets.length) {
      const plotGroup = []
      const xScale = new Plottable.Scales.Time()
      const yScale = new Plottable.Scales.Linear().domainMin(0)

      // Add gridlines
      if (!hideGridlines) plotGroup.push(getGridlines(xScale, yScale))

      // Create and add line plots
      const plots: Array<Line<any>> = dataSets.map(stackObject => {
        return getLinePlot(getTime, getTimeValue, xScale, yScale).datasets(
          convertToPlottableDataSet(stackObject.values)
        )
      })
      plotGroup.push(...plots)

      // Add guideline
      const guideline = getGuideline(xScale)
      plotGroup.push(guideline)

      // Create and add dots plots
      const dots: any[] = plots.map(linePlot => getDotsPlot(linePlot, xScale, yScale))
      plotGroup.push(...dots)

      // Create graph with all its elements
      const graphGroup = new Plottable.Components.Group(plotGroup)

      // Create graph with Y axis
      const yAxis = hideYAxis ? null : getYAxis(yScale)
      this.graph = new Plottable.Components.Table([[yAxis, graphGroup], [null, null]])

      // render graph
      this.graph.renderTo(this.lineGraph)

      // Add X Axis
      this.xAxis = new Plottable.Components.Table([[null, null], [null, getXAxis(xScale)]])
      this.xAxis.renderTo(this.xAxisDiv)

      //////////////////
      const tooltip = new StackGraphTooltip(plots)

      const components = {
        dots,
        guideline,
        plots,
        tooltip,
      }

      if (!disableInteractions) addStackPointerInteraction(components)

      this.graph.redraw()
      this.xAxis.redraw()
    }
  }

  saveGraphReference = (lineGraphDOM: HTMLDivElement) => {
    this.lineGraph = lineGraphDOM
  }

  saveXAxisReference = (lineGraphDOM: HTMLDivElement) => {
    this.xAxisDiv = lineGraphDOM
  }

  updateGraph = () => {
    if (this.graph) this.graph.detach()
    if (this.xAxis) this.xAxis.detach()

    this.draw()
  }

  render() {
    return (
      <GraphMarkup
        {...this.props}
        saveGraphReference={this.saveGraphReference}
        saveXAxisReference={this.saveXAxisReference}
        onSizeUpdate={this.updateGraph}
        isStack={true}
      />
    )
  }
}

export default StackGraph

import Plottable from 'plottable'
import { Numeric } from 'plottable/build/src/axes'
import { Gridlines, Group, GuideLineLayer, Table } from 'plottable/build/src/components'
import { Line, Scatter } from 'plottable/build/src/plots'
import { Time } from 'plottable/build/src/scales'
import * as React from 'react'
import {
  getDotsPlot,
  getGridlines,
  getGuideline,
  getLinePlot,
  getXAxis,
  getYAxis,
} from 'src/components/Graph/internal/GraphComponents'
import { addPointerInteraction } from 'src/components/Graph/internal/GraphInteractions'
import GraphMarkup from 'src/components/Graph/internal/GraphMarkup'
import GraphTooltip from 'src/components/Graph/internal/GraphTooltip'
import { CustomDataSet, GraphComponents } from 'src/components/Graph/internal/types'
import { PurePlotsToRender } from 'src/components/Graph/internal/types'
import {
  areDatasetsZero,
  convertToPlottableDataSet,
  getTime,
  getTimeValue,
} from 'src/components/Graph/internal/utils'

type PlotToRender = PurePlotsToRender | Group | Table
type PlotGroup = Array<Scatter<{}, {}> | PlotToRender | Gridlines | GuideLineLayer<{}>>

export interface LineGraphOwnProps {
  hasDots: boolean
  graphHeight?: string
  hasGridlines?: boolean
  hasXAxis?: boolean
  hasYAxis?: boolean
  hasPointerInteraction?: boolean
  onMount?: (graphComponents: GraphComponents) => void
  xAxisHeight?: string
  xScale?: Time
  className?: string
}

interface LineGraphProps extends LineGraphOwnProps {
  dataSets: CustomDataSet[]
  error: object | null
  isLoading: boolean
  showLoadingIndicator: boolean
}

class LineGraph extends React.Component<LineGraphProps> {
  lastMaxDomain = 1
  yAxis: Numeric
  xAxis: Table
  xAxisDiv: HTMLDivElement
  xScale = new Plottable.Scales.Time()
  yScale = new Plottable.Scales.Linear().domainMin(0)
  dotsPlot: Scatter<{}, {}>
  guideline: GuideLineLayer<{}>
  gridlines: Gridlines
  lineGraph: HTMLDivElement
  linePlot: Line<{}>
  plotToRender: PlotToRender
  tooltip: GraphTooltip

  componentDidMount() {
    // draw everything even if we don't have datasets yet to avoid undefined errors
    this.drawGraph()
  }

  componentDidUpdate() {
    this.updateGraph()
  }

  componentWillReceiveProps(nextProps: LineGraphProps) {
    if (this.props.hasDots && !nextProps.hasDots) {
      this.dotsPlot.datasets([])
    }
  }

  drawGraph = () => {
    const {
      dataSets,
      hasDots,
      hasGridlines,
      hasPointerInteraction,
      hasXAxis,
      hasYAxis,
      onMount,
      xScale,
    } = this.props
    const plotGroup: PlotGroup = []
    const convertedDataSets = convertToPlottableDataSet(dataSets)

    // an x scale may be passed as prop to sync multiples graphs interaction
    if (xScale) {
      this.xScale = xScale
    }

    this.yScale.onUpdate(this.updateYScale)

    this.linePlot = getLinePlot(getTime, getTimeValue, this.xScale, this.yScale)
    this.linePlot.datasets(convertedDataSets)

    if (areDatasetsZero(convertedDataSets)) {
      this.yScale.domain([-0.1, 10])
    }

    this.plotToRender = this.linePlot

    if (hasGridlines) {
      this.gridlines = getGridlines(this.xScale, this.yScale)
      plotGroup.push(this.gridlines)
    }

    // Add linePlot after gridlines to avoid overlaping
    plotGroup.push(this.plotToRender)

    if (hasPointerInteraction) {
      this.guideline = getGuideline(this.xScale)
      plotGroup.push(this.guideline)
    }
    if (hasDots) {
      this.dotsPlot = getDotsPlot(this.linePlot, this.xScale, this.yScale)
      plotGroup.push(this.dotsPlot)
    }
    

    this.plotToRender = new Plottable.Components.Group(plotGroup)

    if (hasYAxis) {
      this.yAxis = getYAxis(this.yScale)
      this.plotToRender = new Plottable.Components.Table([
        [this.yAxis, this.plotToRender],
        [null, null],
      ])
    }

    // render plot
    this.plotToRender.renderTo(this.lineGraph)

    // Add Axis
    // note: X Axis is on its own div to facilitate custom sizing
    if (hasXAxis) {
      this.xAxis = new Plottable.Components.Table([[null, null], [null, getXAxis(this.xScale)]])

      // render x axis
      this.xAxis.renderTo(this.xAxisDiv)
    }

    this.tooltip = new GraphTooltip(this.linePlot)

    const components = {
      dots: this.dotsPlot,
      guideline: this.guideline,
      plot: this.linePlot,
      tooltip: this.tooltip,
    }

    if (hasPointerInteraction) {
      addPointerInteraction(components)
    }

    // on mount is currently used to sync interaction between graphs
    if (onMount) {
      onMount(components)
    }

    // sometimes these components are not properly drawn, that's why the redraw
    if (this.plotToRender) this.plotToRender.redraw()
    if (this.xAxis) this.xAxis.redraw()
  }

  saveGraphReference = (lineGraphDOM: HTMLDivElement) => {
    this.lineGraph = lineGraphDOM
  }

  saveXAxisReference = (lineGraphDOM: HTMLDivElement) => {
    this.xAxisDiv = lineGraphDOM
  }

  // this was created to avoid the graph to go on top of the wrapper
  updateYScale = () => {
    const max = this.yScale.domainMax()
    const stepToIncrease = max / 16

    // this function is called on hover, like interactions, so this return will improve performance
    // if the domain hasn't changed
    if (max === 1 || this.lastMaxDomain === max) return

    this.lastMaxDomain = max + stepToIncrease
    this.yScale.domainMax(this.lastMaxDomain)
  }

  updateGraph = () => {
    if (this.props.dataSets && this.props.dataSets.length) {
      // tranform prometheus datasets to plottable datasets
      const convertedDatasets = convertToPlottableDataSet(this.props.dataSets)

      this.linePlot.datasets(convertedDatasets)

      // if all data in a dataset is 0, the domain is changed to avoid graph line touching the bottom
      if (areDatasetsZero(convertedDatasets)) {
        this.yScale.domain([-0.1, 10])
      }

      if (this.xAxis) this.xAxis.redraw()

      this.plotToRender.redraw()
    }
  }

  render() {
    return (
      <GraphMarkup
        {...this.props}
        saveGraphReference={this.saveGraphReference}
        saveXAxisReference={this.saveXAxisReference}
        onSizeUpdate={this.updateGraph}
      />
    )
  }
}

export default LineGraph

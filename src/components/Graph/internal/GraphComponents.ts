import Plottable from 'plottable'
import { Numeric, TierLabelPosition } from 'plottable/build/src/axes'
import { CurveName } from 'plottable/build/src/plots'
import { Linear, Time } from 'plottable/build/src/scales'
import { TimeSeries } from 'src/components/Graph/internal/types'
import { PurePlotsToRender } from 'src/components/Graph/internal/types'
import { timeIntervalsConfig } from 'src/components/Graph/internal/utils'

const tickLength = 5
const tierLabelPosition: TierLabelPosition[] = ['center', 'center']

export const getXAxis = (xScale: Time) => {
  const xAxis = new Plottable.Axes.Time(xScale, 'bottom')
    .tierLabelPositions(tierLabelPosition)
    .innerTickLength(tickLength)
    .endTickLength(tickLength)
    .margin(0)
    .tickLabelPadding(10)

  // this can be change to display any kind of date format you need
  xAxis.axisConfigurations(timeIntervalsConfig)

  return xAxis
}

export const getYAxis = (yScale: Linear): Numeric => new Plottable.Axes.Numeric(yScale, 'left')

export const getDotsPlot = (plot: PurePlotsToRender, xScale: Time, yScale: Linear) => {
  return new Plottable.Plots.Scatter()
    .x(plot.x().accessor, xScale) // time
    .y(plot.y().accessor, yScale) // value
    .size(10)
    .addDataset(new Plottable.Dataset())
}

export const getGuideline = (xScale: Time) => {
  return new Plottable.Components.GuideLineLayer('vertical')
    .scale(xScale as any)
    .addClass('hide')
    .addClass('graph-guideline')
}

export const getGridlines = (xScale: Time, yScale: Linear) => {
  return new Plottable.Components.Gridlines(xScale, yScale)
}

export const getLinePlot = (
  getTime: (d: TimeSeries) => number,
  getTimeValue: (d: TimeSeries) => number,
  xScale: Time,
  yScale: Linear
) => {
  return new Plottable.Plots.Line()
    .x(getTime, xScale) // time
    .y(getTimeValue, yScale) // value
    .attr('class', (d, i, ds) => {
      return `graph-line ${ds.metadata().className}`})
    .curve(CurveName.monotone)
}

export const getAreaPlot = (
  getTime: (d: TimeSeries) => number,
  getTimeValue: (d: TimeSeries) => number,
  xScale: Time,
  yScale: Linear
) => {
  return new Plottable.Plots.Area()
    .x(getTime, xScale) // time
    .y(getTimeValue, yScale) // value
    .attr('class', (d, i, ds) => `graph-area ${ds.metadata().className}`)
    .curve(CurveName.monotone)
}

export const getStackedAreaPlot = (
  getTime: (d: TimeSeries) => number,
  getTimeValue: (d: TimeSeries) => number,
  xScale: Time,
  yScale: Linear
) => {
  return new Plottable.Plots.StackedArea()
    .x(getTime, xScale) // time
    .y(getTimeValue, yScale) // value
    .attr('class', (d, i, ds) => `graph-stacked-area ${ds.metadata().className}`)
    .curve(CurveName.monotone)
}

// use this function to stack/line graph to enable pan/zoom
export const getPanZoom = (xScale: Time) => {
  // control zoom while pressing alt key
  const zoomWithAlt = (zoom: WheelEvent) => zoom.altKey

  return new Plottable.Interactions.PanZoom(xScale).wheelFilter(zoomWithAlt)
}

import { Icon } from '@blueprintjs/core'
import { GuideLineLayer } from 'plottable/build/src/components'
import { Line, Scatter } from 'plottable/build/src/plots'
import * as React from 'react'
import GraphTooltip from 'src/components/Graph/internal/GraphTooltip'
import { LineGraphOwnProps } from 'src/components/Graph/internal/LineGraph'
import StackGraphTooltip from 'src/components/Graph/internal/StackGraphTooltip'
import { MetricTransform } from 'src/components/Graph/internal/transforms'
import { NestedId } from 'src/store/constants'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import {
  MetricLabel,
  MetricName,
  NamespaceMetricsGroup,
  PipelineMetricsGroup,
  RangeQueryMetricGroup,
  TimeRange,
  TopicMetricsGroup
} from 'src/store/metrics/metrics-model'
import { MetricFn } from 'src/store/metrics/query-encoders'

export type PurePlotsToRender = Line<{}>

export type MetricMaxValue = number

export interface GraphComponents {
  dots: Scatter<{}, {}>
  guideline: GuideLineLayer<{}>
  plot: PurePlotsToRender
  tooltip: GraphTooltip
}

export interface StackGraphComponents {
  dots: Array<Scatter<{}, {}>>
  guideline: GuideLineLayer<{}>
  plots: PurePlotsToRender[]
  tooltip: StackGraphTooltip
}

export enum GraphCategory {
  Topology = 'Topology',
  Bolts = 'Bolts',
  Spouts = 'Spouts',
  Resources = 'Resources',
  Events = 'Events',
  Replication = 'Replication',
  Storage = 'Storage',
}

export interface Metric {
  label: string
  name: MetricName
  unit: string
  category?: GraphCategory
  fn?: MetricFn
  description?: string
  labels?: MetricLabel[]
  maxValue?: MetricMaxValue
  transform?: MetricTransform
}

export interface EntityGraphsState {
  activeCategory: GraphCategory
  metricsToRender: MetricObj[]
}

export interface MetricObj {
  metric: Metric
  className?: string
  icon?: React.ReactElement<Icon>
  id?: string
  maxValue?: MetricMaxValue
  timeRange?: TimeRange
}

export interface PipelineMetricsConnect {
  groupType?: PipelineMetricsGroup
  groupValue?: string
}

export interface NamespaceMetricsConnect {
  groupType?: NamespaceMetricsGroup
  groupValue?: string
}

export interface TopicMetricsConnect {
  groupType?: TopicMetricsGroup
  groupValue?: string
}

export interface RangeMetricsConnect {
  groupType: RangeQueryMetricGroup
  groupValue: string
}

export interface GraphDataProps {
  metric: Metric
  timeRange: TimeRange
  maxValue?: MetricMaxValue
}

export interface EntityGraphProps extends NestedId, GraphDataProps, LineGraphOwnProps {}

export interface PipelineGraphProps extends EntityGraphProps, PipelineMetricsConnect {}

export interface NamespaceGraphProps extends EntityGraphProps, NamespaceMetricsConnect {}

export interface TopicGraphProps extends EntityGraphProps, TopicMetricsConnect {}

export interface RangeGraphProps extends EntityGraphProps, RangeMetricsConnect {}

export interface EntityDetailGraphChildrenProps extends LineGraphOwnProps, GraphDataProps {}

export type MetricsActions = typeof metricsActions
export type TimeSeries = [number, number]
export type OriginalTimeSeries = [number, string]

export interface GraphMetadata {
  className: string
  label: string
}

export interface CustomDataSet {
  dataset: TimeSeries[]
  metadata: GraphMetadata
}

export interface OriginalStackDataSet {
  metric: object
  values: OriginalTimeSeries[]
}

export interface StackDataSet {
  metric: object
  values: CustomDataSet[]
}

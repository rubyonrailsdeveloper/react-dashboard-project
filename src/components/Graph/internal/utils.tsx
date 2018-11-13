import last from 'lodash-es/last'
import Plottable, { Dataset } from 'plottable'
import {
  CustomDataSet,
  GraphCategory,
  MetricObj,
  OriginalStackDataSet,
  OriginalTimeSeries,
  StackDataSet,
  TimeSeries,
} from 'src/components/Graph/internal/types'
import { healthClass } from 'src/constants'
import { Health } from 'src/store/constants'
import { Step, TimeRange } from 'src/store/metrics/metrics-model'
import { Namespace } from 'src/store/namespace/namespace-model'
import { Topic } from 'src/store/topic/topic-model'
import { assertUnreachable } from 'src/util/misc'

export const getTime = (d: TimeSeries): number => d[0]
export const getTimeValue = (d: TimeSeries): number => d[1]

export const areDatasetsZero = (datasets: Dataset[]) => {
  if (
    !datasets.length ||
    !datasets[0].data() ||
    !datasets[0].data().length ||
    datasets[0].data()[0][1] !== 0
  )
    return false

  return datasets.every(dataset => dataset.data().every(timeSeries => timeSeries[1] === 0))
}

const calculateValue = (maxValue: number, percentage: number): number => {
  return percentage * maxValue / 100
}

export const convertToPlottableDataSet = (dataSets: CustomDataSet[]): Dataset[] =>
  dataSets.map(
    customDataSet => new Plottable.Dataset(customDataSet.dataset, customDataSet.metadata)
  )

const createCustomDataSet = (
  initValue: TimeSeries[],
  className: string,
  label: string
): CustomDataSet => {
  return {
    dataset: [...initValue],
    metadata: { className, label },
  }
}

export const filterByCategory = (category: GraphCategory) => (metricObj: MetricObj) =>
  category === metricObj.metric.category

export const updateMetricObj = (
  metricsToRender: MetricObj[],
  metricObjToUpdate: MetricObj
): MetricObj[] => {
  return metricsToRender.map(metric => {
    if (metric.id === metricObjToUpdate.id) {
      return metricObjToUpdate
    }

    return metric
  })
}

export const datasetToDecimal = (dataSet: OriginalTimeSeries[]): TimeSeries[] => {
  return dataSet.map(dataset => {
    return [dataset[0], parseFloat(dataset[1])] as TimeSeries
  })
}

export const getNamespaceId = (namespace: Namespace | null) => {
  if (!namespace) return namespace

  return [namespace.group, namespace.name].join('/')
}

export const getTopicId = (topic: Topic | null) => {
  if (!topic) return topic

  return [topic.group, topic.namespace, topic.name].join('/')
}

// Based on time range return the step to request data to prometheus
export const getStepBaseOnTimeRange = (timeRange: TimeRange): Step => {
  switch (timeRange) {
    case TimeRange.MONTH:
      return Step.EIGHT_HOURS
    case TimeRange.WEEK:
      return Step.TWO_HOURS
    case TimeRange.DAY:
      return Step.SIXTEEN_MINS
    case TimeRange.TWELVE_HOURS:
      return Step.EIGHT_MINS
    case TimeRange.SIX_HOURS:
      return Step.FOUR_MINS
    case TimeRange.TWO_HOURS:
      return Step.TWO_MINS
    default:
      return Step.MIN
  }
}

const getStackGraphClass = (index: number) => {
  switch (index) {
    case 0:
      return 'cyan'
    case 1:
      return 'orange'
    case 2:
      return 'purple'
    case 3:
      return 'teal'
    case 4:
      return 'rose'
    case 5:
      return 'lime'
    case 6:
      return 'pink'
    case 7:
      return 'blue'
    case 8:
      return 'gray'
    case 9:
      return 'yellow'
    default:
      return assertUnreachable(index as never)
  }
}

export const sliceStackDataSet = (
  dataSets: OriginalStackDataSet[] | null,
  groupBy: string
): StackDataSet[] => {
  if (!dataSets) return []

  return dataSets.map(({ metric, values }, i) => {
    return {
      values: [
        createCustomDataSet(
          [...datasetToDecimal(values)],
          getStackGraphClass(i),
          (dataSets[i].metric as any)[groupBy]
        ),
      ],
      metric,
    }
  })
}

export const getClassByMetric = (label: string) : string => {
  const normalizedLabel = label.replace(/\s+/g, '_').toUpperCase()
  switch (normalizedLabel) {
    case 'STORAGE_READ_RATE':
      return 'graph-line-metric-storageRateRead'
    case 'STORAGE_WRITE_RATE':
      return 'graph-line-metric-storageRateWrite'
    case 'RATE_IN':
      return 'graph-line-metric-rateIn'
    case 'RATE_OUT':
      return 'graph-line-metric-rateOut'
    case 'BYTE_RATE_IN':
      return 'graph-line-metric-byteRateIn'
    case 'BYTE_RATE_OUT':
      return 'graph-line-metric-byteRateOut'
    case 'BACKLOG':
      return 'graph-line-metric-backlog'
    case 'FAILURES':
      return 'graph-line-metric-failures'
    case 'ALL_SPOUTS_FAILURES':
      return 'graph-line-metric-allSpoutsFailures'
    case 'GC':
      return 'graph-line-metric-gc'
    case 'GARBAGE_COLLECTION_INVOCATIONS_PER_MIN_PER_JVM':
      return 'graph-line-metric-gcInvocations'
    case 'BACK_PRESSURE':
      return 'graph-line-metric-backPressure'
    case 'EXECUTE_COUNT':
      return 'graph-line-metric-executeCount'
    case 'ACK_COUNT':
      return 'graph-line-metric-ackCount'
    case 'EMIT_COUNT':
      return 'graph-line-metric-emitCount'
    case 'COMPLETE_LATENCY':
      return 'graph-line-metric-completeLatency'
    case 'AVERAGE_COMPLETE_LATENCY':
      return 'graph-line-metric-averageCompleteLatency'
    case 'AVERAGE_EXECUTE_LATENCY':
      return 'graph-line-metric-averageExecuteLatency'
    case 'AVERAGE_PROCESS_LATENCY':
      return 'graph-line-metric-averageProcessLatency'
    case 'AVERAGE_FAILURE_LATENCY':
      return 'graph-line-metric-averageFailureLatency'
    case 'AVERAGE_PENDING_TO_BE_ACKED_COUNT':
      return 'graph-line-metric-avgToBeAcked'
    default:
      return 'graph-line-metric-default'
  }
}
export const createDsWithClassByMetric = (
  dataSet: OriginalTimeSeries[] | null,
  label: string,
): CustomDataSet[] => {
  if (!dataSet) return []

  const transformedDataSet = datasetToDecimal(dataSet)
  const className = getClassByMetric(label)
  return [createCustomDataSet([...transformedDataSet], className, label)]
}

// Based on a max value slice prometheus dataset in as many parts as needed to get multiples colors
// in a single line graph
export const sliceDataSet = (
  dataSet: OriginalTimeSeries[] | null,
  label: string,
  maxValue?: number
): CustomDataSet[] => {
  if (!dataSet) return []

  const transformedDataSet = datasetToDecimal(dataSet)

  if (!maxValue) {
    return [createCustomDataSet([...transformedDataSet], healthClass(Health.OK), label)]
  }

  const failingPercentage = 90
  const unhealtyPercentage = 70
  const failingValue = calculateValue(maxValue, failingPercentage)
  const unhealtyValue = calculateValue(maxValue, unhealtyPercentage)
  let className
  let lastDataSet
  let lastTimeSerie: any

  return transformedDataSet.reduce((datasets: CustomDataSet[], timeSerie) => {
    className =
      timeSerie[1] > failingValue
        ? healthClass(Health.FAILING)
        : timeSerie[1] > unhealtyValue ? healthClass(Health.UNHEALTHY) : healthClass(Health.OK)

    lastDataSet = last(datasets)

    if (!lastDataSet) {
      datasets.push(createCustomDataSet([timeSerie], className, label))
      return datasets
    }

    if (lastDataSet.metadata.className === className) {
      lastDataSet.dataset.push(timeSerie)
    } else {
      lastTimeSerie = last(lastDataSet.dataset)
      datasets.push(createCustomDataSet([lastTimeSerie, timeSerie], className, label))
    }

    return datasets
  }, [])
}

// configuration to x axis labels
export const timeIntervalsConfig = [
  [
    {
      formatter: Plottable.Formatters.time('%m/%d %H:%M:%S'),
      interval: Plottable.TimeInterval.second,
      step: 1,
    },
  ],
  [
    {
      formatter: Plottable.Formatters.time('%m/%d %H:%M'),
      interval: Plottable.TimeInterval.minute,
      step: 1,
    },
  ],
  [
    {
      formatter: Plottable.Formatters.time('%m/%d %H:%M'),
      interval: Plottable.TimeInterval.minute,
      step: 5,
    },
  ],
  [
    {
      formatter: Plottable.Formatters.time('%m/%d %H:%M'),
      interval: Plottable.TimeInterval.minute,
      step: 15,
    },
  ],
  [
    {
      formatter: Plottable.Formatters.time('%m/%d %H:%M %p'),
      interval: Plottable.TimeInterval.minute,
      step: 30,
    },
  ],
  [
    {
      formatter: Plottable.Formatters.time('%m/%d %H %p'),
      interval: Plottable.TimeInterval.hour,
      step: 1,
    },
  ],
  [
    {
      formatter: Plottable.Formatters.time('%m/%d %H %p'),
      interval: Plottable.TimeInterval.hour,
      step: 2,
    },
  ],
  [
    {
      formatter: Plottable.Formatters.time('%m/%d %H %p'),
      interval: Plottable.TimeInterval.hour,
      step: 6,
    },
  ],
  [
    {
      formatter: Plottable.Formatters.time('%m/%d %H %p'),
      interval: Plottable.TimeInterval.day,
      step: 1,
    },
  ],
]

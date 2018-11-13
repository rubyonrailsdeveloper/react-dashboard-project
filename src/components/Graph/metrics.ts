import { bytesArrToMBArr } from 'src/components/Graph/internal/transforms'
import { GraphCategory } from 'src/components/Graph/internal/types'
import { MetricName } from 'src/store/metrics/metrics-model'
import { MetricFn } from 'src/store/metrics/query-encoders'

// note: Don't use get function in these object because it will interfere with object comparisons
const metrics = {
  ACK_COUNT: {
    label: 'Ack Count',
    name: MetricName.ACK_COUNT,
    unit: 'events',
  },
  BACKLOG: {
    label: 'Backlog',
    name: MetricName.BACKLOG,
    unit: 'events',
  },
  COMPLETE_LATENCY: {
    label: 'Complete Latency',
    name: MetricName.COMPLETE_LATENCY,
    unit: 'ms',
  },
  CPU_USED: {
    label: 'CPU',
    name: MetricName.CPU_USED,
    unit: 'cores',
    category: GraphCategory.Topology,
  },
  EMIT_COUNT: {
    label: 'Emit Count',
    name: MetricName.EMIT_COUNT,
    unit: 'events',
  },
  EXECUTE_COUNT: {
    label: 'Execute Count',
    name: MetricName.EXECUTE_COUNT,
    unit: 'events',
  },
  EXECUTE_LATENCY: {
    label: 'Execute Latency',
    name: MetricName.EXECUTE_LATENCY,
    unit: 'ms',
  },
  FAILURES_COUNT: {
    label: 'Failures',
    name: MetricName.FAILURES_COUNT,
    unit: '%',
    description: 'Failed tuple count divided by sum of failed and executed tuples over time range.',
  },
  FAILURE_LATENCY: {
    label: 'Failure Latency',
    name: MetricName.FAILURE_LATENCY,
    unit: 'ms',
  },
  GC_PER_JVM_COUNT: {
    label: 'Garbage Collection Invocations Per Min Per JVM',
    name: MetricName.GC_PER_JVM_COUNT,
    unit: 'events/min',
    category: GraphCategory.Topology,
  },
  GC_TIME_PER_JVM: {
    label: 'GC',
    name: MetricName.GC_TIME_PER_JVM,
    unit: 'ms/min',
    category: GraphCategory.Topology,
    description: 'Milliseconds spent in garbage collection per minute.',
  },
  PENDING_ACKED_COUNT: {
    label: 'Pending To Be Acked Count',
    name: MetricName.PENDING_ACKED_COUNT,
    unit: 'ms/min',
  },
  PROCESS_LATENCY: {
    label: 'Process Latency',
    name: MetricName.PROCESS_LATENCY,
    unit: 'ms',
  },
  RAM_USED: {
    label: 'Memory',
    name: MetricName.RAM_USED,
    unit: 'MB',
    category: GraphCategory.Topology,
  },
  RATE_IN: {
    label: 'Rate In',
    name: MetricName.RATE_IN,
    unit: 'event/s',
    category: GraphCategory.Events,
  },
  RATE_OUT: {
    label: 'Rate Out',
    name: MetricName.RATE_OUT,
    unit: 'event/s',
    category: GraphCategory.Events,
  },
  REPLICATION_RATE_IN: {
    label: 'Incoming Replication Rate',
    name: MetricName.REPLICATION_RATE_IN,
    unit: 'event/s',
    category: GraphCategory.Replication,
  },
  REPLICATION_RATE_OUT: {
    label: 'Outgoing Replication Rate',
    name: MetricName.REPLICATION_RATE_OUT,
    unit: 'event/s',
    category: GraphCategory.Replication,
  },
  REPLICATION_BACKLOG: {
    label: 'Replication Backlog',
    name: MetricName.REPLICATION_BACKLOG,
    unit: 'events',
    category: GraphCategory.Replication,
  },
  STORAGE_SIZE: {
    label: 'Storage',
    name: MetricName.STORAGE_SIZE,
    unit: 'MB',
  },
  STORAGE_WRITE_RATE: {
    label: 'Storage Write Rate',
    name: MetricName.STORAGE_WRITE_RATE,
    unit: 'entry/s',
    category: GraphCategory.Storage,
  },
  STORAGE_READ_RATE: {
    label: 'Storage Read Rate',
    name: MetricName.STORAGE_READ_RATE,
    unit: 'entries/s',
    category: GraphCategory.Storage,
  },
  TIME_SPENT_UNDER_BACK_PRESSURE: {
    label: 'Back Pressure',
    name: MetricName.TIME_SPENT_UNDER_BACK_PRESSURE,
    unit: 'ms/min',
    category: GraphCategory.Topology,
    description: 'Milliseconds spent in back pressure per minute.',
  },
  THROUGHPUT_IN: {
    label: 'Byte Rate In',
    name: MetricName.THROUGHPUT_IN,
    unit: 'bytes/s',
  },
  THROUGHPUT_OUT: {
    label: 'Byte Rate Out',
    name: MetricName.THROUGHPUT_OUT,
    unit: 'bytes/s',
  },
}

export const customMetrics = {
  FAILURES_COUNT_BY_SPOUT: {
    ...metrics.FAILURES_COUNT,
    label: 'All Spouts Failures',
    category: GraphCategory.Topology,
    labels: [['component_type', 'spout']],
  },
}

export const boltMetrics = {
  ACK_COUNT: {
    ...metrics.ACK_COUNT,
    category: GraphCategory.Bolts,
    labels: [['component_type', 'bolt']],
  },
  AVG_EXECUTE_LATENCY: {
    ...metrics.EXECUTE_LATENCY,
    fn: MetricFn.AVG,
    label: `Avg ${metrics.EXECUTE_LATENCY.label}`,
    category: GraphCategory.Bolts,
    labels: [['component_type', 'bolt']],
  },
  AVG_FAILURE_LATENCY: {
    ...metrics.FAILURE_LATENCY,
    fn: MetricFn.AVG,
    label: `Avg ${metrics.FAILURE_LATENCY.label}`,
    category: GraphCategory.Bolts,
    labels: [['component_type', 'bolt']],
  },
  AVG_PROCESS_LATENCY: {
    ...metrics.PROCESS_LATENCY,
    fn: MetricFn.AVG,
    label: `Avg ${metrics.PROCESS_LATENCY.label}`,
    category: GraphCategory.Bolts,
    labels: [['component_type', 'bolt']],
  },
  EXECUTE_COUNT: {
    ...metrics.EXECUTE_COUNT,
    category: GraphCategory.Bolts,
    labels: [['component_type', 'bolt']],
  },
  EMIT_COUNT: {
    ...metrics.EMIT_COUNT,
    category: GraphCategory.Bolts,
    labels: [['component_type', 'bolt']],
  },
  FAILURES_COUNT: {
    ...metrics.FAILURES_COUNT,
    category: GraphCategory.Bolts,
    labels: [['component_type', 'bolt']],
  },
}

export const spoutMetrics = {
  ACK_COUNT: {
    ...metrics.ACK_COUNT,
    category: GraphCategory.Spouts,
    labels: [['component_type', 'spout']],
  },
  EMIT_COUNT: {
    ...metrics.EMIT_COUNT,
    category: GraphCategory.Spouts,
    labels: [['component_type', 'spout']],
  },
  FAILURES_COUNT: {
    ...customMetrics.FAILURES_COUNT_BY_SPOUT,
    label: 'Failures Count',
    category: GraphCategory.Spouts,
  },
  AVG_COMPLETE_LATENCY: {
    ...metrics.COMPLETE_LATENCY,
    fn: MetricFn.AVG,
    label: `Avg ${metrics.COMPLETE_LATENCY.label}`,
    category: GraphCategory.Spouts,
    labels: [['component_type', 'spout']],
  },
  AVG_FAILURE_LATENCY: {
    ...metrics.FAILURE_LATENCY,
    fn: MetricFn.AVG,
    label: `Avg ${metrics.FAILURE_LATENCY.label}`,
    category: GraphCategory.Spouts,
    labels: [['component_type', 'spout']],
  },
  AVG_PENDING_ACKED_COUNT: {
    ...metrics.PENDING_ACKED_COUNT,
    fn: MetricFn.AVG,
    label: `Avg ${metrics.PENDING_ACKED_COUNT.label}`,
    category: GraphCategory.Spouts,
    labels: [['component_type', 'spout']],
  },
}

export const namespaceMetrics = {
  BACKLOG: {
    ...metrics.BACKLOG,
    label: 'Local Backlog',
    category: GraphCategory.Events,
  },
  CPU_USED: {
    ...metrics.CPU_USED,
    category: GraphCategory.Resources,
  },
  RAM_USED: {
    ...metrics.RAM_USED,
    category: GraphCategory.Resources,
  },
  STORAGE_SIZE: {
    ...metrics.STORAGE_SIZE,
    label: 'Storage Size',
    category: GraphCategory.Storage,
    transform: bytesArrToMBArr,
  },
  THROUGHPUT_IN: {
    ...metrics.THROUGHPUT_IN,
    label: 'Local Publish Throughput',
    category: GraphCategory.Events,
  },
  THROUGHPUT_OUT: {
    ...metrics.THROUGHPUT_OUT,
    label: 'Local Delivery Throughput',
    category: GraphCategory.Events,
  },
}

export const topicMetrics = {
  BACKLOG: {
    ...metrics.BACKLOG,
    label: 'Local Backlog',
    category: GraphCategory.Events,
  },
  // CPU_USED: {
  //   ...metrics.CPU_USED,
  //   category: GraphCategory.Resources,
  // },
  // RAM_USED: {
  //   ...metrics.RAM_USED,
  //   category: GraphCategory.Resources,
  // },
  STORAGE_SIZE: {
    ...metrics.STORAGE_SIZE,
    label: 'Storage Size',
    category: GraphCategory.Storage,
    transform: bytesArrToMBArr,
  },
  THROUGHPUT_IN: {
    ...metrics.THROUGHPUT_IN,
    label: 'Local Publish Throughput',
    category: GraphCategory.Events,
  },
  THROUGHPUT_OUT: {
    ...metrics.THROUGHPUT_OUT,
    label: 'Local Delivery Throughput',
    category: GraphCategory.Events,
  },
}

export const nodeMetrics = {
  REPLICATION_RATE_IN: {
    ...metrics.REPLICATION_RATE_IN,
    label: 'IN',
  },
  REPLICATION_RATE_OUT: {
    ...metrics.REPLICATION_RATE_IN,
    label: 'OUT',
  },
}

export const dashboardMetrics = {
  DASHBOARD_CPU_USED: {
    ...metrics.CPU_USED,
    label: 'pipelines by CPU usage',
  },
  TOPIC_BACKLOG: {
    ...metrics.BACKLOG,
    label: 'topics by backlog',
  },
}

export default metrics

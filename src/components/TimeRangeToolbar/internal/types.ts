import { TimeRange } from 'src/store/metrics/metrics-model'

export interface TimeRangeToolbarProps {
  active: TimeRange
  className?: string
  onChange: (timeRange: TimeRange) => void
}

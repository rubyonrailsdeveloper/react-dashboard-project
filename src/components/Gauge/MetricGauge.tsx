import * as React from 'react'
import Gauge from 'src/components/Gauge/Gauge'
import { bytesToHumanSize, precisionRound } from 'src/util/formating'

interface Metric {
  used: number
  limit: number
  type: string
}
interface MetricGaugeProps {
  metric: Metric
}

class MetricGauge extends React.PureComponent<MetricGaugeProps> {
  render() {
    const { metric } = this.props
    const percent = metric && metric.limit ? precisionRound((metric.used / metric.limit) * 100, 1) : 0
    const intentClass = percent < 80 ? 'st-gauge-success' : (percent < 90 ? 'st-gauge-warning' : 'st-gauge-danger')
    const formattingOptions = {
      maximumSignificantDigits: 3,
      minimumSignificantDigits: 3
    }

    const usedStr = bytesToHumanSize(metric.used, formattingOptions, ' ').formatted
    const limitStr = metric.type === 'cpu' ?
      bytesToHumanSize(metric.limit, formattingOptions, 'cores').formatted
      : bytesToHumanSize(metric.limit, formattingOptions).formatted

    const subText = `${usedStr} / ${limitStr}`

    return (
      <div className={`st-metric-gauge ${intentClass}`}>
        {metric.limit && <Gauge percent={percent} />}
        <div className={`st-metric-gauge-sub pt-text-muted`}>
          <small>{subText}</small>
        </div>
      </div>
    )
  }
}

export default MetricGauge

import classes from 'classnames'
import * as React from 'react'
import { default as Panel, PanelProps } from 'src/components/Panel/Panel'
import StIcon from 'src/components/StIcon/StIcon'
import { intentIcon, thresholdClass, thresholdIntent } from 'src/constants'
import { bytesToHumanSize, precisionRound } from 'src/util/formating'

interface Metric {
  used: number
  limit: number
  type: string
}
interface StatUsagePanelProps extends PanelProps{
  metric: Metric
}

const formattingOptions = {
  maximumSignificantDigits: 3,
  minimumSignificantDigits: 3
}

class StatUsagePanel extends React.PureComponent<StatUsagePanelProps> {
  renderFooter = (metric: Metric, percent: number, intentClass: string | undefined) => {
    const used = bytesToHumanSize(metric.used, formattingOptions)
    const limit = bytesToHumanSize(metric.limit, formattingOptions)
    const usedStr = bytesToHumanSize(metric.used, formattingOptions, (
      metric.type === 'cpu' || used.label === limit.label ? ' ' : ''
    )).formatted
    const limitStr = bytesToHumanSize(metric.limit, formattingOptions, (
      metric.type === 'cpu' ? 'cores' : ''
    )).formatted

    return (
      <small className={`pt-text-muted`}>
        <span className={intentClass}>{usedStr}</span> / <span>{limitStr}</span>
      </small>
    )
  }

  render() {
    const { header, metric, className } = this.props
    const percent = metric && metric.limit ? precisionRound((metric.used / metric.limit) * 100, 1) : 0
    const intent = thresholdIntent(percent, metric.type)
    const intentClass = thresholdClass(percent)
    const footer = this.renderFooter(metric, percent, intentClass)

    return (
      <Panel header={header} footer={footer} className={`stat-usage-panel ${className}`}>
        <div className="stat-usage-percent">
          {metric.limit && <span><span className={intentClass}>{percent}</span> %</span>}
          <StIcon className={classes(intentIcon(intent), intentClass)} />
        </div>
      </Panel>
    )
  }
}

export default StatUsagePanel

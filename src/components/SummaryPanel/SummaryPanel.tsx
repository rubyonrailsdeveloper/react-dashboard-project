import classes from 'classnames'
import * as React from 'react'
import Panel from 'src/components/Panel/Panel'
import StIcon from 'src/components/StIcon/StIcon'
import { healthClass, healthIcon } from 'src/constants'
import { Health } from 'src/store/constants'

interface SummaryPanelProps {
  header: string | React.ReactNode
  healthSummary: WithHealth[] | null
  to?: string
  className?: string
}

interface WithHealth {
  health: Health
}

interface SummaryPanelState {
  overallHealth: Health
}

class SummaryPanel extends React.Component<SummaryPanelProps, SummaryPanelState> {
  state = {
    overallHealth: SummaryPanel.getOverallHealth(this.props.healthSummary)
  }

  static getOverallHealth(healthSummary: WithHealth[] | null) {
    const arr = healthSummary ? [...healthSummary] : []
    if (arr.some(n => n.health === Health.FAILING)) {
      return Health.FAILING
    } else if (arr.some(n => n.health === Health.UNHEALTHY)) {
      return Health.UNHEALTHY
    } else if (arr.some(n => n.health === Health.OK)) {
      return Health.OK
    }
    return Health.UNKNOWN
  }

  componentWillReceiveProps({ healthSummary }: SummaryPanelProps) {
    if (healthSummary !== this.props.healthSummary) {
      this.setState({
        overallHealth: SummaryPanel.getOverallHealth(healthSummary)
      })
    }
  }

  getIconClasses() {
    const { overallHealth } = this.state
    return [healthIcon(overallHealth), healthClass(overallHealth)]
  }

  render() {
    const { className, header, healthSummary, to } = this.props
    const total = healthSummary ? healthSummary.length : 0
    return (
      <Panel header={header} to={to} className={classes('summary-panel', className)} >
        <div className="summary-panel-body">
          {total}
          <StIcon className={classes(...this.getIconClasses())} />
        </div>
      </Panel>
    )
  }
}

export default SummaryPanel

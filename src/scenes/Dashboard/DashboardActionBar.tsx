import { Button, Icon, Menu, MenuItem, Popover, Position } from '@blueprintjs/core'
import * as React from 'react'
import ActionBar from 'src/components/ActionBar/ActionBar'
import Breadcrumbs from 'src/components/Breadcrumbs/Breadcrumbs'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'

interface TimeRangeItem {
  text: string
  selected: boolean
}
interface DashboardActionBarProps {
  refreshRate: number
  isLoading: boolean
  timeRangeItems: TimeRangeItem[]
}
interface State {
  selectedTimeRange: TimeRangeItem
}
class DashboardActionBar extends React.Component<DashboardActionBarProps, State> {
  constructor(props: DashboardActionBarProps) {
    super(props)
    this.state = {
      selectedTimeRange: {
        text: '',
        selected: false
      }
    }
  }
  render() {
    const { refreshRate, isLoading, timeRangeItems } = this.props
    const timeRangeMenu = (
      <Menu className="pt-minimal dashboard-timerange-menu">
        {timeRangeItems.map((n, index) => (
          <MenuItem
            key={index} text={n.text}
            className={n.selected ? 'pt-active' : ''}
            onClick={this.onSelectTimeRange.bind(this, n, timeRangeItems)} />
        ))}
      </Menu>
    )
    return (
      <div className="dashboard-action-bar">
        <ActionBar>
          <div className="action-bar-wrap">
            <Breadcrumbs><BreadcrumbsPageItem name="Dashboard" /></Breadcrumbs>
            <div className="action-bar-actions">
              <span className="pt-text-muted">
                <Icon iconName="refresh" className={isLoading ? 'st-icon-spin' : ''} />
                &nbsp;{refreshRate / 1000} sec
              </span>
              <Popover content={timeRangeMenu} position={Position.BOTTOM_RIGHT}
                inheritDarkTheme={false}
                popoverClassName="pt-minimal">
                <Button text={this.state.selectedTimeRange.text} className="pt-intent-primary">
                  <Icon iconName="chevron-down" className="pt-align-right" />
                </Button>
              </Popover>
            </div>
          </div>
        </ActionBar>
      </div>
    )
  }

  getSelectedTimeRange(items: any[]) {
    return items.find(n => n.selected)
  }
  onSelectTimeRange(selected: TimeRangeItem, items: TimeRangeItem[]) {
    items.forEach(n => n.selected = false)
    selected.selected = true
    this.setState({
      selectedTimeRange: selected
    })
  }

  componentDidMount() {
    this.setState({
      selectedTimeRange: this.getSelectedTimeRange(this.props.timeRangeItems)
    })
  }
}

export default DashboardActionBar

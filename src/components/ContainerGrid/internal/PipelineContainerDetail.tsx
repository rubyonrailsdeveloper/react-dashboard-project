import { Classes, Menu, MenuItem } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import withPhysicalPlanFilters, {
  PhysicalPlanFiltersInjectedProps,
} from 'src/components/Pipeline/withPhysicalPlanFilters'
import HealthIndicator from 'src/components/Symbols/HealthIndicator'
import { Health } from 'src/store/constants'
import { PhysicalPlanContainer } from 'src/store/physical-plan/physical-plan-views'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'

interface PipelineContainerDetailProps extends PhysicalPlanFiltersInjectedProps {
  className?: string
  pipelineId: string
  container: PhysicalPlanContainer
}

class PipelineContainerDetail extends React.Component<PipelineContainerDetailProps> {
  handleAllInstancesClick = () => {
    this.props.setPhysicalPlanFilters(PhysicalPlanFilter.CONTAINER, this.props.container.id)
  }

  render() {
    const { container, filterType, filterValue, setPhysicalPlanFilters } = this.props

    // tslint:disable jsx-no-lambda
    return (
      <Menu className="pipeline-container-detail">
        <MenuItem
          className={classes(filterType === PhysicalPlanFilter.CONTAINER && Classes.ACTIVE)}
          onClick={this.handleAllInstancesClick}
          text="All instances"
        />
        {container.instances.map(({ id, health }) => (
          <li
            key={id}
            className={classes(
              'pipeline-container-detail-instance',
              Classes.MENU_ITEM,
              filterType === PhysicalPlanFilter.INSTANCE && id === filterValue && Classes.ACTIVE
            )}
            onClick={() => setPhysicalPlanFilters(PhysicalPlanFilter.INSTANCE, id)}
          >
            <HealthIndicator health={health || Health.OK} />
            {id}
          </li>
        ))}
      </Menu>
    )
  }
}

export default withPhysicalPlanFilters()(PipelineContainerDetail)

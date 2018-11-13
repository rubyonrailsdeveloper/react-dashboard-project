import {
  Button,
  Classes,
  IconClasses,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
  Position,
  Tag,
} from '@blueprintjs/core'
import classes from 'classnames'
import capitalize from 'lodash-es/capitalize'
import * as React from 'react'
import { connect } from 'react-redux'
import FilterBar from 'src/components/ActionBar/FilterBar'
import Breadcrumbs from 'src/components/Breadcrumbs/Breadcrumbs'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import BreadcrumbsTextItem from 'src/components/Breadcrumbs/BreadcrumbsTextItem'
import ControlledPopover from 'src/components/InlinePopover/ControlledPopover'
import {
  ActivatePipeline,
  DeactivatePipeline,
  TerminatePipeline,
} from 'src/components/Operations/operations'
import ActivePhysicalPlanFilter from 'src/components/Pipeline/ActivePhysicalPlanFilter'
import statusOperationMenuItem from 'src/components/Pipeline/statusOperationMenuItem'
import withPhysicalPlanFilters, {
  PhysicalPlanFiltersInjectedProps,
} from 'src/components/Pipeline/withPhysicalPlanFilters'
import { pipelineStatusIcon } from 'src/constants'
import { groupUrl, namespaceUrl } from 'src/routes'
import { NestedId } from 'src/store/constants'
import { Pipeline, PipelineStatus } from 'src/store/pipeline/pipeline-model'
import { makeGetPipeline } from 'src/store/pipeline/pipeline-reducers'
import { State } from 'src/store/root-reducer'

type OwnProps = NestedId

interface ConnectProps {
  pipeline: Pipeline | null
}

type PipelineActionProps = OwnProps & ConnectProps & PhysicalPlanFiltersInjectedProps

class PipelineActions extends React.Component<PipelineActionProps> {
  handleMenuItemClick = (open: () => void, onClick: () => void) => {
    return () => {
      open()
      onClick()
    }
  }

  render() {
    const { filterType, filterValue, clearPhysicalPlanFilters, pipeline } = this.props

    return (
      pipeline && (
        <div className={classes('action-bar-background', `is-${pipeline.status.toLowerCase()}`)}>
          <div className={classes('pipeline-actions', 'action-bar-wrap')}>
            <Breadcrumbs>
              <BreadcrumbsTextItem
                href={groupUrl({ id: pipeline.group })}
                description="Team"
                name={pipeline.group} />
              <BreadcrumbsTextItem
                href={namespaceUrl({ id: pipeline.namespaceId })}
                description="Namespace"
                name={pipeline.namespace} />
              <BreadcrumbsPageItem name={pipeline.name} />
            </Breadcrumbs>

            <div className="action-bar-actions">
              {pipeline.status !== PipelineStatus.RUNNING && (
                <Tag intent={Intent.WARNING}>{capitalize(pipeline.status)}</Tag>
              )}
              <ControlledPopover
                popoverClassName={Classes.MINIMAL}
                position={Position.BOTTOM_RIGHT}
                popoverTarget={<Button text="More" rightIconName={IconClasses.CHEVRON_DOWN} />}
              >
                {({ close, open, shouldDismissPopover }) => (
                  <Menu>
                    {statusOperationMenuItem(
                      pipeline,
                      close,
                      open,
                      this.handleMenuItemClick,
                      shouldDismissPopover
                    )}
                    <MenuDivider />
                    <TerminatePipeline id={this.props.pipeline!.id} onClose={close}>
                      {({ onClick }) => (
                        <MenuItem
                          iconName={IconClasses.TRASH}
                          intent={Intent.DANGER}
                          text="Terminate"
                          onClick={this.handleMenuItemClick(open, onClick)}
                          shouldDismissPopover={shouldDismissPopover}
                        />
                      )}
                    </TerminatePipeline>
                  </Menu>
                )}
              </ControlledPopover>

              {pipeline.status === PipelineStatus.RUNNING && (
                <DeactivatePipeline id={pipeline.id}>
                  {({ onClick }) => (
                    <Button
                      onClick={onClick}
                      iconName={pipelineStatusIcon(PipelineStatus.PAUSED)}
                      text="Deactivate"
                    />
                  )}
                </DeactivatePipeline>
              )}
              {pipeline.status === PipelineStatus.PAUSED && (
                <ActivatePipeline id={pipeline.id}>
                  {({ onClick }) => (
                    <Button
                      onClick={onClick}
                      iconName={pipelineStatusIcon(PipelineStatus.RUNNING)}
                      text="Activate"
                    />
                  )}
                </ActivatePipeline>
              )}
            </div>

            <FilterBar
              onClearFilter={clearPhysicalPlanFilters}
              filterActive={filterType && !!filterValue}
            >
              <ActivePhysicalPlanFilter filterType={filterType} filterValue={filterValue} />
            </FilterBar>
          </div>
        </div>
      )
    )
  }
}

const connected = connect(() => {
  const getPipeline = makeGetPipeline()

  return (state: State, ownProps: OwnProps) => ({
    pipeline: getPipeline(state, ownProps),
  })
})(PipelineActions)

export default withPhysicalPlanFilters()(connected)

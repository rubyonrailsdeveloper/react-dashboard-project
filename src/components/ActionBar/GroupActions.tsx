import { Button, Classes, IconClasses, Intent, Menu, MenuItem, Position } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import FilterBar from 'src/components/ActionBar/FilterBar'
import Breadcrumbs from 'src/components/Breadcrumbs/Breadcrumbs'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import withClusterFilters, {
  ClusterFiltersInjectedProps,
} from 'src/components/ClusterPanel/withClusterFilters'
import ControlledPopover from 'src/components/InlinePopover/ControlledPopover'
import { GroupUpdate } from 'src/components/Operations/GroupModify'
import { DeleteGroup } from 'src/components/Operations/operations'
import { NestedId } from 'src/store/constants'
import { Group } from 'src/store/group/group-model'
import { makeGetGroup } from 'src/store/group/group-reducers'
import { State } from 'src/store/root-reducer'

interface OwnProps extends NestedId, ClusterFiltersInjectedProps {}

interface ConnectProps {
  group: Group | null
}

type GroupActionsProps = OwnProps & ConnectProps

class GroupActions extends React.Component<GroupActionsProps> {
  handleMenuItemClick = (open: () => void, onClick: () => void) => {
    return () => {
      open()
      onClick()
    }
  }

  render() {
    const { group, cluster, clearClusterFilters } = this.props

    return (
      group && (
        <div className="group-actions action-bar-wrap">
          <Breadcrumbs>
            <BreadcrumbsPageItem name={group.name} />
          </Breadcrumbs>

          <div className="action-bar-actions">
            <ControlledPopover
              popoverClassName={Classes.MINIMAL}
              position={Position.BOTTOM_RIGHT}
              popoverTarget={<Button text="More" rightIconName={IconClasses.CHEVRON_DOWN} />}
            >
              {({ close, open, shouldDismissPopover }) => (
                <Menu>
                  <DeleteGroup id={this.props.id} onClose={close}>
                    {({ onClick }) => (
                      <MenuItem
                        iconName={IconClasses.TRASH}
                        text="Delete"
                        intent={Intent.DANGER}
                        onClick={this.handleMenuItemClick(open, onClick)}
                        shouldDismissPopover={shouldDismissPopover}
                      />
                    )}
                  </DeleteGroup>
                </Menu>
              )}
            </ControlledPopover>
            <GroupUpdate id={this.props.id}>
              {({ onClick }) => (
                <Button onClick={onClick} iconName={IconClasses.EDIT}>
                  Modify
                </Button>
              )}
            </GroupUpdate>
          </div>

          <FilterBar onClearFilter={clearClusterFilters} filterActive={!!cluster}>
            <span className="filter-bar-label">Filtering by cluster:</span>{' '}
            <span className="filter-bar-name">{cluster}</span>
          </FilterBar>
        </div>
      )
    )
  }
}

const connected = connect(() => {
  const getGroup = makeGetGroup()

  return (state: State, ownProps: OwnProps) => ({
    group: getGroup(state, ownProps),
  })
})(GroupActions)

export default withClusterFilters()(connected)

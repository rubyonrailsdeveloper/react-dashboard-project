import {
  Button,
  Classes,
  IconClasses,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
  Position,
} from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import FilterBar from 'src/components/ActionBar/FilterBar'
import Breadcrumbs from 'src/components/Breadcrumbs/Breadcrumbs'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import BreadcrumbsTextItem from 'src/components/Breadcrumbs/BreadcrumbsTextItem'
import {
  ClusterFiltersInjectedProps,
  default as withClusterFilters,
} from 'src/components/ClusterPanel/withClusterFilters'
import ControlledPopover from 'src/components/InlinePopover/ControlledPopover'
import { NamespaceUpdate } from 'src/components/Operations/NamespaceModify'
import {
  ClearBacklogNamespace,
  DeleteNamespace,
  UnloadNamespace,
} from 'src/components/Operations/operations'
import { Icons } from 'src/constants'
import { groupUrl } from 'src/routes'
import { NestedId } from 'src/store/constants'
import { Namespace } from 'src/store/namespace/namespace-model'
import { makeGetNamespace } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'

interface OwnProps extends NestedId, ClusterFiltersInjectedProps {}

interface ConnectProps {
  namespace: Namespace | null
}

type NamespaceActionsProps = OwnProps & ConnectProps

class NamespaceActions extends React.Component<NamespaceActionsProps> {
  handleMenuItemClick = (open: () => void, onClick: () => void) => {
    return () => {
      open()
      onClick()
    }
  }

  render() {
    const { namespace, cluster, clearClusterFilters } = this.props

    return (
      namespace && (
        <div className="namespace-actions action-bar-wrap">
          <Breadcrumbs>
            <BreadcrumbsTextItem href={groupUrl({ id: namespace.groupId })} description="Team" name={namespace.group} />
            <BreadcrumbsPageItem name={namespace.name} />
          </Breadcrumbs>

          <div className="action-bar-actions">
            <div className="action-bar-actions">
              <ControlledPopover
                popoverClassName={Classes.MINIMAL}
                position={Position.BOTTOM_RIGHT}
                popoverTarget={<Button text="More" rightIconName={IconClasses.CHEVRON_DOWN} />}
              >
                {({ close, open, shouldDismissPopover }) => (
                  <Menu>
                    <UnloadNamespace id={this.props.namespace!.id} onClose={close}>
                      {({ onClick }) => (
                        <MenuItem
                          iconName={IconClasses.EXPORT}
                          text="Unload"
                          onClick={this.handleMenuItemClick(open, onClick)}
                          shouldDismissPopover={shouldDismissPopover}
                        />
                      )}
                    </UnloadNamespace>
                    <ClearBacklogNamespace id={this.props.namespace!.id} onClose={close}>
                      {({ onClick }) => (
                        <MenuItem
                          iconName={Icons.BACKLOG}
                          text="Clear Backlog"
                          onClick={this.handleMenuItemClick(open, onClick)}
                          shouldDismissPopover={shouldDismissPopover}
                        />
                      )}
                    </ClearBacklogNamespace>
                    <MenuDivider />
                    <DeleteNamespace id={this.props.namespace!.id} onClose={close}>
                      {({ onClick }) => (
                        <MenuItem
                          iconName={IconClasses.TRASH}
                          intent={Intent.DANGER}
                          text="Delete"
                          onClick={this.handleMenuItemClick(open, onClick)}
                          shouldDismissPopover={shouldDismissPopover}
                        />
                      )}
                    </DeleteNamespace>
                  </Menu>
                )}
              </ControlledPopover>
              <NamespaceUpdate id={this.props.namespace!.id}>
                {({ onClick }) => (
                  <Button onClick={onClick} iconName={IconClasses.EDIT}>
                    Modify
                  </Button>
                )}
              </NamespaceUpdate>
            </div>
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
  const getNamespace = makeGetNamespace()
  return (state: State, params: OwnProps) => ({
    namespace: getNamespace(state, params),
  })
})(NamespaceActions)

export default withClusterFilters()(connected)

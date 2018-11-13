import { IconClasses, Intent, MenuDivider, MenuItem } from '@blueprintjs/core'
import * as React from 'react'
import { NamespaceUpdate } from 'src/components/Operations/NamespaceModify'
import {
  ClearBacklogNamespace,
  DeleteNamespace,
  UnloadNamespace,
} from 'src/components/Operations/operations'
import OperationCell from 'src/components/Tables/OperationCell'
import { Icons } from 'src/constants'

interface NamespaceOperationCellProps {
  id: string
  canDelete: boolean
}

export default class NamespaceOperationCell extends React.Component<NamespaceOperationCellProps> {
  handleMenuItemClick = (open: () => void, onClick: () => void) => {
    return () => {
      open()
      onClick()
    }
  }

  render() {
    return (
      <div>
        <OperationCell>
          {({ close, open, shouldDismissPopover }) => (
            <div>
              <NamespaceUpdate id={this.props.id} onClose={close}>
                {({ onClick }) => (
                  <MenuItem
                    iconName={IconClasses.EDIT}
                    text="Modify"
                    onClick={this.handleMenuItemClick(open, onClick)}
                    shouldDismissPopover={shouldDismissPopover}
                  />
                )}
              </NamespaceUpdate>
              <UnloadNamespace id={this.props.id} onClose={close}>
                {({ onClick }) => (
                  <MenuItem
                    iconName={IconClasses.EXPORT}
                    text="Unload"
                    onClick={this.handleMenuItemClick(open, onClick)}
                    shouldDismissPopover={shouldDismissPopover}
                  />
                )}
              </UnloadNamespace>
              <ClearBacklogNamespace id={this.props.id} onClose={close}>
                {({ onClick }) => (
                  <MenuItem
                    iconName={Icons.BACKLOG}
                    onClick={this.handleMenuItemClick(open, onClick)}
                    shouldDismissPopover={shouldDismissPopover}
                    text="Clear Backlog"
                  />
                )}
              </ClearBacklogNamespace>
              <MenuDivider />
              <DeleteNamespace id={this.props.id} onClose={close}>
                {({ onClick }) => (
                  <MenuItem
                    iconName={IconClasses.TRASH}
                    disabled={!this.props.canDelete}
                    onClick={this.handleMenuItemClick(open, onClick)}
                    shouldDismissPopover={shouldDismissPopover}
                    intent={Intent.DANGER}
                    text="Delete"
                  />
                )}
              </DeleteNamespace>
            </div>
          )}
        </OperationCell>
      </div>
    )
  }
}

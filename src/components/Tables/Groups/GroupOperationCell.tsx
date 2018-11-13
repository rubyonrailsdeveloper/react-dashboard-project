import { IconClasses, Intent, MenuDivider, MenuItem } from '@blueprintjs/core'
import * as React from 'react'
import { GroupUpdate } from 'src/components/Operations/GroupModify'
import { DeleteGroup } from 'src/components/Operations/operations'
import OperationCell from 'src/components/Tables/OperationCell'

interface GroupOperationCellProps {
  id: string
  canDelete: boolean
}

export default class GroupOperationCell extends React.Component<GroupOperationCellProps> {
  handleMenuItemClick = (open: () => void, onClick: () => void) => {
    return () => {
      open()
      onClick()
    }
  }

  render() {
    return (
      <OperationCell>
        {({ close, open, shouldDismissPopover }) => (
          <div>
            <GroupUpdate id={this.props.id} onClose={close}>
              {({ onClick }) => (
                <MenuItem
                  iconName={IconClasses.EDIT}
                  text="Modify"
                  onClick={this.handleMenuItemClick(open, onClick)}
                  shouldDismissPopover={shouldDismissPopover}
                />
              )}
            </GroupUpdate>
            <MenuDivider />
            <DeleteGroup id={this.props.id} onClose={close}>
              {({ onClick }) => (
                <MenuItem
                  iconName={IconClasses.TRASH}
                  disabled={!this.props.canDelete}
                  text="Delete"
                  intent={Intent.DANGER}
                  onClick={this.handleMenuItemClick(open, onClick)}
                  shouldDismissPopover={shouldDismissPopover}
                />
              )}
            </DeleteGroup>
          </div>
        )}
      </OperationCell>
    )
  }
}

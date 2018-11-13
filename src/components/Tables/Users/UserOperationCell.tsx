import { IconClasses, Intent, MenuDivider, MenuItem } from '@blueprintjs/core'
import * as React from 'react'
import { DeleteUser } from 'src/components/Operations/operations'
import { UserUpdate } from 'src/components/Operations/UserModify'
import OperationCell from 'src/components/Tables/OperationCell'

interface PipelineOperationCellProps {
  id: string
}

export default class PipelineOperationCell extends React.Component<PipelineOperationCellProps> {
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
            <UserUpdate id={this.props.id} onClose={close}>
              {({ onClick }) => (
                <MenuItem
                  iconName={IconClasses.EDIT}
                  shouldDismissPopover={shouldDismissPopover}
                  onClick={this.handleMenuItemClick(open, onClick)}
                  text="Modify profile"
                />
              )}
            </UserUpdate>
            <UserUpdate id={this.props.id} type="password" onClose={close}>
              {({ onClick }) => (
                <MenuItem
                  iconName={IconClasses.LOCK}
                  shouldDismissPopover={shouldDismissPopover}
                  onClick={this.handleMenuItemClick(open, onClick)}
                  text="Change password"
                />
              )}
            </UserUpdate>
            <MenuDivider />
            <DeleteUser id={this.props.id} onClose={close}>
              {({ onClick }) => (
                <MenuItem
                  iconName={IconClasses.TRASH}
                  intent={Intent.DANGER}
                  text="Delete"
                  onClick={this.handleMenuItemClick(open, onClick)}
                  shouldDismissPopover={shouldDismissPopover}
                />
              )}
            </DeleteUser>
          </div>
        )}
      </OperationCell>
    )
  }
}

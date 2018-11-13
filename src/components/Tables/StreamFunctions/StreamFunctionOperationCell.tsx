import { IconClasses, Intent, MenuDivider, MenuItem } from '@blueprintjs/core'
import * as React from 'react'
import { StreamFunctionUpdate } from 'src/components/Operations/StreamFunctionModify/StreamFunctionModify'
import { DeleteGroup } from 'src/components/Operations/operations'
import OperationCell from 'src/components/Tables/OperationCell'

interface StreamFunctionOperationCellProps {
  id: string
  canDelete: boolean
}

export default class StreamFunctionOperationCell extends React.Component<StreamFunctionOperationCellProps> {
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
            <StreamFunctionUpdate id={this.props.id} onClose={close}>
              {({ onClick }) => (
                <MenuItem
                  iconName={IconClasses.EDIT}
                  text="Modify"
                  onClick={this.handleMenuItemClick(open, onClick)}
                  shouldDismissPopover={shouldDismissPopover}
                />
              )}
            </StreamFunctionUpdate>
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

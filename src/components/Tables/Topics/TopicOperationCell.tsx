import { IconClasses, Intent, MenuDivider, MenuItem } from '@blueprintjs/core'
import * as React from 'react'
import Copy from 'src/components/Copy/Copy'
import { DeleteTopic, UnloadTopic } from 'src/components/Operations/operations'
import OperationCell from 'src/components/Tables/OperationCell'

interface TopicOperationCellProps {
  id: string
}

const TopicOperationCell: React.SFC<TopicOperationCellProps> = ({ id }) => {
  const handleMenuItemClick = (open: () => void, onClick: () => void) => {
    return () => {
      open()
      onClick()
    }
  }

  return (
    <OperationCell>
      {({ close, open, shouldDismissPopover }) => (
        <div>
          <Copy text={id}>
            <MenuItem iconName={IconClasses.DUPLICATE} text="Copy topic name" />
          </Copy>
          <UnloadTopic id={id} onClose={close}>
            {({ onClick }) => (
              <MenuItem
                iconName={IconClasses.EXPORT}
                text="Unload"
                onClick={handleMenuItemClick(open, onClick)}
                shouldDismissPopover={shouldDismissPopover}
              />
            )}
          </UnloadTopic>
          <MenuDivider />
          <DeleteTopic id={id} onClose={close}>
            {({ onClick }) => (
              <MenuItem
                iconName={IconClasses.TRASH}
                intent={Intent.DANGER}
                text="Delete"
                onClick={handleMenuItemClick(open, onClick)}
                shouldDismissPopover={shouldDismissPopover}
              />
            )}
          </DeleteTopic>
        </div>
      )}
    </OperationCell>
  )
}

export default TopicOperationCell

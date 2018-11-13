import { Button, Classes, IconClasses, Menu, Position } from '@blueprintjs/core'
import * as React from 'react'
import ControlledPopover from 'src/components/InlinePopover/ControlledPopover'

interface OperationCellProps {
  children: (
    props: { shouldDismissPopover: boolean; close(): void; open(): void }
  ) => React.ReactNode
}

// tslint:disable: jsx-no-lambda
const OperationsCell: React.SFC<OperationCellProps> = ({ children }) => (
  <div className="operation-cell">
    <ControlledPopover
      popoverClassName={Classes.MINIMAL}
      position={Position.BOTTOM_RIGHT}
      popoverTarget={<Button iconName={IconClasses.MORE} className={Classes.MINIMAL} />}
    >
      {({ close, open, shouldDismissPopover }) => (
        <Menu>{children({ close, open, shouldDismissPopover })}</Menu>
      )}
    </ControlledPopover>
  </div>
)

export default OperationsCell

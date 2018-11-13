import { IconClasses, MenuItem } from '@blueprintjs/core'
import * as React from 'react'
import ApplyTTL from 'src/components/Operations/ApplyTTL'
import { NestedIdSubscription } from 'src/components/Operations/internal/types'
import { ClearBacklogSubscription } from 'src/components/Operations/operations'
import Peek from 'src/components/Operations/Peek'
import Rollback from 'src/components/Operations/Rollback'
import SkipMessages from 'src/components/Operations/Skip'
import OperationCell from 'src/components/Tables/OperationCell'
import { Icons } from 'src/constants'

export default class ConsumerOperationCell extends React.Component<NestedIdSubscription> {
  handleMenuItemClick = (open: () => void, onClick: () => void) => {
    return () => {
      open()
      onClick()
    }
  }

  peekMessages = () => {
    // console.log('deactivate', this.props.id)
  }

  render() {
    return (
      <OperationCell>
        {({ close, open, shouldDismissPopover }) => (
          <div>
            <SkipMessages onClose={close} {...this.props}>
              {({ onClick }) => (
                <MenuItem
                  iconName={IconClasses.FAST_FORWARD}
                  text="Skip messages"
                  onClick={this.handleMenuItemClick(open, onClick)}
                  shouldDismissPopover={shouldDismissPopover}
                />
              )}
            </SkipMessages>
            <Peek onClose={close} {...this.props}>
              {({ onClick }) => (
                <MenuItem
                  iconName={IconClasses.EYE_OPEN}
                  text="Peek messages"
                  onClick={this.handleMenuItemClick(open, onClick)}
                  shouldDismissPopover={shouldDismissPopover}
                />
              )}
            </Peek>
            <ClearBacklogSubscription onClose={close} {...this.props}>
              {({ onClick }) => (
                <MenuItem
                  iconName={Icons.BACKLOG}
                  text="Clear backlog"
                  onClick={this.handleMenuItemClick(open, onClick)}
                  shouldDismissPopover={shouldDismissPopover}
                />
              )}
            </ClearBacklogSubscription>
            <ApplyTTL onClose={close} {...this.props}>
              {({ onClick }) => (
                <MenuItem
                  iconName={IconClasses.TIME}
                  text="Apply TTL"
                  onClick={this.handleMenuItemClick(open, onClick)}
                  shouldDismissPopover={shouldDismissPopover}
                />
              )}
            </ApplyTTL>
            <Rollback onClose={close} {...this.props}>
              {({ onClick }) => (
                <MenuItem
                  iconName={IconClasses.HISTORY}
                  text="Roll back"
                  onClick={this.handleMenuItemClick(open, onClick)}
                  shouldDismissPopover={shouldDismissPopover}
                />
              )}
            </Rollback>
          </div>
        )}
      </OperationCell>
    )
  }
}

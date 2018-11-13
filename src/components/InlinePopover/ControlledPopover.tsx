import { IPopoverProps, Popover, PopoverInteractionKind } from '@blueprintjs/core'
import * as React from 'react'

interface ChildrenProps {
  shouldDismissPopover: boolean
  open(): void
  close(): void
}

interface ControlledPopoverProps extends IPopoverProps {
  children: (props: ChildrenProps) => JSX.Element
  popoverTarget: JSX.Element
}

interface InlinePopoverState {
  isOpen?: boolean
}

class ControlledPopover extends React.Component<ControlledPopoverProps, InlinePopoverState> {
  state: InlinePopoverState = {}

  close = () => {
    this.setState({ isOpen: false })
  }

  open = () => {
    this.setState({ isOpen: true })
  }

  componentDidUpdate(_: any, oldState: InlinePopoverState) {
    if (this.state.isOpen === false && this.state.isOpen !== oldState.isOpen) {
      this.setState({ isOpen: undefined })
    }
  }

  render() {
    return (
      <Popover
        interactionKind={PopoverInteractionKind.CLICK}
        target={this.props.popoverTarget}
        content={this.props.children({
          close: this.close,
          open: this.open,
          shouldDismissPopover: false,
        })}
        inheritDarkTheme={false}
        {...this.props}
        {...this.state}
      />
    )
  }
}

export default ControlledPopover

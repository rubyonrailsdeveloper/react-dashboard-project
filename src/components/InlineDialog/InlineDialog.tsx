import { Overlay } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'

interface InlineDialogState {
  isOpen: boolean
}

export interface InlineDialogRenderProps {
  isDialogOpen: boolean
  closeDialog(): void
  openDialog(): void
}

interface InlineDialogProps {
  children: (dialogProps: InlineDialogRenderProps) => React.ReactNode
  className?: string
}

class InlineDialog extends React.Component<InlineDialogProps, InlineDialogState> {
  constructor(props: InlineDialogProps) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }

  closeDialog = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false })
    }
  }

  openDialog = () => {
    if (!this.state.isOpen) {
      this.setState({ isOpen: true })
    }
  }

  render() {
    const { closeDialog, openDialog } = this
    const isDialogOpen = this.state.isOpen

    return (
      <Overlay
        autoFocus={false}
        enforceFocus={false}
        inline={true}
        isOpen={true}
        hasBackdrop={isDialogOpen}
        backdropClassName="inline-dialog-backdrop"
        className={classes(
          'inline-dialog',
          this.props.className,
          isDialogOpen && 'inline-dialog-open'
        )}
      >
        <div className="inline-dialog-content">
          {this.props.children({ closeDialog, isDialogOpen, openDialog })}
        </div>
      </Overlay>
    )
  }
}

export default InlineDialog

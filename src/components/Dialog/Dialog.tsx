import { Button, Classes, Dialog as BPDialog, Intent, Spinner } from '@blueprintjs/core'
import classnames from 'classnames'
import * as React from 'react'

export interface CommonDialogProps {
  cancelText?: string
  inline?: boolean
  isBusy: boolean
  isOpen: boolean
  onCancel?: () => void
  submitText?: string
  title?: string
}

export interface DialogProps extends CommonDialogProps {
  confirmationString?: string
  destructive?: boolean
  onSubmit: () => void
  requireConfirmation?: boolean
}

interface DialogState {
  isConfirmed: boolean
}

class Dialog extends React.Component<DialogProps, DialogState> {
  static defaultProps = {
    destructive: false,
    canSubmit: true,
    title: '',
    requireConfirmation: false,
    confirmationString: 'DELETE',
    submitText: 'Confirm',
    cancelText: 'Cancel',
    onCancel: () => {
      return
    },
  }

  state: DialogState = { isConfirmed: false }

  onClose = () => this.setState({ isConfirmed: false })

  onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const isConfirmed =
      (e.target as HTMLInputElement).value.toUpperCase() ===
      this.props.confirmationString!.toUpperCase()
    if (isConfirmed !== this.state.isConfirmed) this.setState({ isConfirmed })
  }

  onSubmit = () => {
    if (this.props.isBusy || (this.props.requireConfirmation && !this.state.isConfirmed)) return

    this.props.onSubmit()
  }

  onCancel = () => {
    if (!this.props.isBusy && this.props.onCancel!()) {
      this.onClose()
    }
  }

  render() {
    const {
      cancelText,
      children,
      confirmationString,
      requireConfirmation,
      submitText,
      destructive,
      inline,
      title,
    } = this.props
    const disabled = this.props.isBusy || (requireConfirmation && !this.state.isConfirmed)

    return (
      <BPDialog
        isCloseButtonShown={false}
        isOpen={this.props.isOpen}
        inline={inline}
        onClose={this.onClose}
        title={title}
        className={classnames(this.props.isBusy && 'busy', Classes.DARK)}
      >
        <div className={Classes.DIALOG_BODY}>{children}</div>
        {requireConfirmation && (
          <div className="dialog-confirmation">
            <label>
              Type <code>{confirmationString}</code> to confirm.
            </label>
            <input className={Classes.INPUT} type="text" onChange={this.onChange} />
          </div>
        )}
        <footer className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              className="cancel"
              text={cancelText}
              onClick={this.onCancel}
              disabled={this.props.isBusy}
            />
            <Button
              className="submit"
              intent={destructive ? Intent.DANGER : Intent.PRIMARY}
              onClick={this.onSubmit}
              disabled={disabled}
            >
              <Spinner className={Classes.SMALL} />
              <span>{submitText}</span>
            </Button>
          </div>
        </footer>
      </BPDialog>
    )
  }
}

export default Dialog

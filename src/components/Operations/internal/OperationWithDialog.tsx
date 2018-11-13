import * as React from 'react'
import Dialog from 'src/components/Dialog/Dialog'
import makeOperation, { OperationPartialProps } from 'src/components/Operations/internal/Operation'
import { showFailedTextToast, showSuccessTextToast } from 'src/components/Toasts/TextToast'
import { NestedId } from 'src/store/constants'

export interface CustomPartialDialogProps
  extends NestedId,
    NestedOperationOn,
    OperationWithDialogNestedChildrenProps {}

export interface OperationWithDialogNestedChildrenProps {
  children: (props: { onClick(): void }) => React.ReactNode
}

interface NestedOperationOn {
  onClose?(): void
  onSuccess?(data?: any): void
}

interface OperationWithDialogProps<T>
  extends NestedOperationOn,
    OperationWithDialogNestedChildrenProps,
    OperationPartialProps<T, string> {
  dialogBody: React.ReactElement<{}>
  hideToast?: boolean
  toastSuccessText: string
  toastFailureText: string
}

interface OperationWithDialogState {
  isDialogOpen: boolean
}

const makeOperationWithDialog = <T extends {}, U extends {}>() => {
  const Operation = makeOperation<T, string>()
  type Props = OperationWithDialogProps<T> & T & U

  return class OperationWithDialog extends React.Component<Props, OperationWithDialogState> {
    static defaultProps = {
      toastSuccessText: '',
      toastFailureText: '',
    }

    state: OperationWithDialogState = {
      isDialogOpen: false,
    }

    constructor(props: Props) {
      super(props)
      if (!props.hideToast && (props.toastSuccessText === '' || props.toastFailureText === '')) {
        throw Error('toastSuccessText or toastFailureText is missing')
      }
    }

    closeDialog = () => {
      this.setState({
        isDialogOpen: false,
      })

      if (this.props.onClose) this.props.onClose()
    }

    onSuccess = (data?: any) => {
      if (this.props.onSuccess) {
        this.props.onSuccess(data)
      } else this.closeDialog()

      if (!this.props.hideToast) {
        showSuccessTextToast(this.props.toastSuccessText!)
      }
    }

    onError = () => {
      this.closeDialog()
      if (!this.props.hideToast) {
        showFailedTextToast(this.props.toastFailureText!)
      }
    }

    openDialog = () => {
      this.setState({
        isDialogOpen: true,
      })
    }

    render() {
      const { children, ...props } = this.props as any
      return (
        <div>
          <Operation onSuccess={this.onSuccess} onError={this.onError} {...props}>
            {({ isLoading, triggerOperation }) => {
              return (
                <Dialog
                  isOpen={this.state.isDialogOpen}
                  isBusy={isLoading}
                  onSubmit={triggerOperation}
                  onCancel={this.closeDialog}
                  {...props}
                >
                  {this.props.dialogBody}
                </Dialog>
              )
            }}
          </Operation>
          {children({ onClick: this.openDialog })}
        </div>
      )
    }
  }
}

export default makeOperationWithDialog

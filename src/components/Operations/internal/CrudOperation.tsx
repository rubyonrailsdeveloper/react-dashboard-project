import * as React from 'react'
import { connect } from 'react-redux'
import { showSuccessTextToast } from 'src/components/Toasts/TextToast'
import { OperationState } from 'src/store/internal/operation'
import { State } from 'src/store/root-reducer'
import { ActionCreator } from 'typescript-fsa'

interface CrudOwnProps {
  id?: string
  parentId?: string
  type?: string
  onClose?: () => void
  toastSuccessText?: string
  children: (props: { onClick(): any }) => React.ReactNode
}

interface CrudConnectedProps<ActionType, Result> {
  state: State
  operation: ActionCreator<ActionType>
  operationState: OperationState<Result>
}

export type CrudOperationProps<ActionType, Result> = CrudOwnProps &
  CrudConnectedProps<ActionType, Result>

interface CrudOperationState<Result> {
  isOpen: boolean
  errors?: Result | null
}

export interface CrudFormProps {
  id?: string
  parentId?: string
  type?: string
  errors?: {} | null
  onClose: () => void
  onSubmit: (id: string, params: any) => void
  isBusy: boolean
  isOpen: boolean
}

const makeCrudOperation = <ActionType extends {}, Result extends {}>(
  Component: React.ComponentClass<CrudFormProps>,
  operation: ActionCreator<any>,
  operationState: (state: State, id?: string) => OperationState<any> | null
) => {
  class OperationWithDialog extends React.Component<
    CrudOperationProps<ActionType, Result>,
    CrudOperationState<Result>
  > {
    state: CrudOperationState<Result> = { isOpen: false }

    componentDidUpdate(oldProps: Partial<CrudOperationProps<ActionType, Result>>) {
      const { operationState: newState } = this.props
      const { operationState: oldState } = oldProps

      if (!newState) return

      if (newState.result && (oldState ? oldState.result !== newState.result : true)) {
        return this.onSuccess()
      }

      if (newState.error && (oldState ? oldState.error !== newState.error : true)) {
        this.setState({ errors: newState.result })
      }
    }

    onSubmit = (requester: string, params: any) => {
      this.props.operation({ requester, ...params })
    }

    onSuccess = () => {
      const { id, toastSuccessText } = this.props
      this.closeDialog()
      showSuccessTextToast(toastSuccessText || id ? 'Updated Successfully' : 'Created Successfully')
    }

    openDialog = () => this.setState({ isOpen: true })

    closeDialog = () => {
      this.setState({ isOpen: false })
      if (this.props.onClose) this.props.onClose()
    }

    render() {
      const { children, id, parentId, type, operationState: os } = this.props

      return (
        <div>
          <Component
            id={id}
            parentId={parentId}
            type={type}
            onClose={this.closeDialog}
            isOpen={this.state.isOpen}
            onSubmit={this.onSubmit}
            isBusy={!!os && os.isLoading}
            errors={this.state.errors}
          />
          {children({ onClick: this.openDialog })}
        </div>
      )
    }
  }

  return connect(
    (state: State, props: CrudOwnProps) => ({
      operationState: operationState(state, props.id),
      state,
    }),
    { operation }
  )(OperationWithDialog)
}

export default makeCrudOperation

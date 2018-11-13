import * as React from 'react'
import { OperationState } from 'src/store/internal/operation'
import { ActionCreator } from 'typescript-fsa'

interface OperationNestedChildrenProps {
  children: (props: { isLoading: boolean; triggerOperation(): void }) => React.ReactNode
}

export interface OperationPartialProps<ActionProps, Result> {
  triggerOperation: ActionCreator<ActionProps>
  operation: OperationState<Result>
}

interface OperationProps extends OperationNestedChildrenProps {
  onTrigger?: () => void
  onError: () => void
  onSuccess: (data?: any) => void
}

const makeOperation = <ActionProps extends {}, Result extends {}>() => {
  type Props = OperationProps & OperationPartialProps<ActionProps, Result> & ActionProps

  return class Operation extends React.Component<Props> {
    componentDidUpdate(oldProps: Partial<Props>) {
      if (!this.props.operation) return

      if (
        this.props.operation.result &&
        (oldProps.operation ? oldProps.operation.result !== this.props.operation.result : true)
      ) {
        this.props.onSuccess(this.props.operation.result)
        return
      }

      if (
        this.props.operation.error &&
        (oldProps.operation ? oldProps.operation.error !== this.props.operation.error : true)
      ) {
        this.props.onError()
        return
      }
    }

    triggerOperation = () => {
      this.props.triggerOperation((this.props as any) as ActionProps)

      if (this.props.onTrigger) this.props.onTrigger()
    }

    render() {
      return this.props.children({
        isLoading: this.props.operation ? this.props.operation.isLoading : false,
        triggerOperation: this.triggerOperation,
      })
    }
  }
}

export default makeOperation

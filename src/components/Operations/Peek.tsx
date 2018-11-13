import { Classes } from '@blueprintjs/core'
import _uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'
import { connect } from 'react-redux'
import makeOperationWithDialog, {
  CustomPartialDialogProps,
} from 'src/components/Operations/internal/OperationWithDialog'
import {
  DialogBaseProps,
  NestedIdSubscription,
  SubscriptionNestedId,
} from 'src/components/Operations/internal/types'
import { getNumberInputValue } from 'src/components/Operations/internal/utils'
import { State } from 'src/store/root-reducer'
import { PeekSubscriptionPayload, triggerPeekSubscription } from 'src/store/topic/topic-actions'
import { getPeekSubscriptionState } from 'src/store/topic/topic-reducers'

interface RollbackProps extends CustomPartialDialogProps, SubscriptionNestedId {}

interface PeekState {
  position: number
  data?: any
}

const PeekDialogOperation = makeOperationWithDialog<PeekSubscriptionPayload, DialogBaseProps>()

const PeekOperation = connect(
  () => {
    const requester = _uniqueId('PeekOperation')

    return (state: State, { id, subscription }: NestedIdSubscription) => ({
      operation: getPeekSubscriptionState(state, { id, subscription }) as any, // todo: remove any
      requester,
    })
  },
  {
    triggerOperation: triggerPeekSubscription,
  }
)(PeekDialogOperation)

class Peek extends React.Component<RollbackProps, PeekState> {
  submitText = 'Peek'
  title = 'Peek'
  state: PeekState = {
    position: 10,
  }

  onChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      position: getNumberInputValue(evt),
    })
  }

  onPeek = (data: any[]) => {
    this.setState({ data })
  }

  render() {
    return (
      <PeekOperation
        dialogBody={<PeekBody onChange={this.onChange} {...this.state} />}
        submitText={this.submitText}
        title={this.title}
        position={this.state.position}
        hideToast={true}
        onSuccess={this.onPeek}
        {...PeekDialogOperation.defaultProps}
        {...this.props}
      >
        {props => this.props.children(props)}
      </PeekOperation>
    )
  }
}

interface PeekBodyProps extends PeekState {
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void
}

const PeekBody: React.SFC<PeekBodyProps> = ({ onChange, data, position }) => {
  return (
    <div className="peek">
      <p>Number of messages to peek</p>
      <input
        className={Classes.INPUT}
        type="number"
        value={position}
        onChange={onChange}
        style={{ width: '100%' }}
      />
      {data && <pre className="peek-data">{data}</pre>}
    </div>
  )
}

export default Peek

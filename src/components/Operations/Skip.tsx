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
import {
  SkipSubscriptionMsgsPayload,
  triggerSkipSubscriptionMsgs,
} from 'src/store/topic/topic-actions'
import { getSkipSubscriptionMsgsState } from 'src/store/topic/topic-reducers'

interface SkipProps extends CustomPartialDialogProps, SubscriptionNestedId {}

interface SkipMessagesState {
  messages: number
  submitText: string
}

const SkipSubscriptionOperation = makeOperationWithDialog<
  SkipSubscriptionMsgsPayload,
  DialogBaseProps
>()

const SkipOperation = connect(
  () => {
    const requester = _uniqueId('SkipOperation')

    return (state: State, { id, subscription }: NestedIdSubscription) => ({
      operation: getSkipSubscriptionMsgsState(state, { id, subscription }) as any, // todo: remove as any
      requester,
    })
  },
  {
    triggerOperation: triggerSkipSubscriptionMsgs,
  }
)(SkipSubscriptionOperation)

class Skip extends React.Component<SkipProps, SkipMessagesState> {
  title = 'Skip Messages'
  state = {
    messages: 1,
    submitText: `Skip 1 message`,
  }

  onChange = (evt: React.FormEvent<HTMLInputElement>) => {
    const value = getNumberInputValue(evt)

    this.setState({
      messages: value,
      submitText: `Skip ${value} message${value > 1 ? 's' : ''}`,
    })
  }

  render() {
    return (
      <SkipOperation
        dialogBody={<SkipBody onChange={this.onChange} messages={this.state.messages} />}
        messages={this.state.messages}
        submitText={this.state.submitText}
        title={this.title}
        toastSuccessText={`Subscription ${this.props.id} skiped ${this.state.messages} messages`}
        toastFailureText={`Subscription ${this.props.id} could not skip ${
          this.state.messages
        } messages`}
        {...this.props}
      >
        {props => this.props.children(props)}
      </SkipOperation>
    )
  }
}

const SkipBody = (props: {
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void
  messages: number
}) => {
  return (
    <div>
      <p>Number of messages to skip</p>
      <input
        className={Classes.INPUT}
        type="number"
        value={props.messages}
        {...props}
        style={{ width: '100%' }}
      />
    </div>
  )
}

export default Skip

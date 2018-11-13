import { Classes } from '@blueprintjs/core'
import classes from 'classnames'
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
  ApplySubscriptionTtlPayload,
  triggerApplySubscriptionTtl,
} from 'src/store/topic/topic-actions'
import { getApplySubscriptionTtlState } from 'src/store/topic/topic-reducers'

interface ApplyTTLProps extends SubscriptionNestedId, CustomPartialDialogProps {}
interface ApplyTTLState {
  ttl: number
}

const ApplyTTLSubscriptionOperation = makeOperationWithDialog<
  ApplySubscriptionTtlPayload,
  DialogBaseProps
>()

const ApplyTTLOperation = connect(
  () => {
    const requester = _uniqueId('ApplyTTLOperation')

    return (state: State, { id, subscription }: NestedIdSubscription) => ({
      operation: getApplySubscriptionTtlState(state, { id, subscription }) as any,
      requester,
    })
  },
  {
    triggerOperation: triggerApplySubscriptionTtl,
  }
)(ApplyTTLSubscriptionOperation)

class ApplyTTL extends React.Component<ApplyTTLProps, ApplyTTLState> {
  title = 'Apply TTL'
  submitText = 'Apply new TTL'
  state = {
    ttl: 60,
  }

  onChange = (ttl: number) => {
    this.setState({ ttl })
  }

  render() {
    return (
      <ApplyTTLOperation
        dialogBody={<ApplyTTLBody onChange={this.onChange} />}
        submitText={this.submitText}
        title={this.title}
        toastSuccessText={`Applied TTL to subscription ${this.props.id}`}
        toastFailureText={`Subscription ${this.props.id} could not apply TTL`}
        ttl={this.state.ttl}
        {...this.props}
      >
        {props => this.props.children(props)}
      </ApplyTTLOperation>
    )
  }
}

enum ApplyTTLUnit {
  HOUR = 'Hour',
  MINUTE = 'Minute',
  DAY = 'Day',
}

interface ApplyTTLBodyProps {
  onChange: (ttl: number) => void
}

interface ApplyTTLBodyState {
  unitlessTTL: number
  TTLUnit: ApplyTTLUnit
}

// tslint:disable-next-line: max-classes-per-file
class ApplyTTLBody extends React.Component<ApplyTTLBodyProps, ApplyTTLBodyState> {
  state: ApplyTTLBodyState = {
    unitlessTTL: 1,
    TTLUnit: ApplyTTLUnit.MINUTE,
  }

  unitToSeconds = (unit: ApplyTTLUnit): number => {
    switch (unit) {
      case ApplyTTLUnit.MINUTE:
        return 60
      case ApplyTTLUnit.HOUR:
        return 3600
      case ApplyTTLUnit.DAY:
        return 86400
      default:
        return 1
    }
  }

  updateTimeUnit = (event: React.FormEvent<HTMLSelectElement>) => {
    const TTLUnit = event.currentTarget.value as ApplyTTLUnit

    this.props.onChange(this.state.unitlessTTL * this.unitToSeconds(TTLUnit))
    this.setState({ TTLUnit })
  }

  updateUnitlessTtl = (event: React.FormEvent<HTMLInputElement>) => {
    const unitlessTTL = getNumberInputValue(event)

    this.props.onChange(unitlessTTL * this.unitToSeconds(this.state.TTLUnit))
    this.setState({ unitlessTTL })
  }

  render() {
    return (
      <div className="apply-ttl">
        <p>Please select a new TTL (Time To Live)</p>

        <div className={classes(Classes.FORM_GROUP, Classes.INLINE, 'labeled-input')}>
          <div className={Classes.FORM_CONTENT}>
            <input
              className={Classes.INPUT}
              type="number"
              placeholder="seconds"
              value={this.state.unitlessTTL}
              onChange={this.updateUnitlessTtl}
            />
          </div>
          {/*<label className={`${Classes.LABEL} st-button-label`}>Seconds</label>*/}
          <div className={`${Classes.SELECT} ${Classes.LABEL}`}>
            <select onChange={this.updateTimeUnit} value={this.state.TTLUnit}>
              <option value={ApplyTTLUnit.MINUTE}>{ApplyTTLUnit.MINUTE}</option>
              <option value={ApplyTTLUnit.HOUR}>{ApplyTTLUnit.HOUR}</option>
              <option value={ApplyTTLUnit.DAY}>{ApplyTTLUnit.DAY}</option>
            </select>
          </div>
        </div>
      </div>
    )
  }
}

export default ApplyTTL

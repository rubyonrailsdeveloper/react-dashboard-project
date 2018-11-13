import { Classes, IconClasses, Radio, RadioGroup } from '@blueprintjs/core'
import { DateInput, TimePickerPrecision } from '@blueprintjs/datetime'
import subHours from 'date-fns/sub_hours'
import subMinutes from 'date-fns/sub_minutes'
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
import { StDateTimeFormat } from 'src/constants'
import { State } from 'src/store/root-reducer'
import {
  RollbackSubscriptionPayload,
  triggerRollbackSubscription,
} from 'src/store/topic/topic-actions'
import { getRollbackSubscriptionState } from 'src/store/topic/topic-reducers'

interface RollbackProps extends CustomPartialDialogProps, SubscriptionNestedId {}

interface RollbackState {
  time: Date
}

const RollbackSubscriptionOperation = makeOperationWithDialog<
  RollbackSubscriptionPayload,
  DialogBaseProps
>()

const RollbackOperation = connect(
  () => {
    const requester = _uniqueId('RollbackOperation')

    return (state: State, { id, subscription }: NestedIdSubscription) => ({
      operation: getRollbackSubscriptionState(state, { id, subscription }) as any, // todo: remove any
      requester,
    })
  },
  {
    triggerOperation: triggerRollbackSubscription,
  }
)(RollbackSubscriptionOperation)

class Rollback extends React.Component<RollbackProps, RollbackState> {
  submitText = 'Roll back'
  title = 'Roll back'
  state = {
    time: new Date(),
  }

  onTimeUpdate = (selectedDate: Date) => {
    this.setState({
      time: selectedDate,
    })
  }

  render() {
    return (
      <RollbackOperation
        dialogBody={<RollbackBody onTimeUpdate={this.onTimeUpdate} time={this.state.time} />}
        submitText={this.submitText}
        title={this.title}
        time={this.state.time}
        toastSuccessText={`Subscription ${this.props.id} roll back to ${this.state.time}`}
        toastFailureText={`Subscription ${this.props.id} could not roll back to ${this.state.time}`}
        {...this.props}
      >
        {props => this.props.children(props)}
      </RollbackOperation>
    )
  }
}

interface RollbackBodyProps {
  onTimeUpdate: (selectedDate: Date) => void
  time: Date
}

interface RollbackBodyState {
  selectedRadio: RollbackRadio
  dateSelectorDisabled: boolean
}

enum RollbackRadio {
  DATE_SELECTOR = 'Rollback to a custom date',
  TEN_MIN = '10 min',
  THREE_HOURS = '3h',
  SIX_HOURS = '6h',
  TWELVE_HOURS = '12h',
}

// tslint:disable-next-line: max-classes-per-file
class RollbackBody extends React.Component<RollbackBodyProps, RollbackBodyState> {
  constructor(props: RollbackBodyProps) {
    super(props)
    this.state = { selectedRadio: RollbackRadio.TEN_MIN, dateSelectorDisabled: true }
  }

  rollbackRadioToDate = (radio: RollbackRadio): Date => {
    const now = Date.now()

    switch (radio) {
      case RollbackRadio.TEN_MIN:
        return subMinutes(now, 10)
      case RollbackRadio.THREE_HOURS:
        return subHours(now, 3)
      case RollbackRadio.SIX_HOURS:
        return subHours(now, 6)
      case RollbackRadio.TWELVE_HOURS:
        return subHours(now, 12)
      default:
        return new Date()
    }
  }

  selectRadio = (event: React.FormEvent<HTMLInputElement>) => {
    const selectedRadio = event.currentTarget.value as RollbackRadio
    const toggleDateSelector = selectedRadio === RollbackRadio.DATE_SELECTOR

    this.props.onTimeUpdate(this.rollbackRadioToDate(selectedRadio))

    this.setState(prevState => ({
      dateSelectorDisabled: toggleDateSelector ? !prevState.dateSelectorDisabled : true,
      selectedRadio,
    }))
  }

  render() {
    return (
      <div className="roll-back">
        <p>How far do you want to roll back in time?</p>
        <RadioGroup onChange={this.selectRadio} selectedValue={this.state.selectedRadio}>
          <Radio label={RollbackRadio.TEN_MIN} value={RollbackRadio.TEN_MIN} />
          <Radio label={RollbackRadio.THREE_HOURS} value={RollbackRadio.THREE_HOURS} />
          <Radio label={RollbackRadio.SIX_HOURS} value={RollbackRadio.SIX_HOURS} />
          <Radio label={RollbackRadio.TWELVE_HOURS} value={RollbackRadio.TWELVE_HOURS} />
          <Radio label={RollbackRadio.DATE_SELECTOR} value={RollbackRadio.DATE_SELECTOR} />
        </RadioGroup>

        <DateInput
          disabled={this.state.dateSelectorDisabled}
          format={StDateTimeFormat.LONG_WITH_MS}
          maxDate={new Date()}
          onChange={this.props.onTimeUpdate}
          timePrecision={TimePickerPrecision.MILLISECOND}
          value={this.props.time}
          inputProps={{ leftIconName: IconClasses.CALENDAR }}
          popoverProps={{ popoverClassName: Classes.MINIMAL }}
        />
      </div>
    )
  }
}

export default Rollback

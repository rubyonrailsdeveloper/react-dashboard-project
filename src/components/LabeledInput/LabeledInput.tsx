import { Classes } from '@blueprintjs/core'
import classes from 'classnames'
import uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'

interface LabeledInputProps {
  label: string
  input: (props: LabeledInputPassedProps) => React.ReactNode
  className?: string
}

export interface LabeledInputPassedProps {
  id: string
}

export default class LabeledInput extends React.Component<LabeledInputProps> {
  seqId = uniqueId()

  render() {
    const { label, input, className } = this.props
    const id = `labeled-input-${this.seqId}`

    return (
      <div className={classes(Classes.FORM_GROUP, Classes.INLINE, 'labeled-input', className)}>
        <label className={`${Classes.LABEL} st-button-label`} htmlFor={id}>
          {label}
        </label>
        <div className={Classes.FORM_CONTENT}>{input({ id })}</div>
      </div>
    )
  }
}

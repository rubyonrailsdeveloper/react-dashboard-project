import isNumber from 'lodash-es/isNumber'
import isString from 'lodash-es/isString'
import * as React from 'react'
import { ChangeEventHandler } from 'react'
import LabeledInput, { LabeledInputPassedProps } from 'src/components/LabeledInput/LabeledInput'
import { Omit } from 'src/types'

export interface PerPageInputProps extends Omit<React.HTMLProps<HTMLSelectElement>, 'onChange'> {
  itemLabel?: string
  options: number[] | 'many' | 'few'
  onChange: (perPage: number) => void
  totalListItems?: number | null
}

export default class PerPageInput extends React.Component<PerPageInputProps> {
  static options = {
    many: [20, 50, 100],
    few: [8, 16, 32],
  }

  handleOnChange: ChangeEventHandler<HTMLSelectElement> = ev => this.props.onChange(+ev.target.value)

  showOption = (val: number, total?: number | null) => {
    if (!total) {
      return true
    }
    return total > val
  }

  render() {
    const { options, totalListItems } = this.props
    const opts = isString(options) ? PerPageInput.options[options] : options!
    const showComponent = totalListItems ? totalListItems > Math.min.apply(Math, opts) : true
    return showComponent && <LabeledInput label="Show" input={this.renderInput} />
  }

  renderInput = ({ id }: LabeledInputPassedProps) => {
    const { options, itemLabel, totalListItems, value, ...selectProps } = this.props

    const opts = isString(options) ? PerPageInput.options[options] : options!
    const items = isNumber(value) ? value : parseInt(value as string, 10)
    return (
      <div className="pt-select">
        <select id={id} value={items} {...selectProps} onChange={this.handleOnChange}>
          {opts.map(val => (
            this.showOption(val, totalListItems) &&
            <option key={val} value={val} label={`${val} ${itemLabel}`}>
              {val}
            </option>
          ))}
          {!opts.includes(items) && (
            <option value={items} label={`${items} ${itemLabel}`}>
              {items}
            </option>
          )}
        </select>
      </div>
    )
  }
}

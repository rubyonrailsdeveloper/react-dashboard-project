import map from 'lodash-es/map'
import * as React from 'react'
import { ChangeEvent } from 'react'
import LabeledInput, { LabeledInputPassedProps } from 'src/components/LabeledInput/LabeledInput'
import { SortOrder } from 'src/constants'
import { FieldsDescriptor } from 'src/util/fields-descriptor'

export type SortChangeHandler = (field: string, order: SortOrder) => void

interface SortInputProps {
  fields: FieldsDescriptor<any>
  field: string
  order: SortOrder
  onChange: SortChangeHandler
}

export default class SortInput extends React.Component<SortInputProps> {
  handleFieldChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    this.props.onChange(ev.target.value, SortOrder.ASC)
  }

  handleOrderChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    this.props.onChange(this.props.field, ev.target.value as SortOrder)
  }

  render() {
    return <LabeledInput label="Sort by" input={this.renderInput} />
  }

  renderInput = ({ id }: LabeledInputPassedProps) => {
    const { fields, field, order } = this.props

    return (
      <div className="pt-control-group">
        <div className="pt-select">
          <select id={id} value={field} onChange={this.handleFieldChange}>
            {map(
              fields,
              f =>
                f.sortIterator && (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                )
            )}
          </select>
        </div>
        <div className="pt-select">
          <select value={order} onChange={this.handleOrderChange}>
            <option value={SortOrder.ASC}>Asc</option>
            <option value={SortOrder.DESC}>Desc</option>
          </select>
        </div>
      </div>
    )
  }
}

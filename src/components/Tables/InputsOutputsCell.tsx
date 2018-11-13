import { Icon, Tooltip } from '@blueprintjs/core'
import isNumber from 'lodash-es/isNumber'
import isString from 'lodash-es/isString'
import * as React from 'react'
import { Icons } from 'src/constants'

interface InputsOutputsCellProps {
  inputs?: number | string
  outputs?: number | string
}

const InputsOutputsCell: React.SFC<InputsOutputsCellProps> = ({ inputs, outputs }) => (
  <div className="inputs-outputs-cell">
    {(isString(inputs) || isNumber(inputs)) && (
      <Tooltip content={`${inputs} In`}>
        <span>
          {inputs}
          <Icon iconName={Icons.INPUT} />
        </span>
      </Tooltip>
    )}
    {(isString(outputs) || isNumber(outputs)) && (
      <Tooltip content={`${outputs} Out`}>
        <span>
          {outputs}
          <Icon iconName={Icons.OUTPUT} />
        </span>
      </Tooltip>
    )}
  </div>
)

export default InputsOutputsCell

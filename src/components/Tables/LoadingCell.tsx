import { Classes } from '@blueprintjs/core'
import * as React from 'react'

const fullWidth = { width: '100%' }
const LoadingCell: React.SFC = () => (
  <div style={fullWidth} className={`${Classes.SKELETON} table-loading`}>
    &nbsp;
  </div>
)

export default LoadingCell

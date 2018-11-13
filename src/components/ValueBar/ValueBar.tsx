import * as React from 'react'
import { Link } from 'react-router-dom'

interface ValueBarProps {
  label: string
  value: number
  valueLabel?: string
  max: number
  barColor?: string
}
class ValueBar extends React.Component<ValueBarProps> {

  render() {
    const { label, value, valueLabel, max, barColor='#525259'} = this.props
    const percent = Math.floor(value / max * 100) + '%'
    const style = {
      width: percent,
      backgroundColor: barColor
    }
    return (
      <div className="value-bar">
        <Link className="value-bar-label" to={`/groups/${label}`}>{label}</Link>
        <div className="value-bar-bar">
          <div className="value-bar-bar-inner" style={style}>
            {valueLabel &&<div className="value-bar-value">{valueLabel}</div>}
          </div>
        </div>
      </div>
    )
  }
}

export default ValueBar

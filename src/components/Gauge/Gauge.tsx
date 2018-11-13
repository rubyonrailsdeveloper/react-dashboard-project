import C3Chart from 'node_modules/react-c3js'
import * as React from 'react'

interface GaugeProps {
  percent: number
  gauge?: any
  size?: any
}

const defaults = {
  data: {type: 'gauge'},
  gauge: {
    width: 8,
    label: {
      show: false
    }
  },
  color: {
    pattern: ['#40b85e', '#ffbf12', '#ff2248'],
    threshold: {
      values: [80, 90, 100]
    }
  },
  size: {
    height: 99,
    width: 198
  },
  axis: {
    x: {show: false},
    y: {show: false}
  },
  legend: {
    show: false
  },
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  tooltip: {
    show: false
  }
}

class Gauge extends React.PureComponent<GaugeProps> {
  render() {
    const data = {...{columns: [['data', this.props.percent]]}, ...defaults.data}
    const gauge = {...defaults.gauge, ...this.props.gauge}
    const size = {...defaults.size, ...this.props.size}
    return (
      <div className="st-gauge">
        <C3Chart data={data} gauge={gauge}
          size={size}
          padding={defaults.padding}
          color={defaults.color}
          axis={defaults.axis}
          legend={defaults.legend}
          tooltip={defaults.tooltip} />
      </div>
    )
  }
}

export default Gauge

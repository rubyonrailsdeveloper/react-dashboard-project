import clamp from 'lodash-es/clamp'
import * as React from 'react'

interface PieChartIconProps {
  value: number
}

function getCoordinatesForPercent(percent: number) {
  const x = Math.cos(2 * Math.PI * percent)
  const y = Math.sin(2 * Math.PI * percent)

  return [x, y]
}

const startX = getCoordinatesForPercent(0)[0]
const startY = getCoordinatesForPercent(0)[1]

const PieChartIcon: React.SFC<PieChartIconProps> = ({ value }) => {
  value = clamp(value, 0, 1)

  const endX = getCoordinatesForPercent(value)[0]
  const endY = getCoordinatesForPercent(value)[1]

  const largeArcFlag = value > 0.5 ? 1 : 0

  return (
    <svg className="pie-chart-icon" viewBox="-1 -1 2 2">
      <circle cx="0" cy="0" r="1" className="pie-chart-icon-bg" />
      <path
        d={`M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`}
        className={
          value < 0.5
            ? 'pie-chart-icon-fill-success'
            : value < 0.75 ? 'pie-chart-icon-fill-warning' : 'pie-chart-icon-fill-danger'
        }
      />
    </svg>
  )
}

export default PieChartIcon

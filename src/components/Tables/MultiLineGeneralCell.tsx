import * as React from 'react'
import { ReactNode } from 'react'

interface MultiLineGeneralCellProps {
  children: ReactNode
  max?: number
}

const MultiLineGeneralCell: React.SFC<MultiLineGeneralCellProps> = ({ children, max }) => {
  const childrenArray = React.Children.toArray(children)
  const renderedData = childrenArray.length > max! + 1 ? childrenArray.slice(0, max) : childrenArray
  return (
    <div className="multi-line-cell">
      {renderedData}
      {childrenArray.length > max! + 1 && childrenArray.length - max! + ' more'}
    </div>
  )
}

MultiLineGeneralCell.defaultProps = {
  max: 2,
}

export default MultiLineGeneralCell

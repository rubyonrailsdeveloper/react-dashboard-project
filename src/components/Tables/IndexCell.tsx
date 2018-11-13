import * as React from 'react'

interface IndexCellProps {
  name: string
}

const IndexCell: React.SFC<IndexCellProps> = ({ name }) => (
  <div className="index-cell">
    <div className="index-cell-title">{name[0].toUpperCase()}</div>
  </div>
)

export default IndexCell

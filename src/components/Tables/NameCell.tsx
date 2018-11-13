import * as React from 'react'

interface NameCellProps {
  prefix1?: string
  prefix2?: string
  name: string
}

const NameCell: React.SFC<NameCellProps> = ({ prefix1, prefix2, name }) => (
  <div className="name-cell">
    <div className="name-cell-prefix">
      {prefix1 && <span>{prefix1}</span>}
      {prefix2 && <span>{prefix2}</span>}
    </div>
    <div className="name-cell-title">{name}</div>
  </div>
)

export default NameCell

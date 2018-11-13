import * as React from 'react'

interface TopicInsOutsNameCellProps {
  client?: string
  name: string
}

const TopicInsOutsNameCell: React.SFC<TopicInsOutsNameCellProps> = ({ client, name }) => (
  <div className="name-cell">
    <div className="name-cell-title">{name}</div>
    {client && <div className="name-cell-prefix">{client}</div>}
  </div>
)

export default TopicInsOutsNameCell

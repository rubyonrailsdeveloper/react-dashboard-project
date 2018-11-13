import distanceInWordsStrict from 'date-fns/distance_in_words_strict'
import * as React from 'react'

interface DurationCellProps {
  duration: number
}

const DurationCell: React.SFC<DurationCellProps> = ({ duration }) => {
  const now = new Date()
  return <div className="duration-cell">{distanceInWordsStrict(now.getTime() - duration, now)}</div>
}

export default DurationCell

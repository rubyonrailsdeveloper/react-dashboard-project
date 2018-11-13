import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import * as React from 'react'

interface DateCellProps {
  date: Date | string | number
  addSuffix?: boolean
}

const DateCell: React.SFC<DateCellProps> = ({ date, addSuffix }) => (
  <div className="date-cell">{distanceInWordsToNow(date, { addSuffix })}</div>
)

DateCell.defaultProps = {
  addSuffix: true,
}

export default DateCell

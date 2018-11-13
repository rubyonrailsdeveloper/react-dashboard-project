import classes from 'classnames'
import * as React from 'react'

interface StIconProps {
  className?: string
  iconName?: string
}

class StIcon extends React.Component<StIconProps> {
  render() {
    const { className } = this.props
    const classNames = ['st-icon', className]

    return (
      <i className={classes(...classNames)} />
    )
  }
}

export default StIcon

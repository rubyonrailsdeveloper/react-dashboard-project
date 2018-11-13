import { Classes, Position, Spinner, Toaster } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'

const SpinnerToast = Toaster.create({
  className: 'spinner-toast',
  position: Position.RIGHT_BOTTOM,
})

interface SpinnerToastContentProps {
  text: string
}

const SpinnerToastContent: React.SFC<SpinnerToastContentProps> = ({ text }) => {
  return (
    <div className="spinner-toast">
      <Spinner className={classes(Classes.SMALL, 'spinner-toast-spinner')} />
      <span className="spinner-toast-text">{text}</span>
    </div>
  )
}

export const showSpinnerToast = (message: string) => {
  return SpinnerToast.show({
    timeout: 0,
    className: Classes.DARK,
    message: <SpinnerToastContent text={message} />,
  })
}

export const hideSpinnerToast = (key: string) => {
  SpinnerToast.dismiss(key)
}

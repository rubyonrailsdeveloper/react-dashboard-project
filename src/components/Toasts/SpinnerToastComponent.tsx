import * as React from 'react'
import { hideSpinnerToast, showSpinnerToast } from 'src/components/Toasts/SpinnerToast'

interface ChildrenProps {
  show: () => void
  hide: () => void
}

interface SpinnerToastProps {
  text: string
  children: (props: ChildrenProps) => React.ReactNode
}

interface SpinnerToastState {
  isOpen: boolean
}

class SpinnerToast extends React.Component<SpinnerToastProps, SpinnerToastState> {
  toastKey: string
  state: SpinnerToastState = {
    isOpen: false,
  }

  show = () => {
    this.toastKey = showSpinnerToast(this.props.text)
    this.setState({ isOpen: true })
  }

  hide = () => {
    hideSpinnerToast(this.toastKey)
  }

  render() {
    return this.props.children({
      show: this.show,
      hide: this.hide,
    })
  }
}
export default SpinnerToast

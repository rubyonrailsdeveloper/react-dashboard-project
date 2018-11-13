import debounce from 'lodash-es/debounce'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

interface InkBarProps extends RouteComponentProps<any> {
  disabled?: boolean
}

interface Styles {
  left: number
  width: number
}

interface State {
  ready: boolean
  animate: boolean
}

class InkBar extends React.Component<InkBarProps, State> {
  state = {
    ready: false,
    animate: false
  }

  render() {
    let styles: Styles = {
      left: 0,
      width: 0
    }
    if (this.state.ready) {
      const pathRoot = '/' + this.props.location.pathname.replace(/^\//, '').split('/')[0]
      // activeEl should always be available at this point (creating element just to quiet ts error)
      const activeEl: HTMLElement = document.querySelector(`.navbar-wrap a[href='${pathRoot}']`) || document.createElement('div')
      styles = {
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth
      }
    }
    const { disabled } = this.props
    const animateClass = this.state.animate ? 'is-animate' : '';
    return !disabled && <div className={`ink-bar ${animateClass}`} style={styles} />
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ready: true})
    })
    setTimeout(() => this.setState({animate: true}), 1)
    window.addEventListener('resize', debounce(this.onWindowResize, 200).bind(this));
  }

  onWindowResize() {
    this.setState({
      ready: true
    })
  }
}

export default withRouter(InkBar)

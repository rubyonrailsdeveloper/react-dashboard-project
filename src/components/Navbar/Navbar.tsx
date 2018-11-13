import { Classes } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import InkBar from 'src/components/InkBar/InkBar'
import NavbarWrap from 'src/components/Navbar/NavbarWrap'

import { AuthState } from 'src/store/auth/auth-reducers'
import { State } from 'src/store/root-reducer'

const { NAVBAR } = Classes

interface NavbarPageProps extends RouteComponentProps<any> {
  auth: AuthState
  disableInkbar?: boolean
}

interface NavbarState {
  isNavbarWrapMounted: boolean
}

class Navbar extends React.Component<NavbarPageProps, NavbarState> {
  constructor(props: NavbarPageProps) {
    super(props)
    this.state = {
      isNavbarWrapMounted: false
    }
  }
  render() {
    if (!this.props.auth.token) return null
    return (
      <nav className={`${NAVBAR} navbar`}>
        <NavbarWrap onMount={this.onNavbarWrapMount} />
        {this.state.isNavbarWrapMounted && <InkBar disabled={this.props.disableInkbar} />}
      </nav>
    )
  }
  onNavbarWrapMount = () => {
    this.setState({
      isNavbarWrapMounted: true
    })
  }
}
export default withRouter(connect((state: State) => ({ auth: state.auth }))(Navbar))

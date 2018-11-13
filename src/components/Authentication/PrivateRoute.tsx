import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { loginUrl } from 'src/routes'
import { AuthState } from 'src/store/auth/auth-reducers'
import { State } from 'src/store/root-reducer'

type OwnProps = RouteProps

interface ConnectProps {
  auth: AuthState
}

type PrivateRouteProps = OwnProps & ConnectProps

class PrivateRoute extends Route<PrivateRouteProps> {
  render() {
    const { auth: { token } } = this.props

    if (token) {
      return <Route {...this.props} />
    } else {
      const renderComponent = () => <Redirect to={{ pathname: loginUrl() }} />
      return <Route {...this.props} component={renderComponent} render={undefined} />
    }
  }
}

export default connect((state: State) => ({ auth: state.auth }))(PrivateRoute)

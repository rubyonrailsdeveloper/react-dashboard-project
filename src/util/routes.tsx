import * as React from 'react'
import { Redirect, Route } from 'react-router'

export const PrivateRoute = ({
  Component: Component,
  show,
  path,
}: {
  Component: any
  show: () => boolean
  path: any
}) => (
  // tslint:disable:jsx-no-lambda
  <Route
    path={path}
    render={props =>
      show() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location },
          }}
        />
      )
    }
  />
)

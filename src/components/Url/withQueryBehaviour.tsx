import isString from 'lodash-es/isString'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { LinkProps } from 'react-router-dom'
import { wrapDisplayName } from 'src/util/hoc'

export type WithQueryBehaviourProps<P> = P & {
  preserveQuery?: boolean
}

type LinkRouteProps = LinkProps & RouteComponentProps<{}>

const withQuery = ({ to, location: { search } }: LinkRouteProps) =>
  isString(to)
    ? {
        pathname: to,
        search,
      }
    : {
        ...to,
        search,
      }

/**
 * Higher-order component for making Links that preserve the current location.search when navigating
 * to their destination.
 *
 * The resulting component has an extra boolean prop `preserveQuery`, if true location.search will be
 * appended to this link's `to` prop.
 */
const withQueryBehaviour = <P extends LinkProps>(WrappedComponent: React.ComponentType<P>) => {
  type Props = WithQueryBehaviourProps<P> & RouteComponentProps<any>

  class WithQueryBehaviour extends React.Component<Props> {
    static displayName = wrapDisplayName(WrappedComponent, 'withQueryBehaviour')

    render() {
      // noinspection JSUnusedLocalSymbols
      const { preserveQuery, match, location, history, staticContext, ...other } = this.props as any

      return (
        <WrappedComponent {...other} to={preserveQuery ? withQuery(this.props) : this.props.to} />
      )
    }
  }

  return withRouter<Props>(WithQueryBehaviour as any)
}

export default withQueryBehaviour

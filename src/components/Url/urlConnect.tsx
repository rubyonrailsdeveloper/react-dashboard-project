import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { SerializerType, UrlView, UrlViewConfig } from 'src/components/Url/UrlView'
import { Omit } from 'src/types'
import { wrapDisplayName } from 'src/util/hoc'

export type ConfigInjectedProps<C extends UrlViewConfig<C>> = {
  [P in keyof C]: SerializerType<P, C> | undefined
}
export type ConfigInjectedPropsWithDefault<C extends UrlViewConfig<C>> = {
  [P in keyof C]: SerializerType<P, C>
}

interface UrlExternalProps {
  urlNamespace: UrlNamespace
}

export interface UrlInjectedProps<C extends UrlViewConfig<C>> {
  urlView: UrlView<C>
}

interface UrlConnectHoc<C extends UrlViewConfig<C>, DispatchProps = {}, External = {}> {
  <OriginalProps extends ConfigInjectedProps<C> & DispatchProps>(
    WrappedComponent: React.ComponentType<OriginalProps>
  ): React.ComponentClass<Omit<OriginalProps, keyof C | keyof DispatchProps> & External>

  <OriginalProps extends ConfigInjectedProps<C> & DispatchProps>(
    WrappedComponent: React.ComponentType<OriginalProps & UrlInjectedProps<C>>
  ): React.ComponentClass<
    Omit<
      OriginalProps & UrlInjectedProps<C>,
      keyof C | keyof DispatchProps | keyof UrlInjectedProps<C>
    > &
      External
  >
}

interface UrlConnect {
  <C extends UrlViewConfig<C>>(config: C): UrlConnectHoc<C, {}, UrlExternalProps>

  <C extends UrlViewConfig<C>, DispatchProps = {}, OwnProps = {}>(
    config: C,
    dispatchConfig: DispatchConfig<C, DispatchProps>,
    runtimeOpts: RuntimeOptions<OwnProps>
  ): UrlConnectHoc<C, DispatchProps>
}

type DispatchConfig<C extends UrlViewConfig<C>, D> = (urlView: UrlView<C>) => D

type RuntimeOptions<P> = (props: Readonly<P>) => { urlNamespace: UrlNamespace }

const urlConnect: UrlConnect = <C extends UrlViewConfig<C>, DispatchProps, OwnProps>(
  urlMapConfig: C,
  dispatchConfig?: DispatchConfig<C, DispatchProps>,
  runtimeOpts?: RuntimeOptions<OwnProps>
): UrlConnectHoc<C, DispatchProps, any> => <
  OriginalProps extends ConfigInjectedProps<C> & OwnProps & DispatchProps
>(
  WrappedComponent: React.ComponentType<OriginalProps & UrlInjectedProps<C>>
) => {
  type Props = OriginalProps & RouteComponentProps<{}> & UrlExternalProps

  class UrlConnectComponent extends React.Component<Props> {
    static displayName = wrapDisplayName(WrappedComponent, 'urlConnect')

    namespace: UrlNamespace = this.getNamespace(this.props)

    urlView: UrlView<C> = new UrlView(
      urlMapConfig,
      this.namespace,
      this.props.location,
      this.props.history
    )

    dispatchHandlers = this.buildDispatchHandlers()

    componentWillReceiveProps(nextProps: Readonly<Props>) {
      const nextNamespace = this.getNamespace(nextProps)
      if (
        nextProps.location !== this.props.location ||
        nextNamespace !== this.namespace ||
        nextProps.history !== this.props.history
      ) {
        this.namespace = nextNamespace
        this.urlView = new UrlView(
          urlMapConfig,
          this.namespace,
          nextProps.location,
          nextProps.history
        )
        this.dispatchHandlers = this.buildDispatchHandlers()
      }
    }

    getNamespace(props: Readonly<Props>) {
      if (runtimeOpts) return runtimeOpts(props).urlNamespace
      return this.props.urlNamespace
    }

    buildDispatchHandlers(): DispatchProps | {} {
      if (runtimeOpts) {
        return (dispatchConfig as DispatchConfig<C, DispatchProps>)(this.urlView)
      }
      return {}
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.urlView.getDefined()}
          {...this.dispatchHandlers}
          urlView={this.urlView}
        />
      )
    }
  }

  return withRouter(UrlConnectComponent)
}

export default urlConnect

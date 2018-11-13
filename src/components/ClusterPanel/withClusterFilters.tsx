import * as React from 'react'
import urlConnect, { ConfigInjectedPropsWithDefault } from 'src/components/Url/urlConnect'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { Serializer, UrlView } from 'src/components/Url/UrlView'

const paramsConfig = {
  cluster: {
    serializer: Serializer.String,
  },
}

type ParamsConfig = typeof paramsConfig

type FilterParams = ConfigInjectedPropsWithDefault<ParamsConfig>

interface FilterDispatchers {
  setClusterFilter: (cluster: string | null) => void
  clearClusterFilters: () => void
}

const dispatchGen = (urlView: UrlView<ParamsConfig>): FilterDispatchers => ({
  setClusterFilter(cluster) {
    const urlChange = cluster ? urlView.with('cluster', cluster) : urlView.without('cluster')
    urlChange.historyReplace()
  },
  clearClusterFilters() {
    urlView.without('cluster').historyReplace()
  },
})

export type ClusterFiltersInjectedProps = FilterParams & FilterDispatchers

const urlNamespace = new UrlNamespace('')
const urlOpts = () => ({ urlNamespace })

const urlConnectConfigured = urlConnect(paramsConfig, dispatchGen, urlOpts)

const withClusterFilters = () => <T extends ClusterFiltersInjectedProps>(
  WrappedComponent: React.ComponentType<T>
) => urlConnectConfigured(WrappedComponent)

export default withClusterFilters

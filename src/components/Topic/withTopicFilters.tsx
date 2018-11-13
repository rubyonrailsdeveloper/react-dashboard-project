import * as React from 'react'
import urlConnect, { ConfigInjectedPropsWithDefault } from 'src/components/Url/urlConnect'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { Serializer, UrlView } from 'src/components/Url/UrlView'

const paramsConfig = {
  cluster: {
    serializer: Serializer.String,
  },
  broker: {
    serializer: Serializer.String,
  },
}

type ParamsConfig = typeof paramsConfig

type FilterParams = ConfigInjectedPropsWithDefault<ParamsConfig>

interface FilterDispatchers {
  setClusterFilter: (cluster: string | null) => void
  setBrokerFilter: (bookie: string | null) => void
  clearTopicFilters: () => void
}

const dispatchGen = (urlView: UrlView<ParamsConfig>): FilterDispatchers => ({
  setClusterFilter(cluster) {
    const urlChange = cluster ? urlView.with('cluster', cluster) : urlView.without('cluster')
    urlChange.historyReplace()
  },
  setBrokerFilter(broker) {
    const urlChange = broker ? urlView.with('broker', broker) : urlView.without('broker')
    urlChange.historyReplace()
  },
  clearTopicFilters() {
    urlView
      .without('broker')
      .without('cluster')
      .historyReplace()
  },
})

export type TopicFiltersInjectedProps = FilterParams & FilterDispatchers

const urlNamespace = new UrlNamespace('')
const urlOpts = () => ({ urlNamespace })

const urlConnectConfigured = urlConnect(paramsConfig, dispatchGen, urlOpts)

const withTopicFilters = () => <T extends TopicFiltersInjectedProps>(
  WrappedComponent: React.ComponentType<T>
) => urlConnectConfigured(WrappedComponent)

export default withTopicFilters

import * as React from 'react'
import urlConnect, { ConfigInjectedPropsWithDefault } from 'src/components/Url/urlConnect'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { Serializer, UrlView } from 'src/components/Url/UrlView'
import { PhysicalEntityTag } from 'src/store/constants'

const paramsConfig = {
  tag: {
    serializer: Serializer.String,
  },
}

type ParamsConfig = typeof paramsConfig

interface FilterParams extends ConfigInjectedPropsWithDefault<ParamsConfig> {
  tag: PhysicalEntityTag
}

interface FilterDispatchers {
  setTagFilter: (tag: PhysicalEntityTag | null) => void
  clearTagFilters: () => void
}

const dispatchGen = (urlView: UrlView<ParamsConfig>): FilterDispatchers => ({
  setTagFilter(tag) {
    const urlChange = tag ? urlView.with('tag', tag) : urlView.without('tag')
    urlChange.historyReplace()
  },
  clearTagFilters() {
    urlView.without('tag').historyReplace()
  },
})

export type TagFilterInjectedProps = FilterParams & FilterDispatchers

const urlNamespace = new UrlNamespace('')
const urlOpts = () => ({ urlNamespace })

const urlConnectConfigured = urlConnect(paramsConfig, dispatchGen, urlOpts)

const withTagFilters = () => <T extends TagFilterInjectedProps>(
  WrappedComponent: React.ComponentType<T>
) => urlConnectConfigured(WrappedComponent)

export default withTagFilters

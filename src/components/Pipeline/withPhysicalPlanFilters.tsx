import findKey from 'lodash-es/findKey'
import * as React from 'react'
import urlConnect, { ConfigInjectedPropsWithDefault } from 'src/components/Url/urlConnect'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { Serializer, UrlView } from 'src/components/Url/UrlView'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'
import { wrapDisplayName } from 'src/util/hoc'

const paramsConfig = {
  filterType: {
    serializer: Serializer.String,
  },
  filterValue: {
    serializer: Serializer.String,
  },
}

type ParamsConfig = typeof paramsConfig

interface FilterParams extends ConfigInjectedPropsWithDefault<ParamsConfig> {
  filterType: PhysicalPlanFilter
}

interface FilterDispatchers {
  setPhysicalPlanFilters: (filterType: PhysicalPlanFilter, id: string) => void
  clearPhysicalPlanFilters: () => void
}

const dispatchGen = (urlView: UrlView<ParamsConfig>): FilterDispatchers => ({
  setPhysicalPlanFilters(filterType, id) {
    urlView
      .with('filterType', filterType)
      .with('filterValue', id)
      .historyReplace()
  },
  clearPhysicalPlanFilters() {
    urlView
      .without('filterType')
      .without('filterValue')
      .historyReplace()
  },
})

export type PhysicalPlanFiltersInjectedProps = FilterParams & FilterDispatchers

const urlNamespace = new UrlNamespace('')
const urlOpts = () => ({ urlNamespace })

const urlConnectConfigured = urlConnect(paramsConfig, dispatchGen, urlOpts)

const withPhysicalPlanFilters = () => <T extends PhysicalPlanFiltersInjectedProps>(
  WrappedComponent: React.ComponentType<T>
) => {
  class WithPhysicalPlanFilters extends React.Component<T> {
    static displayName = wrapDisplayName(WrappedComponent, 'withPhysicalPlanFilters')

    render() {
      const filterTypeKey = findKey(
        PhysicalPlanFilter,
        filterVal => filterVal === this.props.filterType
      ) as keyof typeof PhysicalPlanFilter | undefined
      const filterType = filterTypeKey ? PhysicalPlanFilter[filterTypeKey] : undefined

      return <WrappedComponent {...this.props} filterType={filterType} />
    }
  }

  return urlConnectConfigured(WithPhysicalPlanFilters)
}

export default withPhysicalPlanFilters

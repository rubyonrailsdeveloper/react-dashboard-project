import findKey from 'lodash-es/findKey'
import * as React from 'react'
import urlConnect, { ConfigInjectedPropsWithDefault } from 'src/components/Url/urlConnect'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { Serializer, UrlView } from 'src/components/Url/UrlView'
import { TimeRange } from 'src/store/metrics/metrics-model'
import { wrapDisplayName } from 'src/util/hoc'

const paramsConfig = {
  timeRange: {
    serializer: Serializer.String,
  },
}

type ParamsConfig = typeof paramsConfig

interface FilterParams extends ConfigInjectedPropsWithDefault<ParamsConfig> {
  timeRange: TimeRange
}

interface FilterDispatchers {
  setTimeRange: (timeRange: TimeRange) => void
  clearTimeRange: () => void
}

const dispatchGen = (urlView: UrlView<ParamsConfig>): FilterDispatchers => ({
  setTimeRange(timeRange) {
    urlView.with('timeRange', timeRange).historyReplace()
  },
  clearTimeRange() {
    urlView.without('timeRange').historyReplace()
  },
})

export type GraphFiltersInjectedProps = FilterParams & FilterDispatchers

const withGraphFilters = <OwnProps extends {}>(getChartId: (props: OwnProps) => string) => <
  T extends GraphFiltersInjectedProps & OwnProps
>(
  WrappedComponent: React.ComponentType<T>
) => {
  class WithGraphFilters extends React.Component<T> {
    static displayName = wrapDisplayName(WrappedComponent, 'withGraphFilters')

    render() {
      const timeRangeKey = findKey(
        TimeRange,
        timeRangeVal => timeRangeVal === this.props.timeRange
      ) as keyof typeof TimeRange | undefined
      // note: all graphs have 1 Hour as default
      const timeRange = timeRangeKey ? TimeRange[timeRangeKey] : TimeRange.HOUR

      return <WrappedComponent {...this.props} timeRange={timeRange} />
    }
  }

  let chartInfo: { id: string; ns: UrlNamespace } | null = null

  return urlConnect(paramsConfig, dispatchGen, props => {
    const currentChartId = getChartId(props as OwnProps)

    if (!chartInfo || chartInfo.id !== currentChartId) {
      chartInfo = {
        id: currentChartId,
        ns: new UrlNamespace(currentChartId),
      }
    }

    return { urlNamespace: chartInfo.ns }
  })(WithGraphFilters)
}

export default withGraphFilters

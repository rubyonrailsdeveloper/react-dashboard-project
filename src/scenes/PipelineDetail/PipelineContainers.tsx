import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
import withPhysicalPlanFilters, {
  PhysicalPlanFiltersInjectedProps,
} from 'src/components/Pipeline/withPhysicalPlanFilters'
import InstancesTable from 'src/components/Tables/Instances/InstancesTable'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { EntityParams } from 'src/routes'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import { MetricsQueries } from 'src/store/metrics/metrics-model'
import {
  customGetPPlanInstancesWithMetrics,
  getPPlanIsLoading,
  makeGetPPlanInstancesFiltered,
} from 'src/store/physical-plan/physical-plan-reducers'
import {
  InstanceWithMetrics,
  InstanceWithMetricsFields,
  makeInstancesPager,
} from 'src/store/physical-plan/physical-plan-views'
import { State } from 'src/store/root-reducer'

type OwnProps = PaginationInjectedProps &
  PhysicalPlanFiltersInjectedProps &
  RouteComponentProps<EntityParams>

interface ConnectProps {
  instances: InstanceWithMetrics[]
  totalInstances: number
  isLoading: boolean
}

type Actions = typeof metricsActions

type PipelineContainersProps = OwnProps & ConnectProps & Actions

class PipelineContainers extends React.Component<PipelineContainersProps> {
  static requestInstanceMetrics({
    triggerQueryMetrics,
    match: { params },
  }: PipelineContainersProps) {
    triggerQueryMetrics({ query: MetricsQueries.EMIT_COUNT_BY_INSTANCE(params) })
    triggerQueryMetrics({ query: MetricsQueries.EXECUTE_LATENCY_BY_INSTANCE(params) })
    triggerQueryMetrics({ query: MetricsQueries.ACK_COUNT_BY_INSTANCE(params) })
    triggerQueryMetrics({ query: MetricsQueries.UPTIME_BY_INSTANCE(params) })
  }

  componentDidMount() {
    PipelineContainers.requestInstanceMetrics(this.props)
  }

  componentWillReceiveProps(nextProps: PipelineContainersProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      PipelineContainers.requestInstanceMetrics(nextProps)
    }
  }

  render() {
    const {
      totalInstances,
      perPage,
      page,
      pagerHrefBuilder,
      onPageJump,
      instances,
      onSortChange,
      sortField,
      sortOrder,
      isLoading,
    } = this.props

    return (
      <div className="pipeline-components">
        <InstancesTable
          data={instances}
          onSortChange={onSortChange}
          sortField={sortField}
          sortOrder={sortOrder}
          isLoading={isLoading}
        />
        <Pager
          totalSize={totalInstances}
          perPage={perPage}
          currentPage={page}
          hrefBuilder={pagerHrefBuilder}
          onPageJump={onPageJump}
        />
      </div>
    )
  }
}

const connected = connect(() => {
  const getInstances = customGetPPlanInstancesWithMetrics(makeGetPPlanInstancesFiltered())
  const paginate = makeInstancesPager()

  return (state: State, { match: { params }, ...props }: OwnProps) => {
    const filterParams = { id: params.id, ...props }
    const instances = getInstances(state, filterParams)

    return {
      instances: paginate(instances, props),
      totalInstances: instances ? instances.length : 0,
      isLoading: getPPlanIsLoading(state, params),
    }
  }
}, metricsActions)(PipelineContainers)

const withFilters = withPhysicalPlanFilters()(connected)

export default withPagination(new UrlNamespace(''), {
  ...defaultPaginationParams,
  sortField: InstanceWithMetricsFields.name.id,
})(withFilters)

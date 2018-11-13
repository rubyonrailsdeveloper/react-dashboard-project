import forOwn from 'lodash-es/forOwn'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import DashboardByteUsage from 'src/components/DashboardStatUsage/DashboardByteUsage'
import DashboardStatUsage from 'src/components/DashboardStatUsage/DashboardStatUsage'
import withPhysicalPlanFilters, {
  PhysicalPlanFiltersInjectedProps,
} from 'src/components/Pipeline/withPhysicalPlanFilters'
import SummaryCard from 'src/components/SummaryCard/SummaryCard'
import { EntityParams, topicListUrl } from 'src/routes'
import PipelineDashboardMetrics from 'src/scenes/PipelineDetail/PipelineDashboardMetrics'
import * as metricsActions from 'src/store/metrics/metrics-actions'
import {
  MetricName,
  metricsQueryResultVal,
  physicalPlanFilterMetricsGroup,
} from 'src/store/metrics/metrics-model'
import { getQueryIsLoading, getQueryResult } from 'src/store/metrics/metrics-reducer'
import { pipelineQueryEncoder } from 'src/store/metrics/query-encoders'
import { Instance, PhysicalPlan } from 'src/store/physical-plan/physical-plan-model'
import {
  customGetPPlanContainers,
  customGetPPlanContainersFiltered,
  customGetPPlanInstancesFiltered,
  getPPlanIsLoading,
  makeGetPPlan,
} from 'src/store/physical-plan/physical-plan-reducers'
import {
  PhysicalPlanComponent,
  PhysicalPlanContainer,
} from 'src/store/physical-plan/physical-plan-views'
import { Pipeline, SourceSink } from 'src/store/pipeline/pipeline-model'
import {
  customGetPipelineComponents,
  customGetPipelineComponentsFiltered,
  customGetPipelineInputTopics,
  customGetPipelineOutputTopics,
  getPipelineIsLoading,
  makeGetPipeline,
} from 'src/store/pipeline/pipeline-reducers'
import { pipelineResourceLimitsByFilter } from 'src/store/pipeline/pipeline-views'
import { State } from 'src/store/root-reducer'
import { mbToBytes } from 'src/util/formating'

type OwnProps = PhysicalPlanFiltersInjectedProps & RouteComponentProps<EntityParams>

interface ConnectProps {
  pipeline: Pipeline | null
  physicalPlan: PhysicalPlan | null
  loadingPipeline: boolean
  loadingPhysicalPlan: boolean
  filteredInstances: Instance[] | null
  filteredContainers: PhysicalPlanContainer[] | null
  filteredComponents: PhysicalPlanComponent[] | null
  filteredInputTopics: SourceSink[] | null
  filteredOutputTopics: SourceSink[] | null
  memoryUsage: number | null
  memIsLoading: boolean
  cpuUsage: number | null
  cpuIsLoading: boolean
}

type Actions = typeof metricsActions

type PipelineDashboardProps = OwnProps & ConnectProps & Actions

class PipelineDashboard extends React.Component<PipelineDashboardProps> {
  static requestResourceUsageMetrics(props: PipelineDashboardProps) {
    forOwn(buildResourceUsageQueries(props), query => {
      props.triggerQueryMetrics({ query })
    })
  }

  componentDidMount() {
    PipelineDashboard.requestResourceUsageMetrics(this.props)
  }

  componentWillReceiveProps(nextProps: PipelineDashboardProps) {
    const { match: { params: { id } }, filterType, filterValue } = this.props

    if (
      nextProps.match.params.id !== id ||
      nextProps.filterType !== filterType ||
      nextProps.filterValue !== filterValue
    ) {
      PipelineDashboard.requestResourceUsageMetrics(nextProps)
    }
  }

  render() {
    const {
      filteredInstances,
      filteredContainers,
      filteredComponents,
      filteredInputTopics,
      filteredOutputTopics,
      pipeline,
      cpuUsage,
      memoryUsage,
      memIsLoading,
      cpuIsLoading,
    } = this.props

    let resourceStats = null

    if (pipeline) {
      const containerLimits = pipeline.resources.containerLimits
      const filterLimits = pipelineResourceLimitsByFilter(pipeline, this.props.filterType)

      resourceStats = (
        <div className="dashboard-stats">
          <DashboardStatUsage
            title="CPU Usage"
            used={cpuUsage}
            quota={filterLimits.cpu}
            unit="Cores"
            containerQuota={containerLimits.cpu}
            isLoading={cpuIsLoading}
          />
          <DashboardByteUsage
            title="Memory Usage"
            used={memoryUsage && mbToBytes(memoryUsage)}
            quota={filterLimits.memory}
            containerQuota={containerLimits.memory}
            isLoading={memIsLoading}
          />
        </div>
      )
    }

    return (
      <div className="entity-dashboard pipeline-dashboard">
        <div className="entity-dashboard-content">
          <div className="dashboard-summary">
            <SummaryCard header="Input Topics" healthSummary={filteredInputTopics} to={topicListUrl()} />
            <SummaryCard header="Components" healthSummary={filteredComponents} />
            <SummaryCard header="Containers" healthSummary={filteredContainers} />
            <SummaryCard header="Instances" healthSummary={filteredInstances} />
            <SummaryCard header="Output Topics" healthSummary={filteredOutputTopics} to={topicListUrl()} />
          </div>
          {resourceStats}
          {pipeline && <PipelineDashboardMetrics pipeline={pipeline} />}
        </div>
      </div>
    )
  }
}

const buildResourceUsageQueries = (props: OwnProps) => {
  const metricQuery = {
    id: props.match.params.id,
    groupType: physicalPlanFilterMetricsGroup(props.filterType),
    groupValue: props.filterValue,
  }

  return {
    [MetricName.CPU_USED]: pipelineQueryEncoder({ ...metricQuery, metric: MetricName.CPU_USED }),
    [MetricName.RAM_USED]: pipelineQueryEncoder({ ...metricQuery, metric: MetricName.RAM_USED }),
  }
}

const connected = connect(() => {
  const getPipeline = makeGetPipeline()
  const getPPlan = makeGetPPlan()
  const getFilteredInstances = customGetPPlanInstancesFiltered(getPPlan)
  const getFilteredContainers = customGetPPlanContainersFiltered(customGetPPlanContainers(getPPlan))
  const getFilteredComponents = customGetPipelineComponentsFiltered(
    customGetPipelineComponents(getPPlan, getPipeline)
  )
  const getFilteredInputTopics = customGetPipelineInputTopics(getPipeline, getFilteredComponents)
  const getFilteredOutputTopics = customGetPipelineOutputTopics(getPipeline, getFilteredComponents)

  return (state: State, props: OwnProps) => {
    const params = props.match.params
    const filterParams = { id: params.id, ...props }
    const resourceQueries = buildResourceUsageQueries(props)
    const memQuery = resourceQueries[MetricName.RAM_USED]
    const memUsage = getQueryResult(state, memQuery)
    const cpuQuery = resourceQueries[MetricName.CPU_USED]
    const cpuUsage = getQueryResult(state, cpuQuery)

    return {
      pipeline: getPipeline(state, params),
      physicalPlan: getPPlan(state, params),
      loadingPipeline: getPipelineIsLoading(state, params),
      loadingPhysicalPlan: getPPlanIsLoading(state, params),
      filteredInstances: getFilteredInstances(state, filterParams),
      filteredContainers: getFilteredContainers(state, filterParams),
      filteredComponents: getFilteredComponents(state, filterParams),
      filteredInputTopics: getFilteredInputTopics(state, filterParams),
      filteredOutputTopics: getFilteredOutputTopics(state, filterParams),
      memoryUsage: memUsage && memUsage.length > 0 ? metricsQueryResultVal(memUsage[0]) : null,
      memIsLoading: getQueryIsLoading(state, memQuery),
      cpuUsage: cpuUsage && cpuUsage.length > 0 ? metricsQueryResultVal(cpuUsage[0]) : null,
      cpuIsLoading: getQueryIsLoading(state, cpuQuery),
    }
  }
}, metricsActions)(PipelineDashboard)

export default withPhysicalPlanFilters()(connected)

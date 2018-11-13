import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import withClusterFilters, {
  ClusterFiltersInjectedProps,
} from 'src/components/ClusterPanel/withClusterFilters'
import { listUrlNamespace } from 'src/components/ListSceneTpl/ListSceneTpl'
import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
import PipelinesTable from 'src/components/Tables/Pipelines/PipelinesTable'
import { EntityParams } from 'src/routes'
import { makeGetNamespacePipelines } from 'src/store/namespace/namespace-reducers'
import { triggerRequestPipelineList } from 'src/store/pipeline/pipeline-actions'
import { getPipelineListIsLoading } from 'src/store/pipeline/pipeline-reducers'
import {
  makePipelinesPager,
  PipelineFields,
  PipelineWithResources,
} from 'src/store/pipeline/pipeline-views'
import { State } from 'src/store/root-reducer'

interface ConnectProps {
  pipelines: PipelineWithResources[]
  totalPipelines: number
  isLoading: boolean
  triggerRequestPipelines: typeof triggerRequestPipelineList
}

type OwnProps = PaginationInjectedProps &
  RouteComponentProps<EntityParams> &
  ClusterFiltersInjectedProps

interface PipelineListProps extends ConnectProps, OwnProps {}

class PipelineList extends React.Component<PipelineListProps> {
  componentDidMount() {
    this.props.triggerRequestPipelines()
  }

  render() {
    const {
      pipelines,
      totalPipelines,
      perPage,
      page,
      pagerHrefBuilder,
      onPageJump,
      sortOrder,
      sortField,
      onSortChange,
      isLoading,
    } = this.props

    return (
      <div>
        <PipelinesTable
          data={pipelines}
          onSortChange={onSortChange}
          sortField={sortField}
          sortOrder={sortOrder}
          isLoading={isLoading}
        />
        <Pager
          currentPage={page}
          perPage={perPage}
          totalSize={totalPipelines}
          hrefBuilder={pagerHrefBuilder}
          onPageJump={onPageJump}
        />
      </div>
    )
  }
}

const connected = connect(
  () => {
    const paginate = makePipelinesPager()
    const pipelines = makeGetNamespacePipelines()

    return (state: State, { match: { params }, ...props }: OwnProps) => {
      const filterParams = { id: params.id, ...props }
      const allPipelines = pipelines(state, filterParams)

      return {
        pipelines: paginate(allPipelines, props),
        totalPipelines: allPipelines.length,
        isLoading: getPipelineListIsLoading(state),
      }
    }
  },
  {
    triggerRequestPipelines: triggerRequestPipelineList,
  }
)(PipelineList)

const filtered = withClusterFilters()(connected)

export default withPagination(listUrlNamespace, {
  ...defaultPaginationParams,
  sortField: PipelineFields.name.id,
})(filtered)

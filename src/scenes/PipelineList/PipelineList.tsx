import * as React from 'react'
import { connect } from 'react-redux'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import PipelineTpl, { listUrlNamespace } from 'src/components/Pipeline/PipelineTpl'
import NavTree from 'src/components/NavTree/NavTree'
import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
import PipelinesTable from 'src/components/Tables/Pipelines/PipelinesTable'
import { SortOrder } from 'src/constants'
import { triggerRequestPipelineList } from 'src/store/pipeline/pipeline-actions'
import {
  getPipelineListIsLoading,
  getPipelineWithResourcesList,
} from 'src/store/pipeline/pipeline-reducers'

import { IconClasses } from '@blueprintjs/core'
import { NamespaceCreate } from 'src/components/Operations/NamespaceModify'
import ListPrimaryAction from 'src/components/ListToolbar/ListPrimaryAction'

import {
  makePipelinesPager,
  PipelineFields,
  PipelineWithResources,
} from 'src/store/pipeline/pipeline-views'
import { State } from 'src/store/root-reducer'

interface ConnectProps {
  pipelines: PipelineWithResources[] | null
  totalPipelines: number
  isLoading: boolean
  triggerRequestPipelines: typeof triggerRequestPipelineList
}

type OwnProps = PaginationInjectedProps

interface PipelineListProps extends ConnectProps, OwnProps {}

class PipelineList extends React.Component<PipelineListProps> {
  triggerCreatePipeline = () => {
    // TODO
  }

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

      <PipelineTpl
        menu={<NavTree />}
        breadcrumbs={<BreadcrumbsPageItem name="Pipelines" />}
        actions={
          <NamespaceCreate>
            {({ onClick }) => (
              <ListPrimaryAction onClick={onClick} iconName={IconClasses.PLUS} />
            )}
          </NamespaceCreate>
        }>
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
      </PipelineTpl>
    )
  }
}

const connected = connect(
  () => {
    const paginate = makePipelinesPager()

    return (state: State, ownProps: OwnProps) => {
      const allPipelines = getPipelineWithResourcesList(state)

      return {
        pipelines: paginate(allPipelines, ownProps),
        totalPipelines: allPipelines.length,
        isLoading: getPipelineListIsLoading(state),
      }
    }
  },
  {
    triggerRequestPipelines: triggerRequestPipelineList,
  }
)(PipelineList)

export default withPagination(listUrlNamespace, {
  ...defaultPaginationParams,
  sortField: PipelineFields.health.id,
  sortOrder: SortOrder.DESC,
})(connected)

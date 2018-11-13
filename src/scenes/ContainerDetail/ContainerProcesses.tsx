import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
import ProcessesTable from 'src/components/Tables/Processes/ProcessTable'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { EntityParams } from 'src/routes'
import { Process } from 'src/store/container/container-model'
import { getContainerIsLoading, makeGetContainer } from 'src/store/container/container-reducers'
import { makeProcessesPager, ProcessFields } from 'src/store/container/container-views'
import * as nodeActions from 'src/store/node/node-actions'
import { State } from 'src/store/root-reducer'

type Actions = typeof nodeActions

interface ConnectProps extends Actions {
  processes: Process[] | null
  totalProcesses: number
  isLoading: boolean
}

type OwnProps = PaginationInjectedProps & RouteComponentProps<EntityParams>

interface ContainerProcessesProps extends ConnectProps, OwnProps {}

class ContainerProcesses extends React.Component<ContainerProcessesProps> {
  render() {
    const {
      perPage,
      page,
      pagerHrefBuilder,
      onPageJump,
      processes,
      onSortChange,
      sortField,
      sortOrder,
      isLoading,
      totalProcesses,
    } = this.props

    return (
      <div>
        <ProcessesTable
          data={processes}
          onSortChange={onSortChange}
          sortField={sortField}
          sortOrder={sortOrder}
          isLoading={isLoading}
        />
        <Pager
          currentPage={page}
          perPage={perPage}
          totalSize={totalProcesses}
          hrefBuilder={pagerHrefBuilder}
          onPageJump={onPageJump}
        />
      </div>
    )
  }
}

const connected = connect(() => {
  const paginate = makeProcessesPager()
  const getContainer = makeGetContainer()

  return (state: State, { match: { params }, ...props }: OwnProps) => {
    const { processes } = getContainer(state, params) || { processes: null }

    return {
      processes: paginate(processes || null, props),
      totalProcesses: processes ? processes.length : 0,
      isLoading: getContainerIsLoading(state, params),
    }
  }
}, nodeActions)(ContainerProcesses)

export default withPagination(new UrlNamespace(''), {
  ...defaultPaginationParams,
  sortField: ProcessFields.name.id,
})(connected)

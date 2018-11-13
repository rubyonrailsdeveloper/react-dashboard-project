import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
import ContainersTable from 'src/components/Tables/Containers/ContainerTable'
import withTagFilters, { TagFilterInjectedProps } from 'src/components/TagPanel/withTagFilters'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { EntityParams } from 'src/routes'
import { Container } from 'src/store/container/container-model'
import {
  makeGetContainersByNode,
  makeGetContainersFiltered,
} from 'src/store/container/container-reducers'
import { ContainerFields, makeContainersPager } from 'src/store/container/container-views'
import { getNodeIsLoading } from 'src/store/node/node-reducers'
import { State } from 'src/store/root-reducer'

interface ConnectProps {
  containers: Container[]
  totalContainers: number
  isLoading: boolean
}

type OwnProps = PaginationInjectedProps & RouteComponentProps<EntityParams> & TagFilterInjectedProps

interface NodeContainersProps extends ConnectProps, OwnProps {}

class NodeContainers extends React.Component<NodeContainersProps> {
  render() {
    const {
      perPage,
      page,
      pagerHrefBuilder,
      onPageJump,
      containers,
      onSortChange,
      sortField,
      sortOrder,
      isLoading,
      totalContainers,
    } = this.props

    return (
      <div>
        <ContainersTable
          data={containers}
          onSortChange={onSortChange}
          sortField={sortField}
          sortOrder={sortOrder}
          isLoading={isLoading}
        />
        <Pager
          currentPage={page}
          perPage={perPage}
          totalSize={totalContainers}
          hrefBuilder={pagerHrefBuilder}
          onPageJump={onPageJump}
        />
      </div>
    )
  }
}

const connected = connect(() => {
  const paginate = makeContainersPager()
  const getContainers = makeGetContainersFiltered(makeGetContainersByNode())

  return (state: State, { match: { params }, ...props }: OwnProps) => {
    const filterParams = { node: params.id, ...props }
    const allContainers = getContainers(state, filterParams)

    return {
      containers: paginate(allContainers, props),
      totalContainers: allContainers ? allContainers.length : 0,
      isLoading: getNodeIsLoading(state, params),
    }
  }
})(NodeContainers)

const filtered = withTagFilters()(connected)

export default withPagination(new UrlNamespace(''), {
  ...defaultPaginationParams,
  sortField: ContainerFields.name.id,
})(filtered)

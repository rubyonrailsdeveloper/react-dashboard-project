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
import TopicsTable from 'src/components/Tables/Topics/TopicTable'
import { EntityParams } from 'src/routes'
import { makeGetNamespaceTopics } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'
import * as topicActions from 'src/store/topic/topic-actions'
import { Topic } from 'src/store/topic/topic-model'
import { getTopicListIsLoading } from 'src/store/topic/topic-reducers'
import { makeTopicPager, TopicFields } from 'src/store/topic/topic-views'

type Actions = typeof topicActions

interface ConnectProps extends Actions {
  topics: Topic[]
  totalTopics: number
  isLoading: boolean
}

type OwnProps = PaginationInjectedProps &
  RouteComponentProps<EntityParams> &
  ClusterFiltersInjectedProps

interface NamespaceTopicsProps extends ConnectProps, OwnProps {}

class NamespaceTopics extends React.Component<NamespaceTopicsProps> {
  componentDidMount() {
    this.props.triggerRequestTopicList()
  }

  render() {
    const {
      perPage,
      page,
      pagerHrefBuilder,
      onPageJump,
      topics,
      totalTopics,
      onSortChange,
      sortOrder,
      sortField,
      isLoading,
    } = this.props

    return (
      <div>
        <TopicsTable
          data={topics}
          onSortChange={onSortChange}
          sortOrder={sortOrder}
          sortField={sortField}
          isLoading={isLoading}
        />
        <Pager
          currentPage={page}
          perPage={perPage}
          totalSize={totalTopics}
          hrefBuilder={pagerHrefBuilder}
          onPageJump={onPageJump}
        />
      </div>
    )
  }
}
const connected = connect(() => {
  const paginate = makeTopicPager()
  const topics = makeGetNamespaceTopics()

  return (state: State, { match: { params }, ...props }: OwnProps) => {
    const filterParams = { id: params.id, ...props }
    const allTopics = topics(state, filterParams)

    return {
      topics: paginate(allTopics, props),
      totalTopics: allTopics.length,
      isLoading: getTopicListIsLoading(state),
    }
  }
}, topicActions)(NamespaceTopics)

const filtered = withClusterFilters()(connected)

export default withPagination(listUrlNamespace, {
  ...defaultPaginationParams,
  sortField: TopicFields.name.id,
})(filtered)

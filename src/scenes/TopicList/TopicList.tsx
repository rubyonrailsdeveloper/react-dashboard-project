import * as React from 'react'
import { connect } from 'react-redux'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import ListSceneTpl, { listUrlNamespace } from 'src/components/ListSceneTpl/ListSceneTpl'
import NavTree from 'src/components/NavTree/NavTree'
import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
import TopicsTable from 'src/components/Tables/Topics/TopicTable'
import { SortOrder } from 'src/constants'
import { State } from 'src/store/root-reducer'
import * as topicActions from 'src/store/topic/topic-actions'
import { Topic } from 'src/store/topic/topic-model'
import { getTopicList, getTopicListIsLoading } from 'src/store/topic/topic-reducers'
import { makeTopicPager, TopicFields } from 'src/store/topic/topic-views'

import { IconClasses } from '@blueprintjs/core'
import { NamespaceCreate } from 'src/components/Operations/NamespaceModify'
import ListPrimaryAction from 'src/components/ListToolbar/ListPrimaryAction'

type Actions = typeof topicActions

interface ConnectProps extends Actions {
  topics: Topic[] | null
  totalTopics: number
  isLoading: boolean
}

type OwnProps = PaginationInjectedProps

interface TopicListProps extends ConnectProps, OwnProps {}

class TopicList extends React.Component<TopicListProps> {
  triggerCreateTopic = () => {
    // TODO
  }

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

      <ListSceneTpl
        menu={<NavTree />}
        breadcrumbs={<BreadcrumbsPageItem name="Topics" />}
        actions={
          <NamespaceCreate>
            {({ onClick }) => (
              <ListPrimaryAction onClick={onClick} iconName={IconClasses.PLUS} />
            )}
          </NamespaceCreate>
        }>
        <TopicsTable
          data={topics}
          onSortChange={onSortChange}
          sortOrder={sortOrder}
          sortField={sortField}
          isLoading={isLoading} />
        <Pager
          currentPage={page}
          perPage={perPage}
          totalSize={totalTopics}
          hrefBuilder={pagerHrefBuilder}
          onPageJump={onPageJump} />
      </ListSceneTpl>
    )
  }
}

export default withPagination(listUrlNamespace, {
  ...defaultPaginationParams,
  sortField: TopicFields.health.id,
  sortOrder: SortOrder.DESC
})(
  connect(() => {
    const paginate = makeTopicPager()
    return (state: State, ownProps: OwnProps) => {
      const allTopics = getTopicList(state)
      return {
        topics: paginate(allTopics, ownProps),
        totalTopics: allTopics.length,
        isLoading: getTopicListIsLoading(state),
      }
    }
  }, topicActions)(TopicList)
)

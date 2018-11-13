import groupBy from 'lodash-es/groupBy'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
import ConsumersTable from 'src/components/Tables/Topics/ConsumersTable'
import withTopicFilters, { TopicFiltersInjectedProps } from 'src/components/Topic/withTopicFilters'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { EntityParams } from 'src/routes'
import { InstanceWithMetricsFields } from 'src/store/physical-plan/physical-plan-views'
import { State } from 'src/store/root-reducer'
import { ConsumerWithSubsData, Topic } from 'src/store/topic/topic-model'
import {
  customGetConsumers,
  getTopicListIsLoading,
  makeGetTopic,
} from 'src/store/topic/topic-reducers'
import { unfilterableClass } from 'src/util/classes'

type OwnProps = PaginationInjectedProps &
  TopicFiltersInjectedProps &
  RouteComponentProps<EntityParams>

interface ConnectProps {
  topic: Topic
  consumers: ConsumerWithSubsData[]
  totalConsumers: number
  isLoading: boolean
}

type TopicConsumersProps = OwnProps & ConnectProps

class TopicConsumers extends React.Component<TopicConsumersProps> {
  render() {
    const {
      totalConsumers,
      perPage,
      page,
      pagerHrefBuilder,
      onPageJump,
      consumers,
      onSortChange,
      sortField,
      sortOrder,
      isLoading,
      cluster,
    } = this.props

    return (
      <div className={`topic-consumers ${unfilterableClass(cluster)}`}>
        <ConsumersTable
          data={consumers}
          pageSize={perPage}
          page={page}
          onSortChange={onSortChange}
          sortField={sortField}
          sortOrder={sortOrder}
          isLoading={isLoading}
        />
        <Pager
          totalSize={totalConsumers}
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
  const getTopic = makeGetTopic()
  const getConsumers = customGetConsumers(makeGetTopic())

  return (state: State, { match: { params } }: OwnProps) => {
    const consumers = getConsumers(state, params)
    return {
      // TODO: add filters when ready
      topic: getTopic(state, params),
      consumers: consumers,
      totalConsumers: consumers ? Object.keys(groupBy(consumers, c => c.subscriptionId)).length : 0,
      isLoading: getTopicListIsLoading(state),
    }
  }
})(TopicConsumers)

const withFilters = withTopicFilters()(connected)

export default withPagination(new UrlNamespace('consumers'), {
  ...defaultPaginationParams,
  sortField: InstanceWithMetricsFields.name.id,
})(withFilters)

import groupBy from 'lodash-es/groupBy'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import Pager from 'src/components/Pagination/Pager'
import withPagination, {
  defaultPaginationParams,
  PaginationInjectedProps,
} from 'src/components/Pagination/withPagination'
import ProducersTable from 'src/components/Tables/Topics/ProducersTable'
import withTopicFilters, { TopicFiltersInjectedProps } from 'src/components/Topic/withTopicFilters'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { EntityParams } from 'src/routes'
import { InstanceWithMetricsFields } from 'src/store/physical-plan/physical-plan-views'
import { State } from 'src/store/root-reducer'
import { Producer, Topic } from 'src/store/topic/topic-model'
import { getTopicListIsLoading, makeGetTopic } from 'src/store/topic/topic-reducers'
import { unfilterableClass } from 'src/util/classes'

type OwnProps = PaginationInjectedProps &
  TopicFiltersInjectedProps &
  RouteComponentProps<EntityParams>

interface ConnectProps {
  topic: Topic
  producers: Producer[]
  totalProducers: number
  isLoading: boolean
}

type TopicProducersProps = OwnProps & ConnectProps

class TopicProducers extends React.Component<TopicProducersProps> {
  render() {
    const {
      totalProducers,
      perPage,
      page,
      pagerHrefBuilder,
      onPageJump,
      producers,
      onSortChange,
      sortField,
      sortOrder,
      isLoading,
      cluster,
    } = this.props

    return (
      <div className={`topic-producers ${unfilterableClass(cluster)}`}>
        <ProducersTable
          data={producers}
          pageSize={perPage}
          page={page}
          onSortChange={onSortChange}
          sortField={sortField}
          sortOrder={sortOrder}
          isLoading={isLoading}
        />
        <Pager
          totalSize={totalProducers}
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

  return (state: State, ownProps: OwnProps) => {
    const topic = getTopic(state, ownProps.match.params)

    return {
      // TODO: add filters when ready
      topic: topic,
      producers: topic && topic.producers,
      totalProducers: topic ? Object.keys(groupBy(topic.producers, p => p.producerName)).length : 0,
      isLoading: getTopicListIsLoading(state),
    }
  }
})(TopicProducers)

const withFilters = withTopicFilters()(connected)

export default withPagination(new UrlNamespace('producers'), {
  ...defaultPaginationParams,
  sortField: InstanceWithMetricsFields.name.id,
})(withFilters)

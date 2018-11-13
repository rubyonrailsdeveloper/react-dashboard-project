import { IconClasses, InputGroup, Tab2, Tabs2 } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import BreadcrumbList, { BreadcrumbListItem } from 'src/components/Breadcrumbs/BreadcrumbList'
import { Icons } from 'src/constants'
import { pipelineUrl, topicUrl } from 'src/routes'
import { NestedId } from 'src/store/constants'
import { Pipeline } from 'src/store/pipeline/pipeline-model'
import { makeGetPipelinesByNamespace } from 'src/store/pipeline/pipeline-reducers'
import { State } from 'src/store/root-reducer'
import { Topic } from 'src/store/topic/topic-model'
import { makeGetTopicsByNamespace } from 'src/store/topic/topic-reducers'

interface OwnProps {
  namespaceId: string
  selectedTab: 'topics-tab' | 'pipelines-tab'
}

interface ConnectProps {
  pipelines: Pipeline[]
  topics: Topic[]
}

type SearchTopicsPipelinesProps = OwnProps & ConnectProps & RouteComponentProps<{}>

interface OwnState {
  search: string
  processedPipelines: BreadcrumbListItem[]
  processedTopics: BreadcrumbListItem[]
}

class SearchTopicsPipelines extends React.Component<SearchTopicsPipelinesProps, OwnState> {
  state: OwnState = {
    search: '',
    ...SearchTopicsPipelines.process(this.props, ''),
  }

  static mapEntityArray = (
    entityArray: Array<Pipeline | Topic>,
    getUrl: (id: NestedId) => string
  ) =>
    entityArray.map(({ id, name, health }) => ({
      name: name,
      health: health,
      url: getUrl({ id }),
    }))

  static process({ pipelines, topics }: SearchTopicsPipelinesProps, search: string) {
    return {
      processedPipelines: SearchTopicsPipelines.searchArray(
        SearchTopicsPipelines.mapEntityArray(pipelines, pipelineUrl),
        search
      ),
      processedTopics: SearchTopicsPipelines.searchArray(
        SearchTopicsPipelines.mapEntityArray(topics, topicUrl),
        search
      ),
    }
  }

  static searchArray = (array: BreadcrumbListItem[], search: string) =>
    array.filter(entity => !search || entity.name.includes(search))

  onSearchChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      search: ev.currentTarget.value,
      ...SearchTopicsPipelines.process(this.props, ev.currentTarget.value),
    })
  }

  componentWillReceiveProps(nextProps: SearchTopicsPipelinesProps) {
    if (nextProps.pipelines !== this.props.pipelines || nextProps.topics !== this.props.topics)
      this.setState(SearchTopicsPipelines.process(nextProps, this.state.search))
  }

  render() {
    const { selectedTab } = this.props
    const { processedPipelines, processedTopics, search } = this.state

    return (
      <div className="breadcrumbs-search search-topics-pipelines">
        <div className="breadcrumbs-search-input">
          <InputGroup
            type="text"
            placeholder="Search current namespace"
            leftIconName={IconClasses.SEARCH}
            value={search}
            onChange={this.onSearchChange}
          />
        </div>
        <Tabs2
          id="topics-tabs"
          defaultSelectedTabId={selectedTab}
          className="breadcrumbs-search-tabs"
        >
          <Tab2
            id="pipelines-tab"
            title="Pipelines"
            panel={
              <BreadcrumbList
                items={processedPipelines}
                noItemsMsg={
                  search !== ''
                    ? 'No pipelines in this namespace match your search.'
                    : 'There are no pipelines in this namespace.'
                }
                icon={Icons.PIPELINE}
              />
            }
          />
          <Tab2
            id="topics-tab"
            title="Topics"
            panel={
              <BreadcrumbList
                items={processedTopics}
                noItemsMsg={
                  search !== ''
                    ? 'No topics in this namespace match your search.'
                    : 'There are no topics in this namespace.'
                }
                icon={Icons.TOPIC}
              />
            }
          />
        </Tabs2>
      </div>
    )
  }
}

// withRouter added to circumvent connect()'s purity (BreadcrumbList renders links that need
// context from the route)
export default withRouter(
  connect(() => {
    const filerPipelines = makeGetPipelinesByNamespace()
    const filerTopics = makeGetTopicsByNamespace()

    return (state: State, props: OwnProps) => ({
      pipelines: filerPipelines(state, props),
      topics: filerTopics(state, props),
    })
  })(SearchTopicsPipelines)
)

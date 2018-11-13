import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import * as React from 'react'
import { Pipeline } from 'src/store/pipeline/pipeline-model'
import DetailMap from './internal/DetailMap'
import LogicalPlan, { PositionedNode } from './internal/LogicalPlan'
import PiplineSource from './internal/PipelineSource'
import { connectPipeline, handlePipelineNodeClick, PipelineProps } from './internal/util'

import Panel from 'src/components/Panel/Panel'

interface PipelineDetailMapState {
  nodes: { [id: string]: Element }
}

const Status = ({ pipeline }: { pipeline: Pipeline }) => {
  const runningFor = distanceInWordsToNow(pipeline.submissionTime, { addSuffix: false })
  const runningOn = pipeline.clusters[0]
  return (
    <div className="pipeline-detail">
      <h3>Status</h3>
      <div>Running for {runningFor} days on {runningOn}</div>
    </div>
  )
}

// PipelineDetailMap enhances a bare PipelinePlan with rendered spouts and sinks
class PipelineDetailMap extends React.Component<PipelineProps> {
  state: PipelineDetailMapState = {
    nodes: {},
  }

  componentWillReceiveProps(nextProps: PipelineProps) {
    if (nextProps.id !== this.props.id) this.setState({ nodes: {} })
  }

  handleComponentClick = (componentId: string) => handlePipelineNodeClick(this.props, componentId)

  onPlanChanged = (nodesArr: PositionedNode[]) => {
    const nodes = nodesArr.reduce(
      (acc: { [n: string]: Element }, n) => (acc[n.node.name] = n.element) && acc,
      {}
    )
    this.setState({ nodes })
  }

  render() {
    const { pipeline, filteredComponents } = this.props

    if (!pipeline) return null

    return (
      <Panel header="Pipelines" footer={(<Status pipeline={pipeline} />)}>
        <DetailMap
          componentId="pipeline-detail-map"
          sourceConnections={pipeline.sources.reduce(
            (acc: any[], s) => acc.concat(s.outputs.map(i => ({ sourceId: s.id, targetId: i }))),
            []
          )}
          sinkConnections={pipeline.sinks.reduce(
            (acc: any[], s) => acc.concat(s.inputs.map(i => ({ sourceId: s.id, targetId: i }))),
            []
          )}
          Component={PiplineSource}
          entityId={pipeline.id}
          sources={pipeline.sources}
          sinks={pipeline.sinks}
          targetElementsById={this.state.nodes}
        >
          <div>
            <div className="pipeline-plan">
              <LogicalPlan
                id={pipeline.id}
                logicalPlan={pipeline.logicalPlan}
                onClick={this.handleComponentClick}
                width={560}
                containerMinHeight={250}
                alignSinks={false}
                planChanged={this.onPlanChanged}
                filtered={filteredComponents}
              />
            </div>
          </div>
        </DetailMap>
      </Panel>
    )
  }
}

export default connectPipeline(PipelineDetailMap)

import * as React from 'react'
import PipelineContainerPanel from 'src/components/ContainerGrid/PipelineContainerGrid'
import PipelineDetailMap from 'src/components/EntityExplorer/PipelineDetailMap'

import { connectPipeline, PipelineProps } from 'src/components/EntityExplorer/internal/util'

class PipelineEntityExplorer extends React.Component<PipelineProps> {
  render() {
    const { pipeline } = this.props

    if (!pipeline) return null

    return (
      <div className="pipeline-entity-explorer">
        <PipelineDetailMap id={pipeline.id} />
        <PipelineContainerPanel key={1} pipelineId={pipeline.id} />
      </div>
    )
  }
}

export default connectPipeline(PipelineEntityExplorer)

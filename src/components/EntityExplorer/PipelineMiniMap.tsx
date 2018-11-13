import * as React from 'react'
import Measure, { ContentRect } from 'react-measure'
import LogicalPlan from './internal/LogicalPlan'
import { connectPipeline, handlePipelineNodeClick, PipelineProps } from './internal/util'

const aspectRatio = 0.5

export class PipelineMiniMap extends React.Component<PipelineProps> {
  state = { measured: false, width: 400, height: 200 }

  setDimensions = (cr: ContentRect) => {
    if (!cr.bounds) return

    const width = Math.floor(cr.bounds.width)
    const height = width * aspectRatio

    this.setState({ measured: true, width, height })
  }

  handleComponentClick = (componentId: string) => handlePipelineNodeClick(this.props, componentId)

  render() {
    const { pipeline, id, filteredComponents } = this.props
    const { measured, width, height } = this.state

    return (
      <Measure offset bounds onResize={this.setDimensions}>
        {({ measureRef }) => (
          <div className="pipeline-mini-map" ref={measureRef}>
            {pipeline &&
              measured && (
                <LogicalPlan
                  id={id}
                  logicalPlan={pipeline.logicalPlan}
                  onClick={this.handleComponentClick}
                  filtered={filteredComponents}
                  width={width}
                  height={height}
                  radius={4}
                  stroke={1}
                />
              )}
          </div>
        )}
      </Measure>
    )
  }
}

export default connectPipeline(PipelineMiniMap)

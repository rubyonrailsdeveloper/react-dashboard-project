import debounce from 'lodash-es/debounce'
import * as React from 'react'
import Measure, { ContentRect } from 'react-measure'
import Connections, { ElementsById, ObjectWithId, SourceTargetMap } from './Connections'

interface DetailMapProps {
  componentId: string
  entityId: string
  onRootResize?: (cr: ContentRect) => void
  onContentResize?: (cr: ContentRect) => void
  sourceConnections: SourceTargetMap
  sinkConnections: SourceTargetMap
  targetElementsById: ElementsById
  sources: ObjectWithId[]
  sinks: ObjectWithId[]
  Component: React.ComponentClass<any> | React.StatelessComponent<any>
}

interface DetailMapState {
  offsetTop: number
  offsetLeft: number
}

// PipelineDetailMap enhances a bare PipelinePlan with rendered spouts and sinks
class DetailMap extends React.Component<DetailMapProps, DetailMapState> {
  state: DetailMapState = {
    offsetLeft: -1,
    offsetTop: -1,
  }

  root: Element | null = null
  content: HTMLDivElement | null = null

  // react-measure will only fire when the element size has changed, not its
  // position, so once we've reached max-width it will no longer emit events
  // so we need to also handle resize separately
  handleWindowResize = debounce(() => {
    const { onContentResize, onRootResize } = this.props
    const offset = {
      left: this.content!.offsetLeft,
      top: this.content!.offsetTop,
      width: this.content!.offsetWidth,
      height: this.content!.offsetHeight,
    }
    const rootRect = { bounds: this.root!.getBoundingClientRect() }
    const contentRect = { bounds: this.content!.getBoundingClientRect(), offset }

    this.setDimensions(rootRect)

    if (onContentResize) onContentResize(contentRect)
    if (onRootResize) onRootResize(rootRect)
  }, 100)

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  setDimensions = (cr: ContentRect) => {
    if (!cr.bounds) return
    this.setState({ offsetLeft: cr.bounds.left, offsetTop: cr.bounds.top })
  }

  assignRoot = (ref: Element) => (this.root = ref)

  assignContent = (ref: HTMLDivElement) => (this.content = ref)

  render() {
    const {
      componentId,
      Component,
      sinkConnections,
      sourceConnections,
      entityId,
      sources,
      sinks,
      targetElementsById,
    } = this.props
    const { offsetLeft: ol, offsetTop: ot } = this.state

    // connections, Component and targetElementsById are all shared
    return (
      <Measure offset bounds onResize={this.setDimensions} innerRef={this.assignRoot}>
        {({ measureRef }) => (
          <section id={componentId} className="entity-explorer-detail-map" ref={measureRef}>
            {sources && (
              <Connections
                id={entityId}
                toRight={true}
                sources={sources}
                connections={sourceConnections}
                Component={Component}
                targetElementsById={targetElementsById}
                offsetLeft={ol}
                offsetTop={ot}
              />
            )}
            <div className="entity-explorer-content" ref={this.assignContent}>
              {this.props.children}
            </div>
            {sinks && (
              <Connections
                id={entityId}
                sources={sinks}
                connections={sinkConnections}
                Component={Component}
                targetElementsById={targetElementsById}
                offsetLeft={ol}
                offsetTop={ot}
              />
            )}
          </section>
        )}
      </Measure>
    )
  }
}

export default DetailMap

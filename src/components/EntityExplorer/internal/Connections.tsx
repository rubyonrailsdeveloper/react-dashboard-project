import * as React from 'react'
import Measure, { ContentRect } from 'react-measure'
import { generatePath, Point } from './util'

export interface ElementsById {
  [id: string]: Element | Point
}

export interface ObjectWithId {
  id: string
}

export type SourceTargetMap = Array<{ sourceId: string; targetId: string }>

// Sources and targets can change independently
export interface ConnectionsProps {
  id: string
  strokeWidth?: number
  toRight?: boolean
  offsetLeft?: number
  offsetTop?: number
  connections: SourceTargetMap
  sources: ObjectWithId[]
  targetElementsById: ElementsById
  Component: React.ComponentClass<any> | React.StatelessComponent<any>
}

interface ConnectionsState {
  renderedSources: RenderedSources
  renderedConnections: RenderedConnections
}

interface RenderedSources {
  [id: string]: ContentRect
}

interface RenderedConnections {
  [id: string]: {
    source: Point
    target: Point
  }
}

export default class extends React.Component<ConnectionsProps, ConnectionsState> {
  static defaultProps = {
    strokeWidth: 2,
    offsetLeft: 0,
    offsetTop: 0,
  }

  state: ConnectionsState = {
    renderedSources: {},
    renderedConnections: {},
  }
  root: HTMLDivElement | null = null

  componentDidMount() {
    const { targetElementsById, connections, offsetLeft, offsetTop } = this.props
    this.renderConnections(targetElementsById, connections, offsetLeft!, offsetTop!)
  }

  componentWillReceiveProps(nextProps: ConnectionsProps) {
    const { targetElementsById, connections, offsetLeft, offsetTop } = nextProps
    this.renderConnections(targetElementsById, connections, offsetLeft!, offsetTop!)
  }

  renderConnections = (
    targets: ElementsById,
    connections: SourceTargetMap,
    ol: number,
    ot: number
  ) => {
    const renderedConnections: RenderedConnections = {}
    const { renderedSources } = this.state
    const getPos = this.getSourcePosition

    connections.forEach((c, i) => {
      const { sourceId, targetId } = c
      const source = renderedSources[sourceId]
      const target = targets[targetId]

      if (!source || !target) return

      const id = `${sourceId}--${targetId}`
      const sourcePos = getPos(source)
      let targetPos

      if ('getBoundingClientRect' in target) {
        const rect = (target as Element).getBoundingClientRect()
        const pRect = this.root!.offsetParent.getBoundingClientRect()
        targetPos = {
          x: rect.left - ol + rect.width / 2,
          y: rect.top - pRect.top + rect.height / 2,
        }
      } else {
        targetPos = target as Point
      }

      if (sourcePos && targetPos) {
        renderedConnections[id] = { source: sourcePos, target: targetPos }
      }
    })

    this.setState({ renderedConnections })
  }

  renderedSource = (cr: ContentRect, obj: ObjectWithId) => {
    const { renderedSources } = this.state
    renderedSources[obj.id] = cr
    this.setState({ renderedSources })
    if (Object.keys(renderedSources).length === this.props.sources.length) {
      this.renderConnections(this.props.targetElementsById, this.props.connections, 0, 0)
    }
  }

  getSourcePosition = (contentRect: ContentRect) => {
    const { offset, bounds } = contentRect

    if (bounds && offset) {
      const x = (this.props.toRight ? offset.width + offset.left : offset.left) || 0
      const y = (offset.top || 0) + bounds.height / 2 + (this.props.strokeWidth as number) / 2

      return { x, y }
    }

    return null
  }

  render() {
    const { Component } = this.props
    const { renderedConnections } = this.state

    return (
      <div className="entity-explorer-connections" ref={ref => (this.root = ref)}>
        {this.props.sources.map((s, i) => {
          const add = (cr: ContentRect) => this.renderedSource(cr, s)

          return (
            <Measure offset bounds key={s.id} onResize={add}>
              {({ measureRef }) => (
                <div ref={measureRef}>
                  <Component {...s} />
                </div>
              )}
            </Measure>
          )
        })}
        <svg>
          {Object.keys(renderedConnections).map(id => {
            return (
              <path
                key={id}
                className="source-sink"
                d={generatePath(renderedConnections[id].source, renderedConnections[id].target)}
                fill="none"
                strokeWidth={this.props.strokeWidth}
              />
            )
          })}
        </svg>
      </div>
    )
  }
}

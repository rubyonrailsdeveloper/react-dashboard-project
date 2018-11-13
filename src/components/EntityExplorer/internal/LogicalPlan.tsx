import { SVGTooltip } from '@blueprintjs/core'
import classnames from 'classnames'
import { extent } from 'd3-array'
import { interpolate } from 'd3-interpolate'
import * as React from 'react'
import { healthClass } from 'src/constants'
import { Health } from 'src/store/constants'
import { PhysicalPlanComponent } from 'src/store/physical-plan/physical-plan-views'
import { PipelineLogicalPlan } from 'src/store/pipeline/pipeline-model'
import generateLogicalPlan from './generate-logical-plan'
import { generatePath } from './util'

// Nodes are laid out in a jagged 2d array
// accessible via groups[groupIndex][groupsLevelIndex]
interface Node {
  edges: Link[]
  health: Health
  length: number
  indexOf: (group: Node) => number
  inputComponents: string[]
  groupIndex: number
  groupsLevelIndex: number
  isReal: boolean
  isTerminal?: boolean // TODO Name this better
  isFirst?: boolean
  isLast?: boolean
  name: string
  x: number
  y: number
}

interface Link {
  source: Node
  target: Node
}

interface LogicalPlanState {
  nodes: Node[]
  groups: Node[][]
  links: Link[]
}

export interface PositionedNode {
  element: SVGCircleElement
  node: Node
}

export interface LogicalPlanProps {
  id: string // Used for state comparison
  logicalPlan: PipelineLogicalPlan
  filtered?: PhysicalPlanComponent[] | null
  onClick?: (componentId: string) => void
  containerMinHeight?: number
  width?: number
  height?: number
  radius?: number
  stroke?: number
  alignSinks?: boolean
  planChanged?: (positionedNodes: PositionedNode[]) => void
  padding?: {
    top: number
    left: number
    right: number
    bottom: number
  }
}

// Actual LogicalPlan is separate from the PipelineDetailMap so it can be embeded elsewhere
class LogicalPlan extends React.PureComponent<LogicalPlanProps> {
  static defaultProps = {
    containerMinHeight: 0,
    width: 800, // width of the map
    height: 400, // height of the map
    radius: 7, // radius of the node
    stroke: 2, // stroke size of the edges
    padding: { top: 20, left: 10, right: 10, bottom: 20 }, // padding between container and map
    alignSinks: false, // whether we should insert additional nodes to align terminal nodes
  }

  root: HTMLDivElement | null = null

  state: LogicalPlanState = {
    nodes: [],
    groups: [],
    links: [],
  }

  // react-measure will only fire when the element size has changed, not its
  // position, so once we've reached max-width it will no longer emit events
  // so we need to also handle resize separately
  handlePlanChanged = () => {
    if (!this.props.planChanged) return

    const measured = Array.from(this.root!.querySelectorAll('circle')).map(
      (el: SVGCircleElement) => {
        const node = this.state.nodes.find(n => n.name === (el as any).getAttribute('data-node'))

        return {
          node: node!,
          element: el,
        }
      }
    )

    this.props.planChanged(measured)
  }

  componentDidMount() {
    const { logicalPlan, alignSinks } = this.props
    this.generatePlan(logicalPlan, alignSinks!)
    this.handlePlanChanged()
  }

  componentDidUpdate() {
    this.emphasizeFiltered()
    this.handlePlanChanged()
  }

  componentWillReceiveProps(nextProps: LogicalPlanProps) {
    if (nextProps.id !== this.props.id) {
      this.generatePlan(nextProps.logicalPlan, nextProps.alignSinks!)
    }
  }

  generatePlan(logicalPlan: PipelineLogicalPlan, alignSinks: boolean) {
    const { groups, links, nodes } = generateLogicalPlan(logicalPlan, alignSinks)
    this.setState({ groups, links, nodes })
  }

  onClick = (e: React.SyntheticEvent<HTMLElement>) => {
    const el: EventTarget = e.target
    const node = (el as HTMLElement).getAttribute('data-node')
    if (node && this.props.onClick) this.props.onClick(node!)
  }

  // More accurately this de-emphasizes nodes that aren't contained in the filtered list
  emphasizeFiltered = () => {
    const { filtered } = this.props
    const { nodes } = this.state

    if (!filtered) return

    if (filtered.length === nodes.length) {
      Array.from(this.root!.querySelectorAll('path.filtered, circle.filtered')).forEach(
        (el: Element) => el.classList.remove('filtered')
      )
    } else {
      const ids = filtered.reduce((acc: any, comp) => (acc[comp.id] = 1) && acc, {})

      Array.from(this.root!.querySelectorAll('path')).forEach((el: SVGPathElement) =>
        el.classList.add('filtered')
      )
      Array.from(this.root!.querySelectorAll('circle')).forEach((el: SVGCircleElement) => {
        el.classList[ids[(el as any).dataset.node] ? 'remove' : 'add']('filtered')
      })
    }
  }

  // Starting with the row after the target group we recursively search
  // for node's inputComponents and generate a list of tuples of connected
  // nodes
  tracePath = (source: Node): Node[][] => {
    const connected: Node[][] = []
    const groups = this.state.groups
    const findConnected = (depth: number, parent: Node, name: string) => {
      groups[depth].forEach((n: Node) => {
        if (n.name === name) {
          connected.push([parent, n])
          if (n.inputComponents) {
            n.inputComponents.forEach(cmp => findConnected(depth - 1, n, cmp))
          }
        }
      })
    }

    if (source.inputComponents) {
      source.inputComponents.forEach(name => findConnected(source.groupIndex - 1, source, name))
    }

    return connected
  }

  // Highlight the graph between the spout(s) and this node
  highlightConnected = (n: Node) => {
    this.tracePath(n).forEach(c => {
      const sel = `.${this.generateEdgeClass(c[1], c[0])}`
      const el = this.root!.querySelector(sel)
      if (el) el.classList.add('active')
    })
  }

  // Toggle off the highlight
  removeHighlight = () => {
    Array.from(this.root!.querySelectorAll('path')).forEach((el: SVGPathElement) =>
      el.classList.remove('active')
    )
  }

  renderPlan(nodes: Node[], groups: Node[][], links: Link[]) {
    if (nodes.length === 0) return null

    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11640
    const padding = this.props.padding!
    const outerWidth = this.props.width!
    const outerHeight = this.props.height!
    const height = outerHeight - padding.top - padding.bottom
    const width = outerWidth - padding.left - padding.right
    const hOffset = 1.0 / (groups.length + 1)

    nodes.forEach(node => {
      const x = hOffset * (node.groupIndex + 1)
      const group = groups[node.groupIndex]
      const vOffset = 1.0 / (group.length + 1)
      const y = vOffset * (group.indexOf(node) + 1)
      // Interpolate it with lesser width to account for nodes that are in the
      // extreme right. Otherwise, those nodes would sometimes not respond to
      // hover function.
      node.x = interpolate(0, width)(x)
      node.y = interpolate(0, height)(y)
    })

    const yRange = extent(nodes, d => d.y)

    return (
      <svg
        width={width}
        height={(yRange[1] || height) - (yRange[0] || 0) + padding.top + padding.bottom}
      >
        <g transform={`translate(0,${padding.top - (yRange[0] || 0)})`}>
          {nodes.map((n, i) => this.renderGroup(n, i))}
        </g>
      </svg>
    )
  }

  // Renders a node, edge and popup for a given process
  renderGroup(n: Node, i: number) {
    const stroke = this.props.stroke

    return (
      <g key={`${this.props.id}--${n.name}`} className="top-node">
        {n.edges.map((edge, j) => (
          <path
            key={j}
            className={classnames(
              'link',
              this.generateEdgeClass(edge.source, edge.target),
              edge.target.isTerminal && 'sink'
            )}
            fill="none"
            strokeWidth={stroke}
            d={this.generateEdgePath(edge)}
          />
        ))}
        <SVGTooltip isDisabled={!n.isReal} content={n.name}>
          {this.renderComponent(n)}
        </SVGTooltip>
      </g>
    )
  }

  renderComponent(n: Node) {
    const hl = () => this.highlightConnected(n)
    const radius = this.props.radius

    return (
      <circle
        onMouseEnter={hl}
        onMouseOut={this.removeHighlight}
        data-node={n.name}
        className={classnames('node', healthClass(n.health), n.isLast && 'final')}
        cx={n.x}
        cy={n.y}
        r={n.isReal ? radius : 0}
      />
    )
  }

  // Generates the path to connect two nodes
  generateEdgePath(edge: Link) {
    return generatePath(edge.source, edge.target)
  }

  // Edge classes are generated from a pair of node's groupIndex and groupsLevelIndex
  // e.g. link-1_1--2_2
  generateEdgeClass(source: Node, target: Node) {
    const t = `${target.groupIndex}_${target.groupsLevelIndex}`
    const s = `${source.groupIndex}_${source.groupsLevelIndex}`
    return `link-${t}--${s}`
  }

  render() {
    return (
      <div
        ref={ref => (this.root = ref)}
        className="logical-plan"
        onClick={this.onClick}
        style={{ minHeight: this.props.containerMinHeight }}
      >
        {this.renderPlan(this.state.nodes, this.state.groups, this.state.links)}
      </div>
    )
  }
}

export default LogicalPlan

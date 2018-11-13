// tslint:disable
import memoize from 'lodash-es/memoize'

/**
 * Code for drawing the connected circles that make up the logical plan for this topology.
 *
 * Originally based on code from https://github.com/twitter/heron/blob/master/heron/tools/ui/resources/static/js/logical-plan.js
 *
 * NOTE: I'm incrementally changing this code to reduce the chance of introducing bugs
 */
// @ts-ignore
function compare(a, b) {
  const aIndices = a.sourceGroupsLevelIndices
  const bIndices = b.sourceGroupsLevelIndices
  let sumA = 0
  let sumB = 0
  for (let i = 0; i < aIndices.length; i++) {
    sumA += aIndices[i]
  }
  for (let i = 0; i < bIndices.length; i++) {
    sumB += bIndices[i]
  }
  const avgA = sumA / aIndices.length
  const avgB = sumB / bIndices.length

  return avgA - avgB
}

// Rearrage nodes in the groups so that the number of intersections of edges is
// minimized.
// Ideally, there should be no intersections, but if that is not achievable,
// rearrage so as to have minimum intersections.
// @ts-ignore
function minimizeIntersections(groups) {
  // First assign group level index.
  // Also set the source group level indices.
  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groups[i].length; j++) {
      groups[i][j].groupsLevelIndex = j
      for (let e = 0; e < groups[i][j].edges.length; e++) {
        const node = groups[i][j].edges[e].target
        if (node.sourceGroupsLevelIndices === undefined) {
          node.sourceGroupsLevelIndices = []
        }
        node.sourceGroupsLevelIndices.push(j)
      }
    }
  }

  // Sort individual groups based on avg sourceGroupsLevelIndices. Don't forget
  // to update its own groupLevelIndex and next level nodes' sourceGroupsLevelIndices.
  // Need to start from 1, since 0 level nodes won't have any
  // sourceGroupsLevelIndices.
  for (let i = 1; i < groups.length; i++) {
    groups[i].sort(compare)
    for (let j = 0; j < groups[i].length; j++) {
      groups[i][j].groupsLevelIndex = j
      // Reset the next level's sourceGroupsLevelIndices.
      for (let e = 0; e < groups[i][j].edges.length; e++) {
        groups[i][j].edges[e].target.sourceGroupsLevelIndices = undefined
      }
    }
    for (let j = 0; j < groups[i].length; j++) {
      groups[i][j].groupsLevelIndex = j
      // Now set those values again.
      for (let e = 0; e < groups[i][j].edges.length; e++) {
        let node = groups[i][j].edges[e].target
        if (node.sourceGroupsLevelIndices === undefined) {
          node.sourceGroupsLevelIndices = []
        }
        node.sourceGroupsLevelIndices.push(j)
      }
    }
  }

  return groups
}

// Sort the graph topologically and also add virual nodes.
// Real nodes will be rendered, virtual nodes are used to
// assist in routing the graph
// Note that this modifies the collection in place
const groupify = memoize((nodes, links, addTerminalGroup) => {
  // @ts-ignore
  nodes.forEach(node => {
    node.isReal = true
  })

  const numNodes = nodes.length
  const nodesToLinks = {}

  // @ts-ignore
  links.forEach(l => {
    if (!(l.source.name in nodesToLinks)) {
      // @ts-ignore
      nodesToLinks[l.source.name] = []
    }
    // @ts-ignore
    nodesToLinks[l.source.name].push(l)
  })

  // @ts-ignore
  nodes.forEach(node => (node.edges = nodesToLinks[node.name] ? nodesToLinks[node.name] : []))

  // Find the first elements
  // @ts-ignore
  let group = nodes.filter(node => links.every(link => node !== link.target))
  let groupIndex = 0

  // @ts-ignore
  group.forEach(node => (node.groupIndex = groupIndex))
  groupIndex++

  // @ts-ignore
  let toProcess = []
  let nextLinks = group.map(
    // @ts-ignore
    node => (nodesToLinks[node.name] === undefined ? [] : nodesToLinks[node.name])
  )

  // @ts-ignore
  nextLinks.forEach(arr => {
    // @ts-ignore
    toProcess = toProcess.concat(arr)
  })

  while (toProcess.length > 0) {
    // In case of circular graphs, this will prevent infinte loop
    if (groupIndex > numNodes) break

    // @ts-ignore
    group = toProcess.map(link => link.target)
    // @ts-ignore
    group.forEach(node => {
      node.groupIndex = groupIndex
    })

    // @ts-ignore
    nextLinks = group.map(node => (node.name in nodesToLinks ? nodesToLinks[node.name] : []))

    toProcess = []

    if (nextLinks.length > 0) {
      // @ts-ignore
      nextLinks.forEach(arr => {
        // @ts-ignore
        toProcess = toProcess.concat(arr)
      })
    }
    groupIndex++
  }

  const groups = Array.apply(null, new Array(groupIndex)).map(() => [])

  // @ts-ignore
  nodes.forEach(node => groups[node.groupIndex].push(node))

  // Check if our graph is imbalanced, that is terminal nodes occur before the last row
  // @ts-ignore
  const imbalanced = groups.some(group =>
    // @ts-ignore
    group.some(node => node.edges.length === 0 && node.groupIndex < groups.length - 1)
  )

  // In order to align the output nodes we'll insert a fake nodes in the last
  // column and link
  // TODO in order to minimize squiggles we could only insert a node when the
  // level starts to changes. So starting from the terminal node determine
  // the group BEFORE the first level change. That's only node we need
  // TODO move terminal nodes into the final group rather than using virtual nodes
  // NOTE if this is performed AFTER virtual node insertion we'll get a spider web
  // mess
  if (addTerminalGroup && imbalanced) {
    // @ts-ignore
    const terminalGroup = []

    // @ts-ignore
    groups.forEach(group => {
      // @ts-ignore
      group.forEach(node => {
        // Terminating node will have no edges
        // We don't need to draw this if all terminate nodes end in the same column
        if (node.edges.length === 0) {
          const newNode = {
            groupIndex,
            edges: [],
            isReal: true,
            isTerminal: true,
            isLast: true,
            health: 'unknown',
            name: `${node.name}-terminal`,
          }
          node.edges.push({ source: node, target: newNode })
          // @ts-ignore
          terminalGroup.push(newNode)
        }
      })
    })

    // @ts-ignore
    if (terminalGroup.length) groups.push(terminalGroup)
  }

  // Insert virtual nodes if a node target is not in an adjacent column
  // @ts-ignore
  groups.forEach((group, i) => {
    // @ts-ignore
    group.forEach((node, j) => {
      // @ts-ignore
      node.edges.forEach(edge => {
        const diff = edge.target.groupIndex - node.groupIndex
        if (diff > 1) {
          const newNode = {
            groupIndex: i + 1,
            edges: [],
            isTerminal: !!edge.target.isTerminal,
            isReal: false,
            name: i +'-'+ j,
            health: 'unknown'
          }

          // @ts-ignore
          newNode.edges.push({
            source: newNode,
            target: edge.target,
          })

          edge.target = newNode
          groups[i + 1].push(newNode)
        }
      })
    })
  })

  // @ts-ignore
  groups[0].forEach(n => (n.isFirst = true))
  // @ts-ignore
  groups[groups.length - 1].forEach(n => (n.isLast = true))

  return minimizeIntersections(groups)
})

// @ts-ignore
function generateLogicalPlan(topology, addTerminalGroup = false) {
  // @ts-ignore
  const links = [] // : Array<{ source: Bolt | Spout, target: Bolt }>
  const spoutsArr = [] // : Array<{ name: string, inputComponents: string[] }
  const boltsArr = [] // : Array<{ name: string, inputComponents: string[] }

  addTerminalGroup = !!addTerminalGroup

  // create the spout array
  for (const i in topology.spouts) {
    spoutsArr.push({ name: i, health: topology.spouts[i].health })
  }

  // create the bolt array
  for (const i in topology.bolts) {
    const bolt = topology.bolts[i]
    let inputComponents = bolt.inputComponents
    if (!inputComponents) {
      // @ts-ignore
      inputComponents = bolt.inputs.map(i => i.component_name)
    }
    boltsArr.push({ name: i, inputComponents, health: bolt.health })
  }

  // @ts-ignore
  const nodes = spoutsArr.concat(boltsArr)

  for (const b in boltsArr) {
    for (const w in nodes) {
      if (boltsArr[b].inputComponents.indexOf(nodes[w].name) >= 0) {
        links.push({ source: nodes[w], target: boltsArr[b] })
      }
    }
  }

  // Groupify
  const groups = groupify(nodes, links, addTerminalGroup)

  // Done groupifying
  nodes.length = links.length = 0

  // @ts-ignore
  groups.forEach(group => {
    // @ts-ignore
    group.forEach(node => {
      nodes.push(node)
      // @ts-ignore
      node.edges.forEach(edge => links.push(edge))
    })
  })

  return { groups, nodes, links }
}

export default generateLogicalPlan

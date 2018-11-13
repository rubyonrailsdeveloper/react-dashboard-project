import * as pathToRegexp from 'path-to-regexp'

const escapedSlash = '%2F'
const escapedSlashRx = new RegExp(escapedSlash, 'g')

const r: RouteMaker = (route: string) => {
  const routeToPath = pathToRegexp.compile(route)
  return Object.assign((params?: object) => routeToPath(params).replace(escapedSlashRx, '/'), {
    route,
  })
}

export const indexUrl = '/'

// IDs are unfortunately separated by slashes in Streamlio's API, for ease of use and
// sanity, we treat a 2 segment (e.g. a/b) or 3 segment (e.g. a/b/c) path as the ID for
// the different entities. The end result is that, for example, pipelineObj.id === parse(url).id
// note: this could be done more succinctly if path-to-regex supported nested groups
// https://github.com/pillarjs/path-to-regexp/issues/95
const twoSegmentId = `[^/]+/[^/]+|[^/]+${escapedSlash}[^/]+`
const threeSegmentId = `[^/]+/[^/]+/[^/]+|[^/]+${escapedSlash}[^/]+${escapedSlash}[^/]+`

// Authentication
export const loginUrl = r('/login')

// Groups
export const groupListUrl = r('/groups')

export const groupUrl = r<Id>(`${groupListUrl.route}/:id`)

export const groupNamespacesUrl = r<Id>(`${groupUrl.route}/namespaces`)

export const groupGraphsUrl = r<Id>(`${groupUrl.route}/graphs`)

export const groupUsersUrl = r<Id>(`${groupUrl.route}/users`)

// Namespaces
export const namespaceListUrl = r('/namespaces')

export const namespaceUrl = r<Id>(`${namespaceListUrl.route}/:id(${twoSegmentId})`)

export const namespacePipelinesUrl = r<Id>(`${namespaceUrl.route}/pipelines`)

export const namespaceTopicsUrl = r<Id>(`${namespaceUrl.route}/topics`)

export const namespaceGraphsUrl = r<Id>(`${namespaceUrl.route}/graphs`)

// Pipelines
export const pipelineListUrl = r('/pipelines')

export const pipelineUrl = r<Id>(`${pipelineListUrl.route}/:id(${threeSegmentId})`)

export const pipelineContainersUrl = r<Id>(`${pipelineUrl.route}/containers`)

export const pipelineGraphsUrl = r<Id>(`${pipelineUrl.route}/graphs`)

export const pipelineConfigUrl = r<Id>(`${pipelineUrl.route}/config`)

// Topics
export const topicListUrl = r('/topics')

export const topicUrl = r<Id>(`${topicListUrl.route}/:id(${threeSegmentId})`)

export const topicProducersUrl = r<Id>(`${topicUrl.route}/producers`)

export const topicConsumersUrl = r<Id>(`${topicUrl.route}/consumers`)

export const topicGraphsUrl = r<Id>(`${topicUrl.route}/graphs`)

// Stream Functions
export const streamFunctionListUrl = r('/functions')

export const streamFunctionUrl = r<Id>(`${streamFunctionListUrl.route}/:id(${threeSegmentId})`)

// Clusters
export const clusterListUrl = r('/clusters')

export const clusterUrl = r<Id>(`${clusterListUrl.route}/:id`)

export const clusterNodesUrl = r<Id>(`${clusterUrl.route}/nodes`)

export const clusterGraphsUrl = r<Id>(`${clusterUrl.route}/graphs`)

// Nodes
export const nodeListUrl = r('/nodes')

export const nodeUrl = r<Id>(`${nodeListUrl.route}/:id(${twoSegmentId})`)

export const nodeContainersUrl = r<Id>(`${nodeUrl.route}/containers`)

export const nodeGraphsUrl = r<Id>(`${nodeUrl.route}/graphs`)

// Containers
export const containerListUrl = r('/containers')

export const containerUrl = r<Id>(`${containerListUrl.route}/:id(${threeSegmentId})`)

export const containerProcessesUrl = r<Id>(`${containerUrl.route}/processes`)

export const containerGraphsUrl = r<Id>(`${nodeUrl.route}/graphs`)

// Users
export const userListUrl = r('/users')

export const userUrl = r(`${userListUrl.route}/:id`)

interface RouteMaker {
  (route: string): SimpleRoute
  <P>(route: string): Route<P>
}

interface SimpleRoute {
  (): string
  route: string
}

interface Route<P> {
  (params: P): string
  route: string
}

interface Id {
  id: string
}

export type EntityParams = Id

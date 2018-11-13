import keyBy from 'lodash-es/keyBy'
import { combineReducers } from 'redux'
import { createSelector, createStructuredSelector } from 'reselect'
import { PhysicalEntityTag } from 'src/store/constants'
import { getContainerList } from 'src/store/container/container-reducers'
import {
  ActionSwitchState,
  makeActionSwitchGetter,
  makeActionSwitchReducer,
} from 'src/store/internal/action-switch'
import {
  EntityLoadingState,
  makeEntityLoadingReducer,
  makeGetEntityError,
  makeGetEntityIsLoading,
} from 'src/store/internal/entity-loading'
import {
  makeGetQList,
  makeGetQListEntity,
  makeGetQListIsLoading,
  makeQueryableListReducer,
  QueryableListState,
} from 'src/store/internal/list'
import {
  ListProjectionState,
  makeGetListProjection,
  makeGetListProjectionError,
  makeGetListProjectionIsLoading,
  makeListProjectionReducer,
} from 'src/store/internal/projection'
import { requestNode, requestNodeList, requestNodesByCluster } from 'src/store/node/node-actions'
import {
  denormalizeNode,
  Node,
  nodeSchema,
  NodeSubEntities,
  NormalizedNode,
} from 'src/store/node/node-model'
import { State } from 'src/store/root-reducer'
import { ParametricSelector } from 'src/store/selectors'
import { EntitiesById } from 'src/store/util/normalize'
import { asyncParams } from 'src/store/util/reducer'
import { isType } from 'typescript-fsa'

export interface NodesState {
  list: QueryableListState<NormalizedNode>
  loading: EntityLoadingState
  byCluster: ActionSwitchState<ListProjectionState>
}

export const nodesReducer = combineReducers<NodesState>({
  list: makeQueryableListReducer({
    actions: requestNodeList,
    getEntities: results => results.entities.nodes,
  }),
  loading: makeEntityLoadingReducer(requestNode),
  byCluster: makeActionSwitchReducer({
    by: action => {
      if (
        isType(action, requestNodesByCluster.started) ||
        isType(action, requestNodesByCluster.done) ||
        isType(action, requestNodesByCluster.failed)
      ) {
        return asyncParams(action).cluster
      }

      return null
    },
    reducer: makeListProjectionReducer({ actions: requestNodesByCluster }),
  }),
})

/// Selectors
const getList = (state: State) => state.nodes.list
const getLoading = (state: State) => state.nodes.loading
const byCluster = (state: State) => state.nodes.byCluster

const getNodesSubEntities = createStructuredSelector<State, NodeSubEntities>({
  containers: state => keyBy(getContainerList(state), c => c.id),
})

// Gets the list of all nodes
export const getNodeList = makeGetQList(getList, getNodesSubEntities, denormalizeNode)

// Gets whether the list of all nodes is loading
export const getNodeListIsLoading = makeGetQListIsLoading(getList)

// Creates a selector that gets a node by id
export const makeGetNode = () => makeGetQListEntity(getList, getNodesSubEntities, denormalizeNode)

// Creates a selector that gets a node containers
export const getNodeContainers = createSelector(
  getList,
  (state: State, id: string) => id,
  (nodes, id) => nodes.byId[id].containers
)

// Creates a selector that gets a node containers id as OR string
export const makeGetNodeContainersAsOrString = () =>
  createSelector(getNodeContainers, containers => containers.map(({ id }: any) => id).join('|'))

// Gets whether a node is loading
export const getNodeIsLoading = makeGetEntityIsLoading(getLoading)

// Gets the loading error (if any) of a node
export const getNodeLoadingError = makeGetEntityError(getLoading)

interface ClusterFilter {
  cluster: string
}

const byClusterKey = makeActionSwitchGetter(byCluster, ({ cluster }: ClusterFilter) => cluster)

const getNormalizedNodes = createStructuredSelector<
  State,
  { nodes: EntitiesById<NormalizedNode> } & NodeSubEntities
>({
  nodes: (state: State) => getList(state).byId || {},
  containers: state => keyBy(getContainerList(state), c => c.id),
})

export const makeGetNodesByCluster = () =>
  makeGetListProjection<Node, ClusterFilter>(byClusterKey, nodeSchema, getNormalizedNodes)

export const getNodesByClusterIsLoading = makeGetListProjectionIsLoading(byClusterKey)

export const getNodesByClusterError = makeGetListProjectionError(byClusterKey)

interface TagFilter {
  tag: PhysicalEntityTag | undefined
}

export const makeGetNodesFiltered = <Props>(getNodes: ParametricSelector<Props, Node[] | null>) =>
  createSelector<
    State,
    Props & TagFilter,
    Node[] | null,
    PhysicalEntityTag | undefined,
    Node[] | null
  >(
    getNodes,
    (_, { tag }) => tag,
    (nodes, tag) => {
      if (!nodes || !tag) return nodes
      return nodes.filter(node => node.tags.includes(tag))
    }
  )

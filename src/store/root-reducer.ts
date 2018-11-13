import { AnyAction, combineReducers } from 'redux'
import { loggedOut } from 'src/store/auth/auth-actions'
import { authReducer, AuthState } from 'src/store/auth/auth-reducers'
import { clustersReducer, ClustersState } from 'src/store/cluster/cluster-reducers'
import { containersReducer, ContainersState } from 'src/store/container/container-reducers'
import { groupsReducer, GroupsState } from 'src/store/group/group-reducers'
import { metricsReducer, MetricsState } from 'src/store/metrics/metrics-reducer'
import { namespacesReducer, NamespacesState } from 'src/store/namespace/namespace-reducers'
import { nodesReducer, NodesState } from 'src/store/node/node-reducers'
import { physicalPlansReducer, PhysicalPlansState } from 'src/store/physical-plan/physical-plan-reducers'
import { pipelinesReducer, PipelinesState } from 'src/store/pipeline/pipeline-reducers'
import { streamFunctionsReducer, StreamFunctionsState } from 'src/store/streamfunction/streamfunction-reducers'
import { topicsReducer, TopicsState } from 'src/store/topic/topic-reducers'
import { usersReducer, UsersState } from 'src/store/user/user-reducers'
import { isType } from 'typescript-fsa'

export interface State {
  auth: AuthState
  pipelines: PipelinesState
  physicalPlans: PhysicalPlansState
  topics: TopicsState
  streamFunctions: StreamFunctionsState
  metrics: MetricsState
  namespaces: NamespacesState
  groups: GroupsState
  clusters: ClustersState
  nodes: NodesState
  containers: ContainersState
  users: UsersState
}

export type ClearableState = State | undefined

const appReducer = combineReducers<ClearableState>({
  auth: authReducer,
  pipelines: pipelinesReducer,
  physicalPlans: physicalPlansReducer,
  topics: topicsReducer,
  streamFunctions: streamFunctionsReducer,
  metrics: metricsReducer,
  namespaces: namespacesReducer,
  groups: groupsReducer,
  clusters: clustersReducer,
  nodes: nodesReducer,
  containers: containersReducer,
  users: usersReducer,
})

export const rootReducer = (state: ClearableState, action: AnyAction) =>
  appReducer(isType(action, loggedOut.done) ? undefined : state, action) as State

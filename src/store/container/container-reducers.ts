import { combineReducers } from 'redux'
import { createSelector, createStructuredSelector } from 'reselect'
import { PhysicalEntityTag } from 'src/store/constants'
import { requestContainer } from 'src/store/container/container-actions'
import {
  Container,
  denormalizeContainer,
  NormalizedContainer,
} from 'src/store/container/container-model'
import {
  EntityLoadingState,
  makeEntityLoadingReducer,
  makeGetEntityError,
  makeGetEntityIsLoading,
} from 'src/store/internal/entity-loading'
import {
  EntityListState,
  makeEntityListReducer,
  makeGetEList,
  makeGetEListEntity,
} from 'src/store/internal/list'
import { State } from 'src/store/root-reducer'
import { ParametricSelector } from 'src/store/selectors'

export interface ContainersState {
  list: EntityListState<NormalizedContainer>
  loading: EntityLoadingState
}

export const containersReducer = combineReducers<ContainersState>({
  list: makeEntityListReducer({
    getEntities: results => results.entities.containers,
  }),
  loading: makeEntityLoadingReducer(requestContainer),
})

/// Selectors
const getList = (state: State) => state.containers.list
const getLoading = (state: State) => state.containers.loading

const getContainersSubEntities = createStructuredSelector({})

// Gets the list of all containers
export const getContainerList = makeGetEList(
  getList,
  getContainersSubEntities,
  denormalizeContainer
)

// Creates a selector that gets a container by id
export const makeGetContainer = () =>
  makeGetEListEntity(getList, getContainersSubEntities, denormalizeContainer)

// Gets whether a container is loading
export const getContainerIsLoading = makeGetEntityIsLoading(getLoading)

// Gets the loading error (if any) of a container
export const getContainerLoadingError = makeGetEntityError(getLoading)

interface NodeFilter {
  node: string
}

export const makeGetContainersByNode = () =>
  createSelector(
    getContainerList,
    (_: State, { node }: NodeFilter) => node,
    (containers, node) => containers.filter(c => c.nodeId === node)
  )

interface TagFilter {
  tag: PhysicalEntityTag | undefined
}

export const makeGetContainersFiltered = <Props>(
  getContainers: ParametricSelector<Props, Container[] | null>
) =>
  createSelector<
    State,
    Props & TagFilter,
    Container[] | null,
    PhysicalEntityTag | undefined,
    Container[] | null
  >(
    getContainers,
    (_, { tag }) => tag,
    (containers, tag) => {
      if (!containers || !tag) return containers
      return containers.filter(container => container.tags.includes(tag))
    }
  )

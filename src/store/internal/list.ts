import map from 'lodash-es/map'
import merge from 'lodash-es/merge'
import reduceReducer from 'reduce-reducers'
import { AnyAction, combineReducers } from 'redux'
import { createSelector } from 'reselect'
import { NestedId } from 'src/store/constants'
import {
  AsyncErrorState,
  IsLoadingState,
  makeAsyncErrorReducer,
  makeIsLoadingReducer,
} from 'src/store/internal/async'
import { State } from 'src/store/root-reducer'
import { EntitiesById, EntityDenormalizer, NormalizedPayload } from 'src/store/util/normalize'
import { AsyncActionCreators, isType } from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export type EntityListState<T> = EntitiesById<T>

const entityListInitState: EntityListState<any> = {}

interface EntityListOpts<T> {
  filterAction?: (action: AnyAction) => boolean
  getEntities: (payload: NormalizedPayload) => EntitiesById<T> | undefined | null
}

export const makeEntityListReducer = <T>({ filterAction, getEntities }: EntityListOpts<T>) => (
  state = entityListInitState,
  action: AnyAction
) => {
  if (
    action.payload &&
    action.payload.result &&
    action.payload.result.entities &&
    (!filterAction || filterAction(action))
  ) {
    const entities = getEntities(action.payload.result)
    if (entities) return merge({}, state, entities)
  }

  return state
}

export interface QueryableListState<T> {
  isLoading: IsLoadingState
  error: AsyncErrorState<{}>
  byId: EntityListState<T>
}

interface QueryableList<T> {
  getEntities: EntityListOpts<T>['getEntities']
  actions: AsyncActionCreators<any, NormalizedPayload, any>
}

export const makeQueryableListReducer = <T>({ getEntities, actions }: QueryableList<T>) => {
  const byId = reduceReducer(
    reducerWithInitialState<EntityListState<T>>(entityListInitState)
      .case(actions.done, (_, { result }) => getEntities(result) || {})
      .build(),
    makeEntityListReducer({
      getEntities,
      filterAction: action => !isType(action, actions.done),
    })
  )

  return combineReducers({
    isLoading: makeIsLoadingReducer(actions),
    error: makeAsyncErrorReducer(actions),
    byId,
  })
}

/// Selectors
type EntityListGetter<T> = (state: State) => EntityListState<T>

const makeGetRawEList = <T>(getList: EntityListGetter<T>) => getList

const makeGetRawEListEntity = <T>(getList: EntityListGetter<T>) =>
  createSelector(getList, (_: State, { id }: NestedId) => id, (list, id) => list[id] || null)

export const makeGetEList = <T, Denormalized, SubEntities>(
  getList: EntityListGetter<T>,
  getRequiredEntities: (state: State) => SubEntities,
  denormalizeEntity: EntityDenormalizer<T, Denormalized, SubEntities>
) =>
  createSelector(makeGetRawEList(getList), getRequiredEntities, (list, entities) =>
    map(list, entity => denormalizeEntity(entity, entities))
  )

export const makeGetEListEntity = <T, Denormalized, SubEntities, Props>(
  getList: EntityListGetter<T>,
  getRequiredEntities: (state: State, props: Props) => SubEntities,
  denormalizeEntity: EntityDenormalizer<T, Denormalized, SubEntities>
) =>
  createSelector<State, NestedId & Props, T, SubEntities, Denormalized | null>(
    makeGetRawEListEntity(getList),
    getRequiredEntities,
    (normalized, entities) => normalized && denormalizeEntity(normalized, entities)
  )

type QueryableListGetter<T> = (state: State) => QueryableListState<T>

const makeGetById = <T>(getList: QueryableListGetter<T>) => (state: State) => getList(state).byId

export const makeGetQList = <T, Denormalized, RequiredEntities>(
  getState: QueryableListGetter<T>,
  getRequiredEntities: (state: State) => RequiredEntities,
  denormalizeEntity: EntityDenormalizer<T, Denormalized, RequiredEntities>
) => makeGetEList(makeGetById(getState), getRequiredEntities, denormalizeEntity)

export const makeGetQListEntity = <T, Denormalized, RequiredEntities>(
  getState: QueryableListGetter<T>,
  getRequiredEntities: (state: State) => RequiredEntities,
  denormalizeEntity: EntityDenormalizer<T, Denormalized, RequiredEntities>
) => makeGetEListEntity(makeGetById(getState), getRequiredEntities, denormalizeEntity)

export const makeGetQListIsLoading = <T>(getList: QueryableListGetter<T>) => (state: State) =>
  getList(state).isLoading

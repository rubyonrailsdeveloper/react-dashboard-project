import { assertUnreachable } from 'src/util/misc'

export interface Action<T> {
  type: string
  payload: T
  error?: boolean
  meta?: any
}

export interface NestedId {
  id: string
}

export interface EntityResources {
  cpu: number
  memory: number
  storage: number
}

export interface AvailableEntityResources {
  limits: EntityResources
  used: EntityResources
}

export enum Health {
  UNKNOWN = 'unknown',
  OK = 'ok',
  UNHEALTHY = 'unhealthy',
  FAILING = 'failing',
}

export const healthSortWeight = (health: Health): number => {
  switch (health) {
    case Health.FAILING:
      return 100000
    case Health.UNHEALTHY:
      return 1000
    case Health.UNKNOWN:
      return 1
    case Health.OK:
      return 0
    default:
      return assertUnreachable(health)
  }
}

export interface RelatedEntity {
  id: string
  health: Health
  clusters: string[]
}

export type Requester = string

export interface CommonOperationParams extends NestedId {
  requester: Requester
}

export enum PhysicalEntityTag {
  STORAGE = 'storage',
  COMPUTE = 'compute',
  MESSAGING = 'messaging',
}

export const dashboardRefreshRate = 10000

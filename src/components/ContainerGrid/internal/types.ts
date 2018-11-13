import { Health, NestedId } from 'src/store/constants'

export interface ContainerLike extends NestedId {
  id: string
  instances: InstanceLike[]
}

export interface InstanceLike extends NestedId {
  health: Health
  name?: string
}

import { denormalize, schema } from 'normalizr'
import { Health, PhysicalEntityTag } from 'src/store/constants'

export const containerSchema = new schema.Entity('containers', {})

export interface CommonContainer {
  id: string
  node: string
  nodeId: string
  cluster: string
  name: string
  health: Health
  tags: PhysicalEntityTag[]
  processes?: Process[]
  resources?: {
    limits: {
      cpu: number
      storage: number
      memory: number
    }
    used: {
      cpu: number
      storage: number
      memory: number
    }
  }
  mountedVolumes?: string[]
}

export interface Process {
  id: string
  name?: string
  health: Health
  resources?: {
    limits: {
      cpu: number
      storage: number
      memory: number
    }
    used: {
      cpu: number
      storage: number
      memory: number
    }
  }
}

export type Container = CommonContainer

export type NormalizedContainer = CommonContainer

// tslint:disable-next-line no-empty-interface
export interface ContainerSubEntities {
  // Nothing yet
}

export const denormalizeContainer = (
  container: NormalizedContainer | null,
  entities: ContainerSubEntities
): Container => denormalize(container, containerSchema, entities)

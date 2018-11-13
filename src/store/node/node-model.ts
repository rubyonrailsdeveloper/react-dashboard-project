import { denormalize, schema } from 'normalizr'
import { Health, PhysicalEntityTag } from 'src/store/constants'
import { Container, containerSchema } from 'src/store/container/container-model'
import { EntitiesById } from 'src/store/util/normalize'

export const nodeSchema = new schema.Entity('nodes', {
  containers: [containerSchema],
})

export interface NodeLimits {
  cpu: number
  storage: number
  memory: number
}

export interface CommonNode {
  id: string
  cluster: string
  name: string
  health: Health
  tags: PhysicalEntityTag[]
  storageDevices: number
  resources: {
    limits: NodeLimits
    used: {
      cpu: number
      storage: number
      memory: number
    }
  }
  address: string
}

export interface NormalizedNode extends CommonNode {
  containers: string[]
}

export interface Node extends CommonNode {
  containers: Container[]
}

// tslint:disable-next-line no-empty-interface
export interface NodeSubEntities {
  containers: EntitiesById<Container>
}

export const denormalizeNode = (node: NormalizedNode | null, entities: NodeSubEntities): Node =>
  denormalize(node, nodeSchema, entities)

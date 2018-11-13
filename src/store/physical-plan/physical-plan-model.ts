import { denormalize, schema } from 'normalizr'
import { Health } from 'src/store/constants'
import { EntitiesById } from 'src/store/util/normalize'

interface CommonPhysicalPlan {
  id: string
  spouts: Components
  bolts: Components
  instance_groups: {
    [containerId: string]: {
      health: Health
      instances: string[]
    }
  }
}

interface Components {
  [componentId: string]: string[]
}

export interface NormalizedPhysicalPlan {
  instances: string[]
}

export interface PhysicalPlan extends CommonPhysicalPlan {
  instances: Instance[]
}

export interface Instance {
  id: string
  containerId: string
  health: Health
  name: string // Component name
  logfile: string
  stmgrId: string
}

export enum ComponentType {
  SPOUT = 'spout',
  BOLT = 'bolt',
}

export const instanceSchema = new schema.Entity('instances')

export const physicalPlanSchema = new schema.Entity('physicalPlans', {
  instances: [instanceSchema],
})

export interface PhysicalPlanSubEntities {
  instances: EntitiesById<Instance>
}

export const denormalizePhysicalPlan = (
  physicalPlan: NormalizedPhysicalPlan | null,
  entities: PhysicalPlanSubEntities
): PhysicalPlan => denormalize(physicalPlan, physicalPlanSchema, entities)

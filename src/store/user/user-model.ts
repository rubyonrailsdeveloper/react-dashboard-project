import { denormalize, schema } from 'normalizr'

export const userSchema = new schema.Entity('users', {})

export interface User {
  id: string
  username: string
  email: string
  name: string
}

export type NormalizedUser = User

// tslint:disable-next-line no-empty-interface
export interface UserSubEntities {
  // Nothing yet
}

export const denormalizeUser = (namespace: User | null, entities: UserSubEntities): User =>
  denormalize(namespace, userSchema, entities)

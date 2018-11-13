import { EntityResources } from 'src/store/constants'
import { User } from 'src/store/user/user-model'

export const groupDetailValidator = (values: any) => {
  const errors: any = {}

  if (values.name.trim() === '') errors.name = 'Name is required.'

  return errors
}

export const namespaceDetailValidator = (values: any) => {
  const errors: any = {}

  if (values.name.trim() === '') errors.name = 'Name is required.'
  if (values.group.trim() === '') errors.group = 'Group is required.'

  return errors
}

export const resourcesValidator = (limits: EntityResources | undefined, values: any) => {
  if (!limits) return {}

  const errors: any = {}
  const props = ['cpu', 'memory', 'storage']

  props.forEach((prop: string) => {
    let val = values[prop]

    if (Number.isNaN(Number.parseInt(val))) val = 0
    if (val < 0) errors[prop] = `${prop} cannot be less than zero.`
    if (val > (limits as any)[prop]) {
      errors[prop] = `${prop} cannot exceed total available resources.`
    }
  })

  return errors
}

export const passwordValidator = (values: any) => {
  const errors: any = {}
  const { password, passwordConfirmation } = values

  if (password.length < 8) errors.password = 'Password must be at least 8 characters'

  if (password !== passwordConfirmation) {
    errors.passwordConfirmation = 'Passwords do not match'
  }

  if (password.trim() === '') errors.password = 'Password is required'
  if (passwordConfirmation.trim() === '') {
    errors.passwordConfirmation = 'Confirmation is required'
  }

  return errors
}

export const streamFunctionNameValidator = (values: any) => {
  const errors: any = {}
  if (values.group.trim() === '') errors.group = 'Group is required.'
  if (values.namespace.trim() === '') errors.namespace = 'Namespace is required.'
  if (values.name.trim() === '') errors.name = 'Function name is required.'
  return errors
}

export const userDetailValidator = (user: User | undefined, values: any) => {
  let errors: any = {}
  const { name, email, username } = values

  if (name.trim() === '') errors.name = 'Name is required'

  if (username.trim() === '') errors.username = 'Username is required'
  if (username.length < 5) errors.username = 'Username must be at least 5 characters'

  if (email.trim() === '') {
    errors.email = 'Email is required'
  } else if (!/.+@.+/.test(email)) {
    errors.email = 'Invalid email address'
  }

  if (!user) {
    errors = { ...errors, ...passwordValidator(values) }
  }

  return errors
}

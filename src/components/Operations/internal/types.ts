import { FormikProps } from 'formik'
import { NestedId } from 'src/store/constants'

export interface SubscriptionNestedId {
  subscription: string
}

export interface NestedIdSubscription extends NestedId, SubscriptionNestedId {}

export interface DialogBaseProps {
  submitText: string
  title: string
}

export interface ConfirmationProps extends DialogBaseProps {
  confirmationString: string
  destructive: boolean
  requireConfirmation: boolean
}

export interface ClearBacklogProps extends DialogBaseProps {
  destructive: boolean
}

export interface SkipRequest extends NestedId {
  messages: number
}

export interface ApplyTTLRequest extends NestedId {
  ttl: number
}

export interface RollbackRequest extends NestedId {
  time: Date
}

export interface ResourceParams {
  cpu?: number
  memory?: number
  storage?: number
}

export type ResourceFormProps = FormikProps<ResourceParams>

export interface NamespaceParams extends ResourceParams {
  id?: string
  group: string
  name: string
  clusters?: string[]
  authorizations: {
    [role: string]: Array<'produce' | 'consume'>
  }
}

export type NamespaceFormProps = FormikProps<NamespaceParams>

export interface GroupParams extends ResourceParams {
  id?: string
  name: string
}

export type GroupFormProps = FormikProps<GroupParams>

export interface StreamFunctionParams {
  id?: string
  group: string
  namespace: string
  name: string
  topicIn: string
  topicOut: string
}

export type StreamFunctionFormProps = FormikProps<StreamFunctionParams>

export interface UserParams {
  id?: string
  name: string
  email: string
  password?: string
  passwordConfirmation?: string
}

export type UserFormProps = FormikProps<UserParams>

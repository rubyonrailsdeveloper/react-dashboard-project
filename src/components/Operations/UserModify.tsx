import uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import FormDialog, { Step } from 'src/components/Dialog/FormDialog'
import { EntityParams } from 'src/routes'
import { AvailableEntityResources } from 'src/store/constants'
import { State } from 'src/store/root-reducer'
import { triggerCreateUser, triggerUpdateUser } from 'src/store/user/user-actions'
import { User } from 'src/store/user/user-model'
import {
  getUserCreateState,
  getUserIsLoading,
  getUserUpdateState,
  makeGetUser,
} from 'src/store/user/user-reducers'
import makeCrudOperation, { CrudFormProps } from './internal/CrudOperation'
import { PasswordDetail, UserDetail } from './internal/EntityComponents'
import { UserFormProps, UserParams } from './internal/types'
import { passwordValidator, userDetailValidator } from './internal/validators'

type OwnProps = CrudFormProps & RouteComponentProps<EntityParams>

interface ConnectedProps {
  user: User
  isLoading: boolean
}

interface UserModifyState {
  resources?: AvailableEntityResources
  isLoading: boolean
}

type UserModifyProps = OwnProps & ConnectedProps

class UserModify extends React.Component<UserModifyProps, UserModifyState> {
  state: UserModifyState = { isLoading: false }

  initialValues: any = {}

  passwordValues = {
    password: '',
    passwordConfirmation: '',
  }

  userValues = {
    name: '',
    username: '',
    email: '',
  }

  componentWillMount() {
    this.setInitialValues()
  }

  onSubmit = (values: UserParams) => {
    this.props.onSubmit(
      uniqueId(`user${this.props.id ? 'Update' : 'Create'}`),
      this.toParams(values)
    )
  }

  toParams = (values: UserParams) => {
    const { id } = this.props
    return { id, ...values }
  }

  setInitialValues = () => {
    const { type, user } = this.props

    this.initialValues = !user
      ? { ...this.passwordValues, ...this.userValues }
      : {
          ...type === 'password' ? this.passwordValues : this.userValues,
          ...user,
        }
  }

  render() {
    const { id, type, user, onClose, isBusy } = this.props
    const title = type === 'password' ? 'Change Password' : `${id ? 'Modify' : 'Create'} User`
    const submitText =
      type === 'password' ? 'Change Password' : `${id ? 'Update' : 'Create'} and finish`

    // tslint:disable:jsx-no-lambda
    return (
      <FormDialog
        className="user-modify"
        title={title}
        initialValues={this.initialValues}
        isOpen={this.props.isOpen}
        isBusy={isBusy}
        isNew={!id}
        onCancel={onClose}
        onSubmit={this.onSubmit}
        submitText={submitText}
      >
        {type === 'password' ? (
          <Step
            title="Change Password"
            validator={passwordValidator}
            content={(props: UserFormProps) => <PasswordDetail {...props} />}
          />
        ) : (
          <Step
            title="Details"
            validator={values => userDetailValidator(user, values)}
            content={(props: UserFormProps) => <UserDetail {...props} user={user} />}
          />
        )}
      </FormDialog>
    )
  }
}

const connected = withRouter(
  connect((state: State, { id }: OwnProps) => {
    return {
      user: id ? makeGetUser()(state, { id }) : undefined,
      isLoading: id ? getUserIsLoading(state, { id }) : undefined,
    }
  }, {})(UserModify)
)

export const UserCreate = makeCrudOperation(connected, triggerCreateUser, (state: State) =>
  getUserCreateState(state)
)

export const UserUpdate = makeCrudOperation(
  connected,
  triggerUpdateUser,
  (state: State, id?: string) => getUserUpdateState(state, { id: id! })
)

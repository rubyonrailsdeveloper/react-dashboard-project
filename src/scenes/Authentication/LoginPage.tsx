import { Callout, Classes, FormGroup, IconClasses, Intent } from '@blueprintjs/core'
import classes from 'classnames'
import { Field, FormikProps, FormikTouched } from 'formik'
import { History } from 'history'
import * as React from 'react'
import { connect } from 'react-redux'
import FormDialog, { Error, Step } from 'src/components/Dialog/FormDialog'
import { indexUrl } from 'src/routes'
import { triggerLogin } from 'src/store/auth/auth-actions'
import { AuthState } from 'src/store/auth/auth-reducers'
import { State } from 'src/store/root-reducer'

interface LoginParams {
  username: string
  password: string
}

interface LoginPageProps {
  auth: AuthState
  history: History
  triggerLogin: typeof triggerLogin
}

export type LoginFormProps = FormikProps<LoginParams>

const loginValidator = (values: any) => {
  const errors: any = {}
  const { username, password } = values

  if (username.trim() === '') errors.username = 'Username is required.'
  if (password.trim() === '') errors.password = 'Password is required.'

  return errors
}

const inputClass = `${Classes.INPUT} ${Classes.FILL}`

export const LoginDetail = ({ errors, touched, error }: LoginFormProps & AuthState) => (
  <section className="login-details">
    <FormGroup>
      <Field
        className={classes(
          inputClass,
          touched.username && errors.username && Classes.intentClass(Intent.DANGER),
          Classes.LARGE
        )}
        type="text"
        name="username"
        placeholder="Username"
      />
      <Error errors={errors} touched={touched as FormikTouched<any>} field="username" />
    </FormGroup>
    <FormGroup>
      <Field
        className={classes(
          inputClass,
          touched.password && errors.password && Classes.intentClass(Intent.DANGER),
          Classes.LARGE
        )}
        type="password"
        name="password"
        placeholder="Password"
      />
      <Error errors={errors} touched={touched as FormikTouched<any>} field="password" />
    </FormGroup>
    {error && (
      <Callout iconName={IconClasses.ERROR} intent={Intent.DANGER}>
        {error}
      </Callout>
    )}
  </section>
)

class LoginPage extends React.Component<LoginPageProps> {
  initialValues = { username: '', password: '' }

  componentWillReceiveProps(nextProps: LoginPageProps) {
    if (!this.props.auth.token && nextProps.auth.token) {
      this.props.history.replace(indexUrl)
    }
  }

  onSubmit = (params: LoginParams) => {
    this.props.triggerLogin(params)
  }

  render() {
    const title = 'Please Login'
    const submitText = 'Login'
    const { auth } = this.props

    // tslint:disable:jsx-no-lambda
    return (
      <main id="login">
        <FormDialog
          inline={true}
          className="login-dialog"
          cancelable={false}
          title={title}
          initialValues={this.initialValues}
          isOpen={true}
          isBusy={auth.loading}
          isNew={true}
          onSubmit={this.onSubmit}
          submitText={submitText}
          submitClassName="pt-large pt-fill"
        >
          <Step
            title="Change Password"
            validator={loginValidator}
            content={(props: LoginFormProps) => <LoginDetail {...props} {...auth} />}
          />
        </FormDialog>
      </main>
    )
  }
}

export default connect(
  (state: State, props: any) => ({ auth: state.auth, history: props.history }),
  { triggerLogin }
)(LoginPage)

import {
  AnchorButton,
  Button,
  Classes,
  Dialog as BPDialog,
  Intent,
  Spinner,
} from '@blueprintjs/core'
import classes from 'classnames'
import classnames from 'classnames'
import {
  Form,
  Formik,
  FormikActions,
  FormikErrors,
  FormikProps,
  FormikTouched,
} from 'formik'
import * as React from 'react'
import { CommonDialogProps } from './Dialog'

export interface FormDialogProps extends CommonDialogProps {
  canSubmit?: boolean
  cancelable?: boolean
  className?: string
  initialStep?: number
  initialValues: {}
  isNew?: boolean
  nextText?: string
  onSubmit: (values: any, actions: FormikActions<any>) => void
  previousText?: string
  submitClassName?: string
}

interface FormDialogState {
  step: number
}

type StepValidator = (values: any) => object | Promise<any>

interface StepProps {
  content: (props: FormikProps<any>) => JSX.Element
  validator?: StepValidator
  title: string | JSX.Element
}

type StepComponent = React.ReactElement<StepProps>

export const Step = ({ title, content, validator }: StepProps) => null

export const Error = ({
  touched,
  errors,
  field,
}: {
  touched: FormikTouched<any>
  errors: FormikErrors<any>
  field: string
}) => (touched[field] && errors[field] ? <span className="error">{errors[field]}</span> : null)

class FormDialog extends React.Component<FormDialogProps, FormDialogState> {
  static defaultProps = {
    canSubmit: false,
    title: '',
    nextText: 'Next',
    previousText: 'Previous',
    submitText: 'Submit',
    cancelText: 'Cancel',
    cancelable: true,
    onCancel: () => undefined,
  }

  state: FormDialogState = { step: 0 }

  validators: StepValidator[] = []

  multiStep = true

  componentWillReceiveProps(nextProps: FormDialogProps) {
    if (!this.props.isOpen && nextProps.isOpen) {
      this.setState({ step: 0 })
    }
  }

  componentWillMount() {
    this.buildValidators()
    if (this.props.initialStep) this.setState({ step: this.props.initialStep })
  }

  onClose = () => {
    if (this.props.onCancel) this.props.onCancel()
  }

  onSubmit = (values: any, actions: FormikActions<any>) => {
    if (!this.props.isBusy) this.props.onSubmit(values, actions)
  }

  onNext = () => this.setState({ step: this.state.step + 1 })

  onPrev = () => this.setState({ step: this.state.step - 1 })

  onJump = (step: number) => {
    if (step < this.state.step) this.setState({ step })
  }

  onCancel = () => {
    if (!this.props.isBusy && this.props.onCancel!()) {
      this.onClose()
    }
  }

  renderStep = (step: React.ReactChild, idx: number, props: FormikProps<any>) => {
    return <div key={idx}>{(step as StepComponent).props.content(props)}</div>
  }

  renderStepTitle = (step: React.ReactChild, idx: number) => {
    const curStep = this.state.step
    const c = (e: React.SyntheticEvent<HTMLAnchorElement>) => this.onJump(idx)
    const t = (step as StepComponent).props.title

    return (
      <li className={classnames(curStep === idx ? Classes.ACTIVE : false)} key={idx}>
        {idx < curStep ? (
          <a href="#!" onClick={c}>
            {t}
          </a>
        ) : (
          <span>{t}</span>
        )}
      </li>
    )
  }

  renderForm = (formikProps: FormikProps<any>) => {
    const {
      cancelable,
      cancelText,
      canSubmit,
      nextText,
      previousText,
      submitText,
      submitClassName,
    } = this.props
    const disabled = this.props.isBusy
    const prevDisabled = this.state.step === 0
    const childCount = React.Children.count(this.props.children)
    const finalStep = childCount - 1 === this.state.step
    const steps = React.Children.toArray(this.props.children)
      .filter((step, i) => i === this.state.step)
      .map((s, i) => this.renderStep(s, i, formikProps))
    const paginationText = `Step ${this.state.step + 1} of ${childCount}`

    return (
      <Form>
        <div className={Classes.DIALOG_BODY}>{steps}</div>
        <footer className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            {this.multiStep ? (
              <AnchorButton
                className="previous"
                text={previousText}
                onClick={this.onPrev}
                disabled={disabled || prevDisabled}
              />
            ) : cancelable ? (
              <AnchorButton
                className="cancel"
                text={cancelText}
                onClick={this.onCancel}
                disabled={disabled}
              />
            ) : null}
            {this.multiStep && <span className="pagination-indicator">{paginationText}</span>}
            {finalStep ? (
              <Button
                type="submit"
                className={classes('submit', submitClassName)}
                intent={Intent.PRIMARY}
                disabled={disabled || !!canSubmit}
              >
                <Spinner className={Classes.SMALL} />
                <span>{submitText}</span>
              </Button>
            ) : (
              <AnchorButton
                className="next"
                intent={Intent.PRIMARY}
                onClick={this.onNext}
                disabled={disabled || !formikProps.isValid}
              >
                {nextText}
              </AnchorButton>
            )}
          </div>
        </footer>
      </Form>
    )
  }

  buildValidators = () => {
    this.validators = React.Children.map(this.props.children, step => {
      const { validator = () => ({}) } = (step as StepComponent).props
      return validator
    })
  }

  render() {
    const { cancelable, className, children, initialValues, inline, isNew, title } = this.props
    this.multiStep = React.Children.count(children) > 1

    return (
      <BPDialog
        isOpen={this.props.isOpen}
        inline={inline}
        onClose={this.onClose}
        title={title}
        className={classnames(
          'wizard',
          this.props.isBusy && 'busy',
          !this.multiStep && 'single',
          className,
          Classes.DARK
        )}
        canEscapeKeyClose={cancelable}
        isCloseButtonShown={cancelable}
        canOutsideClickClose={false}
      >
        {this.multiStep && (
          <nav className="dialog-step-navigation">
            <ol>{React.Children.map(children, this.renderStepTitle)}</ol>
          </nav>
        )}
        <Formik
          isInitialValid={!isNew}
          initialValues={initialValues}
          onSubmit={this.onSubmit}
          render={this.renderForm}
          validate={this.validators[this.state.step]}
        />
      </BPDialog>
    )
  }
}

export default FormDialog

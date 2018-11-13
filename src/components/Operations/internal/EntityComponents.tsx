import { AnchorButton, Classes, FormGroup, IconClasses, Intent, Spinner } from '@blueprintjs/core'
import classes from 'classnames'
import { ArrayHelpers, Field, FieldArray, FormikTouched } from 'formik'
import * as React from 'react'
import { Error } from 'src/components/Dialog/FormDialog'
import { GroupFormProps, NamespaceFormProps, ResourceFormProps, UserFormProps } from 'src/components/Operations/internal/types'
import { AvailableEntityResources } from 'src/store/constants'
import { Group } from 'src/store/group/group-model'
import { User } from 'src/store/user/user-model'
import { bytesToHumanSize, formatInteger } from 'src/util/formating'

interface ResourceProps {
  title: string
  field: 'cpu' | 'memory' | 'storage'
  unit: 'MB' | 'Cores'
  available: number
  total: number
}

interface NamespaceDetailProps extends NamespaceFormProps {
  disabled: boolean
  group?: string
  groups: Group[]
  onGroupChanged: (id: string) => void
}

const inputClass = `${Classes.INPUT} ${Classes.FILL}`

const renderClusters = (clusters: string[], arrayProps: ArrayHelpers, values: any) => {
  const onChange = (cluster: string) => {
    return (e: React.SyntheticEvent<HTMLInputElement>) => {
      if ((e.target as HTMLInputElement).checked) {
        arrayProps.push(cluster)
      } else {
        arrayProps.remove(values.clusters.indexOf(cluster))
      }
    }
  }

  return clusters.map((c, i) => (
    <li key={i}>
      <label className={classes(Classes.CONTROL, Classes.CHECKBOX)}>
        <input type="checkbox" onChange={onChange(c)} checked={values.clusters.includes(c)} />
        <span className={classes(Classes.CONTROL_INDICATOR)} />
        {c}
      </label>
    </li>
  ))
}

export const ClusterConfig = (props: { group?: Group } & NamespaceFormProps) => {
  const { group, values, setFieldValue } = props

  if (!group) return null

  const allSelected = values && values.clusters && values.clusters.length === group.clusters.length

  // tslint:disable:jsx-no-lambda
  return (
    <section className="namespace-clusters">
      <div className="step-description">
        <p>
          Please assign one or more clusters where<br />this namespace should be replicated.
        </p>
        <AnchorButton
          iconName={IconClasses.REMOVE}
          onClick={() => setFieldValue('clusters', allSelected ? [] : group.clusters)}
          text={`${allSelected ? 'Deselect' : 'Select'} all clusters`}
        />
      </div>
      <ul>
        <FieldArray name="clusters" render={p => renderClusters(group.clusters, p, values)} />
      </ul>
    </section>
  )
}

export class NamespaceDetail extends React.Component<NamespaceDetailProps> {
  componentWillReceiveProps(nextProps: NamespaceDetailProps) {
    const { group } = nextProps
    if (group) this.props.onGroupChanged(group)
  }

  render() {
    const { disabled, errors, groups, touched } = this.props

    return (
      <section className="namespace-details">
        <FormGroup label="Namespace name">
          <Field
            className={classes(
              inputClass,
              touched.name && errors.name && Classes.intentClass(Intent.DANGER)
            )}
            disabled={disabled}
            type="text"
            name="name"
            placeholder="Enter a name for your new namespace"
          />
          <Error touched={touched as FormikTouched<any>} errors={errors} field="name" />
        </FormGroup>
        <FormGroup className="namespace-permissions" label="Group access">
          <ul>
            <li className={classes(Classes.FORM_GROUP, Classes.INLINE, 'labeled-input')}>
              <div
                className={classes(
                  Classes.SELECT,
                  Classes.FILL,
                  touched.group && errors.group && Classes.intentClass(Intent.DANGER)
                )}
              >
                <Field component="select" name="group" disabled={disabled}>
                  <option value="">Please select an owner</option>
                  {groups.map((g, i) => (
                    <option key={i} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </Field>
              </div>
              <label className={classes(Classes.LABEL, 'st-button-label')}>Owner</label>
            </li>
          </ul>
          <Error touched={touched as FormikTouched<any>} errors={errors} field="group" />
        </FormGroup>
      </section>
    )
  }
}

export const GroupDetail = ({
  disabled,
  errors,
  touched,
}: GroupFormProps & { disabled: boolean }) => (
  <section className="group-details">
    <FormGroup label="Group name">
      <Field
        className={classes(
          inputClass,
          touched.name && errors.name && Classes.intentClass(Intent.DANGER)
        )}
        disabled={disabled}
        type="text"
        name="name"
        placeholder="Enter a name for your new namespace"
      />
      <Error touched={touched as FormikTouched<any>} errors={errors} field="name" />
    </FormGroup>
  </section>
)

const Resource = (props: ResourceProps & ResourceFormProps) => {
  const { field, title, unit, available, total, errors, touched, values } = props
  const label = `${title} quota (optional)`
  const availableText =
    unit === 'MB' ? bytesToHumanSize(available).formatted : formatInteger(available)
  const totalText =
    unit === 'MB' ? bytesToHumanSize(total).formatted : `${formatInteger(total)} ${unit}`
  const val = values[field]

  return (
    <div className="entity-resource">
      <FormGroup label={label}>
        <div className={classes(Classes.FORM_GROUP, Classes.INLINE, 'labeled-input')}>
          <Field
            type="number"
            name={field}
            className={classes(
              inputClass,
              touched[field] && errors[field] && Classes.intentClass(Intent.DANGER)
            )}
            placeholder={title}
            value={val && !Number.isNaN(val) ? val : ''}
          />
          <label className={classes(Classes.LABEL, 'st-button-label')}>{unit}</label>
        </div>
        {touched[field] && errors[field] && <span className="error">{errors[field]}</span>}
      </FormGroup>
      <figure>
        <div className="availability">
          <label>{`Available ${title}`}</label>
          <em>{availableText}</em>
          {` / ${totalText}`}
        </div>
        <Spinner className="stat-usage-chart" value={available / total} intent={Intent.SUCCESS} />
      </figure>
    </div>
  )
}

export const NamespaceResources = (props: { resources?: AvailableEntityResources } & any) => {
  if (!props.resources) return null

  const { resources: { limits, used } } = props

  return (
    <section className="entity-resources">
      <Resource
        {...props}
        title="CPU"
        field="cpu"
        unit="Cores"
        available={limits.cpu - used.cpu}
        total={limits.cpu}
      />
      <Resource
        {...props}
        title="Memory"
        field="memory"
        unit="MB"
        available={limits.memory - used.memory}
        total={limits.memory}
      />
      <Resource
        {...props}
        title="Storage"
        field="storage"
        unit="MB"
        available={limits.storage - used.storage}
        total={limits.storage}
      />
    </section>
  )
}

const PasswordFields = (props: UserFormProps & { label?: string; confirmation?: string }) => {
  const { errors, touched } = props
  return (
    <div>
      <FormGroup label={props.label || 'Password'}>
        <Field
          type="password"
          name="password"
          className={inputClass}
          placeholder="Enter a password"
        />
        <Error touched={touched as FormikTouched<any>} errors={errors} field="password" />
      </FormGroup>
      <FormGroup label={props.confirmation || 'Confirm Password'}>
        <Field
          type="password"
          name="passwordConfirmation"
          className={inputClass}
          placeholder="Confirm the password"
        />
        <Error touched={touched as FormikTouched<any>} errors={errors} field="passwordConfirmation" />
      </FormGroup>
    </div>
  )
}

export const UserDetail = (props: { user?: User } & UserFormProps) => {
  const { errors, touched } = props
  return (
    <section className="user-details">
      <FormGroup label="Name">
        <Field type="text" name="name" className={inputClass} placeholder="Enter a name" />
        <Error touched={touched as FormikTouched<any>} errors={errors} field="name" />
      </FormGroup>
      <FormGroup label="Username">
        <Field type="text" name="username" className={inputClass} placeholder="Enter a username" />
        <Error touched={touched as FormikTouched<any>} errors={errors} field="username" />
      </FormGroup>
      <FormGroup label="Email">
        <Field
          type="email"
          name="email"
          className={inputClass}
          placeholder="Enter an email address"
        />
        <Error touched={touched as FormikTouched<any>} errors={errors} field="email" />
      </FormGroup>
      {!props.user && <PasswordFields {...props} />}
    </section>
  )
}

export const PasswordDetail = (props: { user?: User } & UserFormProps) => {
  return (
    <section className="password-details">
      {<PasswordFields label="New Password" confirmation="Confirm New Password" {...props} />}
    </section>
  )
}

import uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import FormDialog, { Step } from 'src/components/Dialog/FormDialog'
import { EntityParams } from 'src/routes'
import { triggerRequestGroupList } from 'src/store/group/group-actions'
import { Group } from 'src/store/group/group-model'
import { getGroupList, getGroupListIsLoading } from 'src/store/group/group-reducers'
import {
  triggerCreateNamespace,
  triggerUpdateNamespace,
} from 'src/store/namespace/namespace-actions'
import { Namespace } from 'src/store/namespace/namespace-model'
import {
  getNamespaceCreateState,
  getNamespaceUpdateState,
  makeGetNamespace,
} from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'
import { bytesToMB, mbToBytes } from 'src/util/formating'
import makeCrudOperation, { CrudFormProps } from './internal/CrudOperation'
import { ClusterConfig, NamespaceDetail, NamespaceResources } from './internal/EntityComponents'
import { NamespaceFormProps, NamespaceParams } from './internal/types'
import { namespaceDetailValidator, resourcesValidator } from './internal/validators'

type OwnProps = CrudFormProps & RouteComponentProps<EntityParams>

interface Actions {
  triggerRequestGroupList: typeof triggerRequestGroupList
}

interface ConnectedProps extends Actions {
  groups: Group[]
  isLoading: boolean
  namespace: Namespace
}

type NamespaceModifyProps = OwnProps & ConnectedProps

interface NamespaceModifyState {
  groupId?: string
  group?: Group
}

interface FormValues {
  name: string
  group: string
  clusters: string[]
  cpu: number
  memory: number
  storage: number
}

class NamespaceModify extends React.Component<NamespaceModifyProps, NamespaceModifyState> {
  static defaultProps = { groups: [] }

  state: NamespaceModifyState = {}

  defaultValues: FormValues = {
    name: '',
    group: '',
    clusters: [],
    cpu: 0,
    memory: 0,
    storage: 0,
  }

  initialValues: FormValues = { ...this.defaultValues }

  componentWillMount() {
    this.setInitialValues()

    if (this.props.namespace) {
      this.onGroupChanged(this.props.namespace.group)
    }
  }

  componentWillReceiveProps(nextProps: NamespaceModifyProps) {
    const { isLoading, groups } = this.props

    if (nextProps.isOpen && !isLoading && groups.length === 0) {
      this.props.triggerRequestGroupList()
    } else if (nextProps.groups.length && this.props.groups.length === 0 && this.props.namespace) {
      this.onGroupChanged(this.props.namespace.group)
    }
  }

  onSubmit = (values: NamespaceParams) => {
    this.props.onSubmit(
      uniqueId(`namespace${this.props.id ? 'Update' : 'Create'}`),
      this.toParams(values)
    )
  }

  toParams = (values: NamespaceParams) => {
    const { id } = this.props

    return {
      ...id ? { id } : { name: values.name, group: values.group },
      clusters: values.clusters,
      authorizations: {
        [values.group]: ['produce', 'consume'],
      },
      resourceLimits: {
        cpu: values.cpu,
        memory: values.memory && mbToBytes(values.memory),
        storage: values.storage && mbToBytes(values.storage),
      },
    }
  }

  onGroupChanged = (groupId: string) => {
    if (groupId !== this.state.groupId || (groupId !== '' && !this.state.group)) {
      const group = this.props.groups.find(g => g.id === groupId)
      this.setState({ groupId, group })
    }
  }

  setInitialValues = () => {
    const { namespace: ns, parentId = '' } = this.props
    this.initialValues = {
      ...this.defaultValues,
      ...ns
        ? {
            name: ns.name,
            group: ns.group,
            clusters: ns.clusters,
            cpu: ns.resources.used.cpu,
            memory: bytesToMB(ns.resources.used.memory),
            storage: bytesToMB(ns.resources.used.storage),
          }
        : { group: parentId },
    }
  }

  render() {
    const { id, isBusy, onClose } = this.props
    const { group, groupId } = this.state
    const title = `${id ? 'Modify' : 'Create'} Namespace`

    // tslint:disable:jsx-no-lambda
    return (
      <FormDialog
        className="namespace-modify"
        title={title}
        initialValues={this.initialValues}
        isOpen={this.props.isOpen}
        isBusy={isBusy}
        isNew={!id}
        onCancel={onClose}
        onSubmit={this.onSubmit}
        submitText={`${id ? 'Update' : 'Create'} and finish`}
      >
        <Step
          title="Details"
          validator={namespaceDetailValidator}
          content={(props: NamespaceFormProps) => (
            <NamespaceDetail
              {...props}
              disabled={!!id}
              groups={this.props.groups}
              group={groupId}
              onGroupChanged={this.onGroupChanged}
            />
          )}
        />
        <Step
          title="Clusters"
          content={(props: NamespaceFormProps) => <ClusterConfig {...props} group={group} />}
        />
        <Step
          title="Resources"
          validator={values => resourcesValidator(this.state.group && this.state.group.resources.limits, values)}
          content={(props: NamespaceFormProps) => (
            <NamespaceResources {...props} resources={group && group.resources} />
          )}
        />
      </FormDialog>
    )
  }
}

const connected = withRouter(
  connect(
    (state: State, { id }: OwnProps) => {
      return {
        namespace: id ? makeGetNamespace()(state, { id }) : undefined,
        groups: getGroupList(state),
        isLoading: getGroupListIsLoading(state),
      }
    },
    { triggerRequestGroupList }
  )(NamespaceModify)
)

export const NamespaceCreate = makeCrudOperation(
  connected,
  triggerCreateNamespace,
  (state: State) => getNamespaceCreateState(state)
)

export const NamespaceUpdate = makeCrudOperation(
  connected,
  triggerUpdateNamespace,
  (state: State, id?: string) => getNamespaceUpdateState(state, { id: id! })
)

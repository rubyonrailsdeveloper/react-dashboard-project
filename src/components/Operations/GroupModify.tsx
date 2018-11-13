import uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import * as api from 'src/api/groups'
import FormDialog, { Step } from 'src/components/Dialog/FormDialog'
import { EntityParams } from 'src/routes'
import { AvailableEntityResources } from 'src/store/constants'
import { triggerCreateGroup, triggerUpdateGroup } from 'src/store/group/group-actions'
import { Group } from 'src/store/group/group-model'
import {
  getGroupCreateState,
  getGroupIsLoading,
  getGroupUpdateState,
  makeGetGroup,
} from 'src/store/group/group-reducers'
import { State } from 'src/store/root-reducer'
import { bytesToMB, mbToBytes } from 'src/util/formating'
import makeCrudOperation, { CrudFormProps } from './internal/CrudOperation'
import { GroupDetail, NamespaceResources } from './internal/EntityComponents'
import { GroupFormProps, GroupParams } from './internal/types'
import { groupDetailValidator, resourcesValidator } from './internal/validators'

type OwnProps = CrudFormProps & RouteComponentProps<EntityParams>

interface ConnectedProps {
  group: Group
  isLoading: boolean
}

interface GroupModifyState {
  resources?: AvailableEntityResources
  isQuotasLoading: boolean
}

type GroupModifyProps = OwnProps & ConnectedProps

class GroupModify extends React.Component<GroupModifyProps, GroupModifyState> {
  state: GroupModifyState = { isQuotasLoading: false }
  initialValues: any = {}

  defaultValues = {
    name: '',
    cpu: 0,
    memory: 0,
    storage: 0,
  }

  componentWillMount() {
    this.setInitialValues()
  }

  componentWillReceiveProps(nextProps: GroupModifyProps) {
    const { isQuotasLoading } = this.state

    if (!this.props.id && nextProps.isOpen && !isQuotasLoading && !this.state.resources) {
      this.setResources()
    }
  }

  setResources = () => {
    this.setState({ isQuotasLoading: true })

    api.quotas().then(resources =>
      this.setState({
        isQuotasLoading: false,
        resources: { limits: resources.available, used: { cpu: 0, memory: 0, storage: 0 } },
      })
    )
  }

  onSubmit = (values: GroupParams) => {
    this.props.onSubmit(
      uniqueId(`group${this.props.id ? 'Update' : 'Create'}`),
      this.toParams(values)
    )
  }

  toParams = (values: GroupParams) => {
    const { id } = this.props

    return {
      ...id ? { id } : { name: values.name },
      roles: ['all'],
      resourceLimits: {
        cpu: values.cpu,
        memory: values.memory && mbToBytes(values.memory),
        storage: values.storage && mbToBytes(values.storage),
      },
    }
  }

  setInitialValues = () => {
    const { group } = this.props

    if (group) {
      this.setState({ resources: group.resources })
    }

    this.initialValues = {
      ...this.defaultValues,
      ...group
        ? {
            name: group.name,
            cpu: group.resources.used.cpu,
            memory: bytesToMB(group.resources.used.memory),
            storage: bytesToMB(group.resources.used.storage),
          }
        : null,
    }
  }

  render() {
    const { resources } = this.state
    const { id, onClose, isBusy, group } = this.props
    const title = `${this.props.id ? 'Modify' : 'Create'} Group`
    // Limits either come from the group or a specialized endpoint
    const limits = group ? group.resources.limits : resources ? resources.limits : undefined

    // tslint:disable:jsx-no-lambda
    return (
      <FormDialog
        className="group-modify"
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
          validator={groupDetailValidator}
          content={(props: GroupFormProps) => <GroupDetail {...props} disabled={!!id} />}
        />
        <Step
          title="Resources"
          validator={values => resourcesValidator(limits, values)}
          content={(props: GroupFormProps) => (
            <NamespaceResources {...props} resources={this.state.resources} />
          )}
        />
      </FormDialog>
    )
  }
}

const connected = withRouter(
  connect((state: State, { id }: OwnProps) => {
    return {
      group: id ? makeGetGroup()(state, { id }) : undefined,
      isLoading: id ? getGroupIsLoading(state, { id }) : undefined,
    }
  }, {})(GroupModify)
)

export const GroupCreate = makeCrudOperation(connected, triggerCreateGroup, (state: State) =>
  getGroupCreateState(state)
)

export const GroupUpdate = makeCrudOperation(
  connected,
  triggerUpdateGroup,
  (state: State, id?: string) => getGroupUpdateState(state, { id: id! })
)

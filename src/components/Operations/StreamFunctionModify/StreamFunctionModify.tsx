import uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import FormDialog, { Step } from 'src/components/Dialog/FormDialog'
import { StreamFunctionDef } from 'src/components/Operations/StreamFunctionModify/StreamFunctionDef'
import { StreamFunctionName } from 'src/components/Operations/StreamFunctionModify/StreamFunctionName'

import makeCrudOperation, { CrudFormProps } from 'src/components/Operations/internal/CrudOperation'
import { StreamFunctionFormProps, StreamFunctionParams } from 'src/components/Operations/internal/types'
import { streamFunctionNameValidator } from 'src/components/Operations/internal/validators'

import { EntityParams } from 'src/routes'
import { triggerRequestGroupList } from 'src/store/group/group-actions'
import { Group } from 'src/store/group/group-model'
import { getGroupList, getGroupListIsLoading } from 'src/store/group/group-reducers'
import { triggerRequestNamespaceList } from 'src/store/namespace/namespace-actions'
import { Namespace } from 'src/store/namespace/namespace-model'
import { getNamespaceList } from 'src/store/namespace/namespace-reducers'
import { State } from 'src/store/root-reducer'
import { triggerCreateStreamFunction, triggerUpdateStreamFunction } from 'src/store/streamfunction/streamfunction-actions'
import { StreamFunction } from 'src/store/streamfunction/streamfunction-model'
import { getStreamFunctionCreateState, getStreamFunctionUpdateState, makeGetStreamFunction } from 'src/store/streamfunction/streamfunction-reducers'
import { triggerRequestTopicList } from 'src/store/topic/topic-actions'
import { Topic } from 'src/store/topic/topic-model'
import { getTopicList } from 'src/store/topic/topic-reducers'

type OwnProps = CrudFormProps & RouteComponentProps<EntityParams>

interface Actions {
  triggerRequestGroupList: typeof triggerRequestGroupList
  triggerRequestNamespaceList: typeof triggerRequestNamespaceList
  triggerRequestTopicList: typeof triggerRequestTopicList
}

interface ConnectedProps extends Actions {
  groups: Group[]
  namespaces: Namespace[]
  topics: Topic[]
  isLoading: boolean
  streamFunction: StreamFunction
}

type StreamFunctionModifyProps = OwnProps & ConnectedProps

interface StreamFunctionModifyState {
  groupId?: string
  group?: Group
  namespaceId?: string
  namespace?: Namespace
  topicInId?: string
  topicOutId?: string
  topicIn?: Topic
  topicOut?: Topic
}

interface FormValues {
  name: string
  group: string
  namespace: string
  topicIn: string
  topicOut: string
}

class StreamFunctionModify extends React.Component<StreamFunctionModifyProps, StreamFunctionModifyState> {
  state: StreamFunctionModifyState = { }
  initialValues: any = {}

  defaultValues: FormValues = {
    name: '',
    group: '',
    namespace: '',
    topicIn: '',
    topicOut: ''
  }

  componentWillMount() {
    this.setInitialValues()
    if (this.props.streamFunction) {
      this.onGroupChanged(this.props.streamFunction.group)
      this.onNamespaceChanged(this.props.streamFunction.namespace)
    }
  }

  componentWillReceiveProps(nextProps: StreamFunctionModifyProps) {
    // console.log('componentWillReceiveProps, nextProps: %o', nextProps)
    const { isLoading, groups, namespaces, topics } = this.props

    if (nextProps.isOpen && !isLoading && groups.length === 0) {
      this.props.triggerRequestGroupList()
    } else if (nextProps.groups.length && this.props.groups.length === 0 && this.props.streamFunction) {
      this.onGroupChanged(this.props.streamFunction.group)
    }

    if (nextProps.isOpen && !isLoading && namespaces.length === 0) {
      this.props.triggerRequestNamespaceList()
    } else if (nextProps.namespaces.length && this.props.namespaces.length === 0 && this.props.streamFunction) {
      this.onNamespaceChanged(this.props.streamFunction.namespace)
    }

    if (nextProps.isOpen && !isLoading && topics.length === 0) {
      this.props.triggerRequestTopicList()
    }
  }

  onSubmit = (values: StreamFunctionParams) => {
    this.props.onSubmit(
      uniqueId(`streamFunction${this.props.id ? 'Update' : 'Create'}`),
      this.toParams(values)
    )
  }

  toParams = (values: StreamFunctionParams) => {
    const { id } = this.props
    return {
      ...id ? { id } : { name: values.name, group: values.group }
    }
  }

  onGroupChanged = (groupId: string) => {
    if (groupId !== this.state.groupId || (groupId !== '' && !this.state.group)) {
      const group = this.props.groups.find(g => g.id === groupId)
      this.setState({ groupId, group })
    }
  }

  onNamespaceChanged = (namespaceId: string) => {
    if (namespaceId !== this.state.namespaceId || (namespaceId !== '' && !this.state.namespace)) {
      const namespace = this.props.namespaces.find(n => n.id === namespaceId)
      this.setState({ namespaceId, namespace })
    }
  }

  onTopicInChanged = (topicInId: string) => {
    if (topicInId !== this.state.topicInId || (topicInId !== '' && !this.state.topicIn)) {
      const topicIn = this.props.topics.find(t => t.id === topicInId)
      this.setState({ topicInId, topicIn })
    }
  }

  onTopicOutChanged = (topicOutId: string) => {
    if (topicOutId !== this.state.topicOutId || (topicOutId !== '' && !this.state.topicOut)) {
      const topicOut = this.props.topics.find(t => t.id === topicOutId)
      this.setState({ topicOutId, topicOut })
    }
  }

  setInitialValues = () => {
    const { streamFunction: sf, parentId = '' } = this.props
    this.initialValues = {
      ...this.defaultValues,
      ...sf
        ? {
            name: sf.name,
            group: sf.group,
            namespace: sf.namespace,
            topicIn: sf.topicIn,
            topicOut: sf.topicOut
          }
        : { group: parentId, namespace: parentId, topicIn: parentId, topicOut: parentId },
    }
  }

  render() {
    // console.log('StreamFunctionModify.render()')
    const { id, isBusy, onClose } = this.props
    // const { group, namespace } = this.state
    // console.log('from state, group: %o', group)
    const title = `${id ? 'Modify' : 'Create'} Function`

    // tslint:disable:jsx-no-lambda
    return (
      <FormDialog
        className="streamFunctionModify"
        title={title}
        initialValues={this.initialValues}
        isOpen={this.props.isOpen}
        isBusy={isBusy}
        isNew={!id}
        onCancel={onClose}
        onSubmit={this.onSubmit}
        submitText={`${id ? 'Update' : 'Create'} and finish`}>
        <Step
          title="Name"
          validator={streamFunctionNameValidator}
          content={(props: StreamFunctionFormProps) => {
            return (
              <StreamFunctionName
                {...props}
                disabled={!!id}
                groups={this.props.groups}
                onGroupChanged={this.onGroupChanged}
                namespaces={this.props.namespaces}
                onNamespaceChanged={this.onNamespaceChanged} />
            )
          }} />
        <Step
          title="Function"
          content={(props: StreamFunctionFormProps) => (
            <StreamFunctionDef
                {...props}
                // group={group}
                // namespace={namespace}
                topics={this.props.topics}
                onTopicInChanged={this.onTopicInChanged}
                onTopicOutChanged={this.onTopicOutChanged} />
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
        streamFunction: id ? makeGetStreamFunction()(state, { id }) : undefined,
        groups: getGroupList(state),
        isLoading: getGroupListIsLoading(state),
        namespaces: getNamespaceList(state),
        topics: getTopicList(state)
      }
    },
    { triggerRequestGroupList, triggerRequestNamespaceList, triggerRequestTopicList }
  )(StreamFunctionModify)
)

export const StreamFunctionCreate = makeCrudOperation(
  connected,
  triggerCreateStreamFunction,
  (state: State) => getStreamFunctionCreateState(state)
)

export const StreamFunctionUpdate = makeCrudOperation(
  connected,
  triggerUpdateStreamFunction,
  (state: State, id?: string) => getStreamFunctionUpdateState(state, { id: id! })
)

import { Button, Classes, Intent, Label, Menu, MenuItem, Popover, Position } from '@blueprintjs/core'
import classes from 'classnames'
import { Field, FormikTouched } from 'formik'
import * as React from 'react'
import { Error } from 'src/components/Dialog/FormDialog'
import { StreamFunctionFormProps } from 'src/components/Operations/internal/types'
import { CommonGroup, Group } from 'src/store/group/group-model'
import { CommonNamespace, Namespace } from 'src/store/namespace/namespace-model'

interface StreamFunctionNameProps extends StreamFunctionFormProps {
  disabled: boolean
  group?: string
  groups: Group[]
  onGroupChanged: (id: string) => void
  namespace?: string
  namespaces: Namespace[]
  onNamespaceChanged: (id: string) => void
}

const inputClass = `${Classes.INPUT} ${Classes.FILL} st-input-minimal`

export class StreamFunctionName extends React.Component<StreamFunctionNameProps> {
  componentWillReceiveProps(nextProps: StreamFunctionNameProps) {
    const { group, namespace } = nextProps
    if (group) this.props.onGroupChanged(group)
    if (namespace) this.props.onNamespaceChanged(namespace)
  }

  onSelectGroup = (group: CommonGroup) => {
    this.props.onGroupChanged(group.id) // TODO: [ofer: 22-Feb-2018] what does it do?
    this.props.setFieldValue('group', group.name) // TODO: [ofer: 22-Feb-2018] this seems like it should be done differently
  }

  onSelectNamespace = (namespace: CommonNamespace) => {
    this.props.onNamespaceChanged(namespace.id) // TODO: [ofer: 22-Feb-2018] what does it do?
    this.props.setFieldValue('namespace', namespace.name) // TODO: [ofer: 22-Feb-2018] this seems like it should be done differently
  }

  render() {
    const { errors, groups, namespaces, touched } = this.props
    // console.log('StreamFunctionName.render(), errors: %o', errors)
    // console.log('StreamFunctionName.render, this.props: %o', this.props)
    const groupsMenu = (
      <Menu className="pt-minimal">
      {groups.map((g, i) => (
        <MenuItem key={i} text={g.name} onClick={this.onSelectGroup.bind(this, g)} />
      ))}
      </Menu>
    )
    const namespacesMenu = (
      <Menu className="pt-minimal">
      {namespaces.map((n, i) => (
        <MenuItem key={i} text={n.name} onClick={this.onSelectNamespace.bind(this, n)} />
      ))}
      </Menu>
    )
    return (
      <section className="streamFunctionModify-name">
        <div className="streamFunctionModify-name-group">
          <Label text="Team" required={true} />
          <Popover content={groupsMenu} position={Position.BOTTOM} popoverClassName="pt-minimal">
            <div className="pt-input-group">
              <input type="text" className="pt-input st-input-minimal" name="group"
                placeholder="Select team" autoComplete="off"
                value={this.props.values.group} />
              <Button className="pt-button pt-minimal pt-intent-primary" iconName="chevron-down" />
            </div>
          </Popover>
        </div>
        <div className="name-divider">/</div>
        <div className="streamFunctionModify-name-namespace">
          <Label text="Namespace" required={true} />
          <Popover content={namespacesMenu} position={Position.BOTTOM} popoverClassName="pt-minimal">
            <div className="pt-input-group">
              <input type="text" className="pt-input st-input-minimal" name="namespace"
                placeholder="Select namespace" autoComplete="off"
                value={this.props.values.namespace} />
              <Button className="pt-button pt-minimal pt-intent-primary" iconName="chevron-down" />
            </div>
          </Popover>
        </div>
        <div className="name-divider">/</div>
        <div className="streamFunctionModify-name-function">
          <Label text="Function name" />
          <Field type="text" name="name" placeholder="Enter name" autoComplete="off" value={this.props.values.name}
            className={classes(inputClass,
              touched.name && errors.name && Classes.intentClass(Intent.DANGER)
            )} />
          <Error touched={touched as FormikTouched<any>} errors={errors} field="name" />
        </div>
      </section>
    )
  }
}

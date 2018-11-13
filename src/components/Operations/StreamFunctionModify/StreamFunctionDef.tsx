import { Label } from '@blueprintjs/core'
import * as React from 'react'
import {Controlled as CodeMirror} from 'react-codemirror2'
import Breadcrumbs from 'src/components/Breadcrumbs/Breadcrumbs'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import { StreamFunctionFormProps } from 'src/components/Operations/internal/types'
import { Topic } from 'src/store/topic/topic-model'

import Select from 'react-select'

// import StSelect from 'src/components/stSelect/stSelect'

import 'codemirror/mode/javascript/javascript'

interface StreamFunctionDefProps extends StreamFunctionFormProps {
  topics: Topic[]
  onTopicInChanged: (id: string) => void
  onTopicOutChanged: (id: string) => void
}

interface StreamFunctionDefState {
  functionStr: string
  topicsOut: string[]
  topicsIn: string[]
}

interface SelectOption {
  label: string
  value: string
}

const initialFuncStr = `
import java.util.function.Function;

public class JavaNativeFunction implements Function<String input1, String output1> {
  @Override
  public String apply(String input1) {

  }
}
`
const codeMirrorOptions = {
  mode: 'javascript',
  theme: 'railscasts',
  lineNumbers: true
}

export class StreamFunctionDef extends React.Component<StreamFunctionDefProps, StreamFunctionDefState> {
  state: StreamFunctionDefState = {
    functionStr: initialFuncStr,
    topicsOut: [],
    topicsIn: []
  }

  onSelectTopicIn = (topicId: any) => {
    // console.log('onSelectTopicIn, topic: %o', topicId)
    this.setState({topicsIn: topicId.map((n: SelectOption) => n.value)})
  }

  onSelectTopicOut = (topicId: any) => {
    this.setState({topicsOut: topicId.map((n: SelectOption) => n.value)})
  }

  onBeforeEditorChange = (editor: any, data: any, value: string) => {
    this.setState({functionStr: value});
  }

  render() {
    const { topics } = this.props
    const options: SelectOption[] = topics.map(t => ({label: t.id, value: t.id}))
    return (
      <section className="streamFunctionModify-def">
        <div className="">
          <Breadcrumbs>
            <li>
              <div className="breadcrumb-item">
                <div className="breadcrumb-text">{this.props.values.group}</div>
              </div>
            </li>
            <li>
              <div className="breadcrumb-item">
                <div className="breadcrumb-text">{this.props.values.namespace}</div>
              </div>
            </li>
            <BreadcrumbsPageItem name={this.props.values.name} />
          </Breadcrumbs>
        </div>
        <div className="streamFunctionModify-editor">
          <CodeMirror value={this.state.functionStr}
            options={codeMirrorOptions}
            onBeforeChange={this.onBeforeEditorChange} />
        </div>
        <div className="streamFunctionModify-topicPickers">
          <div className="streamFunctionModify-topicPicker">
            <Label text="Specify input topic" />
            <Select
              className="pt-minimal"
              closeOnSelect={false}
              multi
              onChange={this.onSelectTopicIn}
					    options={options}
					    placeholder="Select topic"
              removeSelected={true}
					    simpleValue={false}
              value={this.state.topicsIn}
              clearable={true}
              searchable={true} />
          </div>
          <div className="streamFunctionModify-topicPicker">
            <Label text="Specify output topic" />
            <Select
              className="pt-minimal"
              closeOnSelect={true}
              multi
              onChange={this.onSelectTopicOut}
					    options={options}
					    placeholder="Select topic"
              removeSelected={true}
					    simpleValue={false}
              value={this.state.topicsOut}
              clearable={true}
              searchable={true} />
          </div>
        </div>
      </section>
    )
  }
}

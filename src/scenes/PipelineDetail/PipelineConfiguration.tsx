import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { EntityParams } from 'src/routes'

type PipelineConfigurationProps = RouteComponentProps<EntityParams>

export default class PipelineConfiguration extends React.Component<PipelineConfigurationProps> {
  render() {
    return <div className="pipeline-configuration">Pipeline configuration</div>
  }
}

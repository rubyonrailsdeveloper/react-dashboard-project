import { Button, Tab2, Tabs2 } from '@blueprintjs/core'
import * as React from 'react'
import Schema from 'src/components/Schema/Schema'

interface SchemaContainerProps {
  topicId?: string
}

class SchemaContainer extends React.Component<SchemaContainerProps> {
  render() {
    return (
      <div className="st-schema-container">
        <Tabs2 id="schemaTabs">
          <Tab2 id="schema" title="Schema" panel={<Schema />} />
          <Tab2 id="message" title="Sample message" disabled={true} />
          <Tabs2.Expander />
          <div className="st-schema-actions">
            <Button iconName="edit" disabled={true} />
            <Button iconName="history" disabled={true} />
          </div>
        </Tabs2>
      </div>
    )
  }
}
export default SchemaContainer

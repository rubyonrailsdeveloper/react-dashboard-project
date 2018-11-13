import { Classes, Dialog, IconClasses } from '@blueprintjs/core'
import * as React from 'react'
import SchemaContainer from 'src/components/Schema/SchemaContainer'

interface SchemaDialogProps {
  topicId?: string
  topicName: string
  isOpen: boolean
  onClose: any
}

class SchemaDialog extends React.Component<SchemaDialogProps> {
  render() {
    const { topicName, isOpen, onClose } = this.props
    return (
      <Dialog
        className="st-schema-dialog"
        iconName={IconClasses.TH}
        title={`Schema for ${topicName}`}
        isOpen={isOpen}
        onClose={onClose}>
        <div className={Classes.DIALOG_BODY}>
          <SchemaContainer />
        </div>
      </Dialog>
    )
  }
}
export default SchemaDialog

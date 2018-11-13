import { IconClasses, MenuItem } from '@blueprintjs/core'
import * as React from 'react'
import OperationCell from 'src/components/Tables/OperationCell'

interface InstanceOperationsCellProps {
  id: string
}

// Not used for now (missing API implementation)
export default class InstanceOperationsCell extends React.Component<InstanceOperationsCellProps> {
  // todo: assign restart operation once its created
  restart = () => {
    //
  }

  render() {
    return (
      <OperationCell>
        {() => (
          <div>
            <MenuItem iconName={IconClasses.REFRESH} onClick={this.restart} text="Restart" />
            {/*<MenuItem iconName={IconClasses.CODE} onClick={this.openShell} text="Go into shell" />*/}
          </div>
        )}
      </OperationCell>
    )
  }
}

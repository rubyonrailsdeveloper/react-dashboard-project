import { IconClasses, Intent, MenuDivider, MenuItem } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { TerminatePipeline } from 'src/components/Operations/operations'
import statusOperationMenuItem from 'src/components/Pipeline/statusOperationMenuItem'
import OperationCell from 'src/components/Tables/OperationCell'
import { Pipeline } from 'src/store/pipeline/pipeline-model'
import { makeGetPipeline } from 'src/store/pipeline/pipeline-reducers'
import { State } from 'src/store/root-reducer'

interface OwnProps {
  id: string
}

interface ConnectProps {
  pipeline: Pipeline
}

type PipelineOperationCellProps = OwnProps & ConnectProps

class PipelineOperationCell extends React.Component<PipelineOperationCellProps> {
  handleMenuItemClick = (open: () => void, onClick: () => void) => {
    return () => {
      open()
      onClick()
    }
  }

  render() {
    const { id, pipeline } = this.props

    return (
      <OperationCell>
        {({ close, open, shouldDismissPopover }) => (
          <div>
            {statusOperationMenuItem(
              pipeline,
              close,
              open,
              this.handleMenuItemClick,
              shouldDismissPopover
            )}
            <MenuDivider />
            <TerminatePipeline id={id} onClose={close}>
              {({ onClick }) => (
                <MenuItem
                  iconName={IconClasses.TRASH}
                  intent={Intent.DANGER}
                  text="Terminate"
                  onClick={this.handleMenuItemClick(open, onClick)}
                  shouldDismissPopover={shouldDismissPopover}
                />
              )}
            </TerminatePipeline>
          </div>
        )}
      </OperationCell>
    )
  }
}

export default connect(() => {
  const getPipeline = makeGetPipeline()

  return (state: State, ownProps: OwnProps) => ({
    pipeline: getPipeline(state, ownProps),
  })
})(PipelineOperationCell)

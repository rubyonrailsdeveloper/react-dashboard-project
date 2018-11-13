import { MenuItem } from '@blueprintjs/core'
import * as React from 'react'
import { ActivatePipeline, DeactivatePipeline } from 'src/components/Operations/operations'
import { pipelineStatusIcon } from 'src/constants'
import { Pipeline, PipelineStatus } from 'src/store/pipeline/pipeline-model'
import { assertUnreachable } from 'src/util/misc'

const statusOperationMenuItem = (
  { id, status }: Pipeline,
  close: () => void,
  open: () => void,
  handleMenuItemClick: (open: () => void, onClick: () => void) => () => void,
  shouldDismissPopover: boolean
) => {
  switch (status) {
    case PipelineStatus.RUNNING:
      return (
        <DeactivatePipeline id={id} onClose={close}>
          {({ onClick }) => (
            <MenuItem
              iconName={pipelineStatusIcon(PipelineStatus.PAUSED)}
              onClick={handleMenuItemClick(open, onClick)}
              shouldDismissPopover={shouldDismissPopover}
              text="Deactivate"
            />
          )}
        </DeactivatePipeline>
      )

    case PipelineStatus.PAUSED:
      return (
        <ActivatePipeline id={id} onClose={close}>
          {({ onClick }) => (
            <MenuItem
              iconName={pipelineStatusIcon(PipelineStatus.RUNNING)}
              onClick={handleMenuItemClick(open, onClick)}
              shouldDismissPopover={shouldDismissPopover}
              text="Activate"
            />
          )}
        </ActivatePipeline>
      )

    case PipelineStatus.KILLED:
    case PipelineStatus.UNKNOWN:
      return null

    default:
      return assertUnreachable(status)
  }
}

export default statusOperationMenuItem

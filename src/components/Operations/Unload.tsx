import _uniqueId from 'lodash-es/uniqueId'
import * as React from 'react'
import { connect } from 'react-redux'
import makeOperation from 'src/components/Operations/internal/Operation'
import { CustomPartialDialogProps } from 'src/components/Operations/internal/OperationWithDialog'
import SpinnerToast from 'src/components/Toasts/SpinnerToastComponent'
import { showFailedTextToast, showSuccessTextToast } from 'src/components/Toasts/TextToast'
import { NestedId } from 'src/store/constants'
import { State } from 'src/store/root-reducer'
import { triggerUnloadTopic, UnloadTopicPayload } from 'src/store/topic/topic-actions'
import { getUnloadTopicState } from 'src/store/topic/topic-reducers'

const UnloadOperation = makeOperation<UnloadTopicPayload, string>()

export const ConnectedUnload = connect(
  () => {
    const requester = _uniqueId('ConnectedUnload')

    return (state: State, { id }: NestedId) => ({
      operation: getUnloadTopicState(state, { id }) as any, // todo: remove as any
      requester,
    })
  },
  {
    triggerOperation: triggerUnloadTopic,
  }
)(UnloadOperation)

const Unload: React.SFC<CustomPartialDialogProps> = ({ children, id, onClose }) => {
  const handleClose = (hide: () => void, callback: () => void) => {
    return () => {
      hide()
      callback()
      if (onClose) onClose()
    }
  }

  const onSucess = () => {
    showSuccessTextToast(`Topic ${id} was unloaded`)
  }

  const onError = () => {
    showFailedTextToast(`Topic ${id} was unloaded`)
  }

  return (
    <SpinnerToast text={`Unloading topic ${id}`}>
      {props => (
        <ConnectedUnload
          id={id}
          onTrigger={props.show}
          onError={handleClose(props.hide, onError)}
          onSuccess={handleClose(props.hide, onSucess)}
        >
          {({ triggerOperation }) => children({ onClick: triggerOperation })}
        </ConnectedUnload>
      )}
    </SpinnerToast>
  )
}

export default Unload

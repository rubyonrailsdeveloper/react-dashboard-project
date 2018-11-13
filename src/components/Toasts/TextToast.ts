import { Intent, Position, Toaster } from '@blueprintjs/core'

const TextToast = Toaster.create({
  className: 'text-toast',
  position: Position.BOTTOM_RIGHT,
})

export const showSuccessTextToast = (message: string) => {
  TextToast.show({ intent: Intent.SUCCESS, message })
}

export const showFailedTextToast = (message: string) => {
  TextToast.show({ intent: Intent.DANGER, message })
}

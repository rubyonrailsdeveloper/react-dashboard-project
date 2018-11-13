import { Icon, IconClasses, Intent } from '@blueprintjs/core'
import * as React from 'react'
import LoadingCell from 'src/components/Tables/LoadingCell'

interface AsyncDataWrapperProps {
  children: (props: { result: any }) => React.ReactNode
  isLoading: boolean
  error: object | null
  result: any
}

const AsyncDataWrapper: React.SFC<AsyncDataWrapperProps> = ({
  isLoading,
  error,
  result,
  children,
  ...props
}) => {
  if (result !== null) return children({ result, ...props })
  if (isLoading) return <LoadingCell />
  if (error) return <Icon iconName={IconClasses.ERROR} intent={Intent.DANGER} />
  return '-' as any // TODO: remove type cast when react types are updated
}

export default AsyncDataWrapper

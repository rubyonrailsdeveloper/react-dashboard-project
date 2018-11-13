import { Button, IButtonProps, Intent } from '@blueprintjs/core'
import * as React from 'react'

type ListPrimaryActionProps = IButtonProps

const ListPrimaryAction: React.SFC<ListPrimaryActionProps> = ({ children, ...other }) => (
  <Button intent={Intent.PRIMARY} {...other}>
    {children}
  </Button>
)

export default ListPrimaryAction

import * as React from 'react'
import Panel, { PanelProps } from 'src/components/Panel/Panel'

const Card: React.SFC<PanelProps> = (props: PanelProps) => (
  <Panel {...props} separateHeader={false} />
)

export default Card

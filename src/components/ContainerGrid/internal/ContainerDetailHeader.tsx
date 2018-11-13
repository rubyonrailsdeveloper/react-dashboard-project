import { Button, Classes, IconClasses } from '@blueprintjs/core'
import * as React from 'react'
import { ContainerLike } from 'src/components/ContainerGrid/internal/types'

interface ContainerDetailHeaderProps {
  container: ContainerLike
  allContainers: ContainerLike[]
  onBackClick: React.MouseEventHandler<Element>
}

const ContainerDetailHeader: React.SFC<ContainerDetailHeaderProps> = ({
  container,
  allContainers,
  onBackClick,
}) => (
  <div className="container-detail-header">
    {allContainers.length > 1 && (
      <Button onClick={onBackClick} iconName={IconClasses.ARROW_LEFT} className={Classes.MINIMAL} />
    )}
    {container.id}
  </div>
)

export default ContainerDetailHeader

import { Button, Classes, IconClasses, Position, Tooltip } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'

interface InfoTooltipProps {
  body: string | undefined
  title: string
}

const InfoTooltipBody: React.SFC<InfoTooltipProps> = ({ title, body }: InfoTooltipProps) => {
  return (
    <div>
      <div className="st-info-tooltip-title">{title}</div>
      <div className="st-info-tooltip-body">{body}</div>
    </div>
  )
}

const InfoTooltip: React.SFC<InfoTooltipProps> = ({ title, body }) => {
  return (
    <Tooltip
      tooltipClassName="st-info-tooltip"
      content={<InfoTooltipBody title={title} body={body} />}
      position={Position.RIGHT}
    >
      <Button
        className={classes(Classes.MINIMAL, 'st-info-tooltip-target')}
        iconName={IconClasses.INFO_SIGN}
      />
    </Tooltip>
  )
}

export default InfoTooltip

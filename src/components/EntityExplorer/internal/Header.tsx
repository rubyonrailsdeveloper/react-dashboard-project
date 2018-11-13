import { Tooltip } from '@blueprintjs/core'
import * as React from 'react'
import LabeledStatusCounter from 'src/components/LabeledStatusCounter/LabeledStatusCount'
import { Health } from 'src/store/constants'

export interface HeaderProps {
  title?: string | React.ReactNode
  subTitle?: string
  metaTitle?: string
  total?: number
  failing?: number
  unhealthy?: number
}

const Header: React.SFC<HeaderProps> = ({
  title,
  subTitle,
  metaTitle,
  total,
  failing,
  unhealthy,
}) => (
  <header>
    <div className="entity-explorer-title">
      {subTitle && <h6 className="sub-title">{subTitle}</h6>}
      {title && <h4 className="name">{title}</h4>}
    </div>
    <div className="meta">
      {metaTitle && <h6 className="meta-title">{metaTitle}</h6>}
      {!!total && (
        <Tooltip content="Total" inline={true}>
          <dt className="labeled-status">
            <span className="labeled-status-label">{total}</span>
          </dt>
        </Tooltip>
      )}
      {!!failing && <LabeledStatusCounter health={Health.FAILING} count={failing} />}
      {!!unhealthy && <LabeledStatusCounter health={Health.UNHEALTHY} count={unhealthy} />}
    </div>
  </header>
)

export default Header

import { Icon, Tag, Tooltip } from '@blueprintjs/core'
import classes from 'classnames'
import truncate from 'lodash-es/truncate'
import * as React from 'react'
import { Link } from 'react-router-dom'
import StIcon from 'src/components/StIcon/StIcon'
import { healthClass, Icons } from 'src/constants'
import { pipelineUrl } from 'src/routes'
import { Health } from 'src/store/constants'
import { TopicIOType } from 'src/store/topic/topic-model'

export interface TopicSourceProps {
  name: string
  type: string
  id?: string | null
  pipelineId?: string | null
  length?: number
  count?: number
}

const TopicSource: React.SFC<TopicSourceProps> = ({
  name,
  type,
  pipelineId: id,
  count,
  length = 40,
}) => {
  const health = Health.OK
  const ext = type === TopicIOType.EXTERNAL
  const icon = ext ?
    (<Icon iconName={Icons.EXTERNAL} />) :
    (<StIcon className={classes(Icons.PIPELINE, healthClass(health))} />)

  let TagName
  let props = {}

  name = truncate(name, { length })
  name = ext ? `External source (${name})` : name

  if (!ext && id) {
    TagName = Link
    props = { to: pipelineUrl({ id }) }
  } else {
    TagName = 'div'
  }

  return (
    <div className="entity-explorer-source topic-source">
      <TagName {...props} className="content">
        <span className="label">
          {icon}
          <span className="name"> {truncate(name, { length })}</span>
        </span>
        <span className="details">
          {count && (
            <Tooltip content="Consumers">
              <Tag className="count">
                <Icon iconName={Icons.OUTPUT} />
                {count}
              </Tag>
            </Tooltip>
          )}
        </span>
      </TagName>
    </div>
  )
}

export default TopicSource

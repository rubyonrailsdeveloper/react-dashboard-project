import { Tooltip } from '@blueprintjs/core'
import classes from 'classnames'
import truncate from 'lodash-es/truncate'
import * as React from 'react'
import { Link } from 'react-router-dom'
import StIcon from 'src/components/StIcon/StIcon'
import { healthClass } from 'src/constants'
import { Icons } from 'src/constants'
import { topicUrl } from 'src/routes'
import { SourceSink } from 'src/store/pipeline/pipeline-model'

interface SourceProps extends SourceSink {
  length?: number
  count?: number
}

const Source: React.SFC<SourceProps> = ({ id, inputs, health, outputs, length = 40 }) => (
  <div
    className="entity-explorer-source pipeline-source"
    data-inputs={inputs.join(',')}
    data-outputs={outputs.join(',')}
  >
    <Link to={topicUrl({ id: id })} className="content">
      <Tooltip content={truncate(id, {length})}>
        <StIcon className={classes(Icons.TOPIC, healthClass(health))} />
      </Tooltip>
    </Link>
  </div>
)

export default Source

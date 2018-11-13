import { Classes, Icon, Intent, Menu, MenuItem, Tag } from '@blueprintjs/core'
import classes from 'classnames'
import capitalize from 'lodash-es/capitalize'
import * as React from 'react'
import Panel from 'src/components/Panel/Panel'
import { tagIcon } from 'src/constants'
import { PhysicalEntityTag } from 'src/store/constants'

interface RawTagPanelProps {
  title: string
  nonFilterableTitle: string
  allLabel: string
  tags: TagCount[]
  currentTag: PhysicalEntityTag
  onChange: (tag: PhysicalEntityTag | null) => void
}

export interface TagCount {
  tag: PhysicalEntityTag
  count: number
}

export default class RawTagPanel extends React.Component<RawTagPanelProps> {
  handleAllTagsClick = () => {
    this.props.onChange(null)
  }

  render() {
    const { tags, currentTag, onChange, title, nonFilterableTitle, allLabel } = this.props
    const header = tags.length > 1 ? title : nonFilterableTitle

    // tslint:disable jsx-no-lambda
    return (
      <Panel className="tag-panel" header={header}>
        <Menu>
          {tags.length > 1 && (
            <MenuItem
              className={classes(!currentTag && Classes.ACTIVE)}
              onClick={this.handleAllTagsClick}
              text={allLabel}
            />
          )}
          {tags.map(({ tag, count }) => (
            <li
              key={tag}
              className={classes(
                Classes.MENU_ITEM,
                currentTag === tag && tags.length > 1 && Classes.ACTIVE,
                tags.length <= 1 && 'no-hover'
              )}
              onClick={() => tags.length > 1 && onChange(tag)}
            >
              <span className="tag-name">
                <Tag intent={currentTag === tag && tags.length > 1 ? Intent.PRIMARY : Intent.NONE}>
                  <Icon iconName={tagIcon(tag)} /> {capitalize(tag)}
                </Tag>
              </span>
              <span className="tag-count" style={{ float: 'right' }}>
                {count}
              </span>
            </li>
          ))}
        </Menu>
      </Panel>
    )
  }
}

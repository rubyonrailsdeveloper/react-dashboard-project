import * as React from 'react'
import RawTagPanel from 'src/components/TagPanel/internal/RawTagPanel'
import { PhysicalEntityTag } from 'src/store/constants'

export interface CommonTagPanelProps {
  title: string
  nonFilterableTitle: string
  allLabel: string
  nestedTags: NestedTags | null
  tag: PhysicalEntityTag
  setTagFilter: (tag: PhysicalEntityTag | null) => void
}

export type NestedTags = Array<{ tags: PhysicalEntityTag[] }>

export default class CommonTagPanel extends React.Component<CommonTagPanelProps> {
  render() {
    const { title, nonFilterableTitle, allLabel, nestedTags, tag, setTagFilter } = this.props
    const totalTags = nestedTags
      ? Object.values(
          nestedTags.reduce((count: any, withTags) => {
            withTags.tags.forEach(
              nestedTag =>
                count[nestedTag]
                  ? count[nestedTag].count++
                  : (count[nestedTag] = { tag: nestedTag, count: 1 })
            )
            return count
          }, {})
        )
      : []
    return (
      nestedTags && (
        <RawTagPanel
          title={title}
          nonFilterableTitle={nonFilterableTitle}
          allLabel={allLabel}
          tags={totalTags}
          currentTag={tag}
          onChange={setTagFilter}
        />
      )
    )
  }
}

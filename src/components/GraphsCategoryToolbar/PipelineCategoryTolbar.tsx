import { Classes } from '@blueprintjs/core'
import * as React from 'react'
import { GraphCategory } from 'src/components/Graph/internal/types'
import CategoryButton from 'src/components/GraphsCategoryToolbar/CategoryButton'
import CategoryToolbar, {
  CategoryToolbarProps,
} from 'src/components/GraphsCategoryToolbar/internal/CategoryToolbar'

const PipelineCategoryToolbar: React.SFC<CategoryToolbarProps> = props => (
  <CategoryToolbar {...props}>
    {toolbarProps => (
      <div className={Classes.BUTTON_GROUP}>
        <CategoryButton value={GraphCategory.Topology} {...toolbarProps} />
        <CategoryButton value={GraphCategory.Bolts} {...toolbarProps} />
        <CategoryButton value={GraphCategory.Spouts} {...toolbarProps} />
      </div>
    )}
  </CategoryToolbar>
)

export default PipelineCategoryToolbar

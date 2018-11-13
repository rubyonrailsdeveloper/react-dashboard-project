import { Classes } from '@blueprintjs/core'
import * as React from 'react'
import { GraphCategory } from 'src/components/Graph/internal/types'
import CategoryButton from 'src/components/GraphsCategoryToolbar/CategoryButton'
import CategoryToolbar, {
  CategoryToolbarProps,
} from 'src/components/GraphsCategoryToolbar/internal/CategoryToolbar'

const NamespaceCategoryToolbar: React.SFC<CategoryToolbarProps> = props => (
  <CategoryToolbar {...props}>
    {toolbarProps => (
      <div className={Classes.BUTTON_GROUP}>
        <CategoryButton value={GraphCategory.Resources} {...toolbarProps} />
        <CategoryButton value={GraphCategory.Events} {...toolbarProps} />
        {/* TODO: Show replication tab if # of clusters > 1 (need to pass down a new prop for this) */}
        {/* <CategoryButton value={GraphCategory.Replication} {...toolbarProps} /> */}
        <CategoryButton value={GraphCategory.Storage} {...toolbarProps} />
      </div>
    )}
  </CategoryToolbar>
)

export default NamespaceCategoryToolbar

import * as React from 'react'
import { GraphCategory } from 'src/components/Graph/internal/types'

interface CategoryToolbarChildrenProps {
  activeCategory: GraphCategory
  onClick: (newActiveCategory: GraphCategory) => void
}

export interface CategoryToolbarProps {
  initialCategory: GraphCategory
  onClick: (activeCategory: GraphCategory) => void
}

interface CategoryToolbarOwnProps extends CategoryToolbarProps {
  children: (props: CategoryToolbarChildrenProps) => React.ReactNode
}

interface CategoryToolbarState {
  activeCategory: GraphCategory
}

class CategoryToolbar extends React.Component<CategoryToolbarOwnProps, CategoryToolbarState> {
  constructor(props: CategoryToolbarOwnProps) {
    super(props)
    this.state = { activeCategory: props.initialCategory }
  }

  updateCategory = (newActiveCategory: GraphCategory) => {
    this.setState({ activeCategory: newActiveCategory })
    this.props.onClick(newActiveCategory)
  }

  render() {
    return (
      <div>
        {this.props.children({
          activeCategory: this.state.activeCategory,
          onClick: this.updateCategory,
        })}
      </div>
    )
  }
}

export default CategoryToolbar

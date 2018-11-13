import { Button } from '@blueprintjs/core'
import * as React from 'react'
import { GraphCategory } from 'src/components/Graph/internal/types'

interface CategoryButtonProps {
  activeCategory: GraphCategory
  onClick: (activeCategory: GraphCategory) => void
  value: GraphCategory
}

export default class CategoryButton extends React.Component<CategoryButtonProps> {
  handleOnClick = () => {
    this.props.onClick(this.props.value)
  }

  render() {
    const { activeCategory, value } = this.props
    return (
      <Button active={activeCategory === value} onClick={this.handleOnClick}>
        {value}
      </Button>
    )
  }
}

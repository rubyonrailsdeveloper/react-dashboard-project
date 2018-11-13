import * as React from 'react'
import { default as ListToolbar, ListToolbarProps } from 'src/components/ListToolbar/ListToolbar'

// TODO: [ofer: 09-Mar-18]: This component is not currently useful (since we've
//       taken out page size comp), but I'm keeping it around in case we start having
//       more common list toolbar components

// interface CommonListToolbarProps extends ListToolbarProps {
// }

const CommonListToolbar: React.SFC<ListToolbarProps> = ({
  filters,
  ...listToolbarProps
}) => {
  const augmentedFilters = [
    ...React.Children.toArray(filters),
  ]
  return <ListToolbar filters={React.Children.toArray(augmentedFilters)} {...listToolbarProps} />
}

export default CommonListToolbar

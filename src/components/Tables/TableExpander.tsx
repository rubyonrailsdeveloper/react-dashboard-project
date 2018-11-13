import { Button, Classes, IconClasses } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import CellWrapper from 'src/components/Tables/CellWrapper'

const TableExpander: React.SFC<{ isExpanded?: true }> = ({ isExpanded }) => (
  <CellWrapper to={null}>
    <Button
      iconName={IconClasses.CHEVRON_RIGHT}
      className={classes(Classes.MINIMAL, 'st-expander', isExpanded && '-open')}
    />
  </CellWrapper>
)

export default TableExpander

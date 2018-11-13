import { Button, Classes, IconClasses } from '@blueprintjs/core'
import * as React from 'react'
import Transition from 'react-transition-group/Transition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import { TransitionDuration } from 'src/constants'

interface FilterBarProps {
  onClearFilter: () => void
  filterActive: boolean
}

const FilterBar: React.SFC<FilterBarProps> = ({ children, onClearFilter, filterActive }) => (
  <TransitionGroup className="filter-bar">
    {filterActive && (
      <Transition key={0} timeout={TransitionDuration.LG}>
        {(state: string) => (
          <div className={`filter-bar-wrap is-${state}`}>
            <span className="filter-bar-filter">
              {children}{' '}
              <Button
                className={Classes.MINIMAL}
                iconName={IconClasses.CROSS}
                onClick={onClearFilter}
              />
            </span>
          </div>
        )}
      </Transition>
    )}
  </TransitionGroup>
)

export default FilterBar

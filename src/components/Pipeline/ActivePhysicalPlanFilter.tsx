import * as React from 'react'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'

interface ActivePhysicalPlanFilterProps {
  filterType: PhysicalPlanFilter
  filterValue: string
}

const ActivePhysicalPlanFilter: React.SFC<ActivePhysicalPlanFilterProps> = ({
  filterType,
  filterValue,
}) => (
  <span>
    <span className="filter-bar-label">Filtering by {filterType}:</span>{' '}
    <span className="filter-bar-name">{filterValue}</span>
  </span>
)

export default ActivePhysicalPlanFilter

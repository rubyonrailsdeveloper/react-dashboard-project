import * as React from 'react'
import { connect } from 'react-redux'
import withPhysicalPlanFilters, {
  PhysicalPlanFiltersInjectedProps,
} from 'src/components/Pipeline/withPhysicalPlanFilters'
import { Health } from 'src/store/constants'
import { makeGetPPlan } from 'src/store/physical-plan/physical-plan-reducers'
import { PhysicalPlanComponent } from 'src/store/physical-plan/physical-plan-views'
import { PhysicalPlanFilter } from 'src/store/physical-plan/physical-plan-views'
import { Pipeline } from 'src/store/pipeline/pipeline-model'
import {
  customGetPipelineComponents,
  customGetPipelineComponentsFiltered,
} from 'src/store/pipeline/pipeline-reducers'
import { getPipelineIsLoading, makeGetPipeline } from 'src/store/pipeline/pipeline-reducers'
import { State } from 'src/store/root-reducer'

export interface Point {
  x: number
  y: number
}

interface PipelineOwnProps extends PhysicalPlanFiltersInjectedProps {
  id: string
}

interface PipelineConnectedProps {
  pipeline: Pipeline | null
  filteredComponents: PhysicalPlanComponent[] | null
  loadingPipeline: boolean
}

export type PipelineProps = PipelineOwnProps & PipelineConnectedProps

export const totalByHealth = (entities: Array<{ health: Health }>, health: Health) =>
  entities.filter(e => e.health === health).length

export function generatePath(p0: Point, p3: Point): string {
  const m = (p0.x + p3.x) / 2
  const p = [p0, { x: m, y: p0.y }, { x: m, y: p3.y }, p3]
  return `M${p[0].x} ${p[0].y}C${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`
}

export function connectPipeline(component: React.ComponentType<PipelineProps>) {
  const connected = connect(() => {
    const getPipeline = makeGetPipeline()
    const getPPlan = makeGetPPlan()
    const getFilteredComponents = customGetPipelineComponentsFiltered(
      customGetPipelineComponents(getPPlan, getPipeline)
    )

    return (state: State, props: PipelineOwnProps) => {
      return {
        pipeline: getPipeline(state, props),
        filteredComponents: getFilteredComponents(state, props),
        loadingPipeline: getPipelineIsLoading(state, props),
      }
    }
  })(component)

  return withPhysicalPlanFilters()(connected)
}

export function handlePipelineNodeClick(props: PipelineProps, componentId: string) {
  const { filterType, filterValue, clearPhysicalPlanFilters, setPhysicalPlanFilters } = props

  if (filterType === PhysicalPlanFilter.COMPONENT && filterValue === componentId) {
    clearPhysicalPlanFilters()
  } else {
    setPhysicalPlanFilters(PhysicalPlanFilter.COMPONENT, componentId)
  }
}

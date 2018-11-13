import forOwn from 'lodash-es/forOwn'
import { normalize } from 'normalizr'
import api, { path } from 'src/api/api'
import { PhysicalPlan, physicalPlanSchema } from 'src/store/physical-plan/physical-plan-model'
import { Pipeline, pipelineSchema } from 'src/store/pipeline/pipeline-model'

const pipelines = path('pipelines')

const postProcessPipeline = (p: Partial<Pipeline>) => {
  // Make it easy for the rest of the codebase to reference IDs
  p.groupId = p.group
  p.namespaceId = `${p.group}/${p.namespace}`
}

export const findAll = async () => {
  const result = await api.get(pipelines())
  const pipelineList: Array<Partial<Pipeline>> = result.data.data

  pipelineList.forEach(postProcessPipeline)

  return normalize(pipelineList, [pipelineSchema])
}

export const find = async (id: string) => {
  const result = await api.get(pipelines(id))
  const pipeline: Partial<Pipeline> = result.data

  postProcessPipeline(pipeline)

  return normalize(pipeline, pipelineSchema)
}

export const findPhysicalPlan = async (id: string) => {
  const result = await api.get(pipelines(`${id}/physicalplan`))
  const physicalPlan: Partial<PhysicalPlan> = result.data

  // Add a fake ID so normalizer correctly builds the entity map
  physicalPlan.id = id

  // Set each instance it's container ID
  forOwn(physicalPlan.instance_groups!, ({ instances }, containerId) => {
    instances.forEach(instanceId => {
      physicalPlan.instances![(instanceId as any) as number].containerId = containerId
    })
  })

  return normalize(physicalPlan, physicalPlanSchema)
}

export const activate = async (id: string) => {
  const result = await api.post(pipelines(`${id}/activate`))
  return result.data || 'OK'
}

export const deactivate = async (id: string) => {
  const result = await api.post(pipelines(`${id}/deactivate`))
  return result.data || 'OK'
}

export const terminate = async (id: string) => {
  const result = await api.delete(pipelines(`${id}`))
  return result.data || 'OK'
}

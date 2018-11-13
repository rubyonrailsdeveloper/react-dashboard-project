import { denormalize, schema } from 'normalizr'
import { Health } from 'src/store/constants'

export const pipelineSchema = new schema.Entity('pipelines', {})

export enum PipelineStatus {
  RUNNING = 'Running',
  PAUSED = 'Paused',
  KILLED = 'Killed',
  UNKNOWN = 'Unknown',
}

export enum BoltGrouping {
  SHUFFLE = 'SHUFFLE',
  FIELDS = 'FIELDS',
}

export interface PipelineLogicalPlan {
  stages: number
  spouts: { [k: string]: Spout }
  bolts: { [k: string]: Bolt }
}

export interface Spout extends ComponentCommon {
  spout_type: string
  spout_source: string[] | string
}

export interface Bolt extends ComponentCommon {
  inputs: Array<{
    stream_name: string
    component_name: string
    grouping: BoltGrouping
  }>
  inputComponents: string[]
}

interface ComponentCommon {
  health: Health
  outputs: Array<{ stream_name: string }>
}

interface CommonPipeline {
  id: string
  groupId: string
  group: string
  namespaceId: string
  namespace: string
  name: string
  clusters: string[]
  environment: string
  status: PipelineStatus
  health: Health
  role: string
  version: string
  language: string
  submissionUser: string
  submissionTime: number
  logicalPlan: PipelineLogicalPlan
  resources: {
    containerLimits: ResourceLimits
    limits: ResourceLimits
  }
}

interface ResourceLimits {
  cpu: number
  memory: number
  storage: number
}

export interface SourceSink {
  health: Health
  id: string
  inputs: string[]
  outputs: string[]
  type: PipelineIOType
}

export interface NormalizedPipeline extends CommonPipeline {
  sources: [string]
  sink: [string]
}

export interface Pipeline extends CommonPipeline {
  sources: SourceSink[]
  sinks: SourceSink[]
}

export enum PipelineIOType {
  TOPIC = 'topic',
  EXTERNAL = 'external',
}

// tslint:disable-next-line no-empty-interface
export interface PipelineSubEntities {
  // Nothing yet
}

export const denormalizePipeline = (
  pipeline: NormalizedPipeline | null,
  entities: PipelineSubEntities
): Pipeline => denormalize(pipeline, pipelineSchema, entities)

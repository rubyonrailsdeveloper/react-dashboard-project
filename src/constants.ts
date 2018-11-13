import { Classes, IconClasses, IconName, Intent } from '@blueprintjs/core'
import { Health, PhysicalEntityTag } from 'src/store/constants'
import { PipelineStatus } from 'src/store/pipeline/pipeline-model'
import { assertUnreachable } from 'src/util/misc'

export const StDateTimeFormat = {
  LONG_WITH_MS: 'MM/DD/YYYY HH:mm:ss.SSS',
}

export enum ListViewMode {
  ROWS = 'rows',
  CARDS = 'cards',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum TransitionDuration {
  SM = 150,
  MD = 250,
  LG = 350,
}

// Set of known icons, so we can change these later
// tslint:disable-next-line no-object-literal-type-assertion
export const Icons = ({
  CONTAINER: IconClasses.SQUARE,
  MESSAGING: 'pt-icon-st-topic',
  NODE: IconClasses.WIDGET_BUTTON,
  COMPUTE: 'pt-icon-st-pipeline',
  STORAGE: IconClasses.DATABASE,
  CLUSTER: IconClasses.GRAPH,
  GROUP: IconClasses.PEOPLE,
  NAMESPACE: IconClasses.FOLDER_CLOSE,
  PROCESS: IconClasses.COG,
  INPUT: IconClasses.LOG_IN,
  OUTPUT: IconClasses.LOG_OUT,
  EXTERNAL: IconClasses.IMPORT,
  BACKLOG: IconClasses.LAYERS,
  PIPELINE: 'st-icon-pipeline',
  TOPIC: 'st-icon-topic',
  PROCESSING: 'pt-icon-st-processing',
  UNHAPPY: 'st-icon-sadface',
  OUTRAGED: 'st-icon-angryface',
  FAILURE: 'st-icon-failure',
  CHECKMARK: 'st-icon-checkmark'
} as { [k: string]: string }) as { [k: string]: IconName }

export const healthIntent = (health: Health) => {
  switch (health) {
    case Health.FAILING:
      return Intent.DANGER
    case Health.UNHEALTHY:
      return Intent.WARNING
    case Health.OK:
      return Intent.SUCCESS
    case Health.UNKNOWN:
      return Intent.NONE
    default:
      return assertUnreachable(health)
  }
}

export const healthIcon = (health: Health) => {
  switch (health) {
    case Health.FAILING:
      return Icons.FAILURE
    case Health.UNHEALTHY:
      return Icons.UNHAPPY
    case Health.OK:
      return Icons.CHECKMARK
    case Health.UNKNOWN:
      return ''
    default:
      return assertUnreachable(health)
  }
}

export const intentIcon = (intent: Intent) => {
  switch (intent) {
    case Intent.DANGER:
      return Icons.FAILURE
    case Intent.WARNING:
      return Icons.UNHAPPY
    case Intent.NONE:
      return Icons.CHECKMARK
    case Intent.SUCCESS:
      return Icons.CHECKMARK
    case Intent.PRIMARY:
      return Icons.CHECKMARK
    default:
      return assertUnreachable(intent)
  }
}

export const thresholdIntent = (percent: number, metric: string = 'default') => {
  // TODO: Might need to add different thresholds for different metrics ('cpu | memory | storage')
  if (percent >= 100) {
    return Intent.DANGER
  } else if (percent > 60) {
    return Intent.WARNING
  }
  return Intent.SUCCESS
}

export const tagIcon = (tag: PhysicalEntityTag) => {
  switch (tag) {
    case PhysicalEntityTag.STORAGE:
      return Icons.STORAGE
    case PhysicalEntityTag.COMPUTE:
      return Icons.COMPUTE
    case PhysicalEntityTag.MESSAGING:
      return Icons.MESSAGING
    default:
      return assertUnreachable(tag)
  }
}

export const thresholdClass = (percent: number, metric?: string) => Classes.intentClass(thresholdIntent(percent, metric))

export const healthClass = (health: Health) => Classes.intentClass(healthIntent(health))

export const pipelineStatusIcon = (status: PipelineStatus) => {
  switch (status) {
    case PipelineStatus.RUNNING:
      return IconClasses.PLAY
    case PipelineStatus.PAUSED:
      return IconClasses.PAUSE
    case PipelineStatus.KILLED:
      return IconClasses.HEART_BROKEN
    case PipelineStatus.UNKNOWN:
      return IconClasses.HELP
    default:
      return assertUnreachable(status)
  }
}

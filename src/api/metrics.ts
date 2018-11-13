import get from 'lodash-es/get'
import api, { path } from 'src/api/api'
import { Step } from 'src/store/metrics/metrics-model'

const metrics = path('metrics')

export interface MetricVector {
  metric: {
    [k: string]: string
  }
  value: [number, string]
}

// This can return many different values depending on query, if we need those other
// return types in the future we will need to change this
export type MetricsQueryResult = MetricVector[]

export const query = async (queryExp: string): Promise<MetricsQueryResult[]> => {
  const result = await api.get(metrics('query'), {
    params: {
      query: queryExp,
    },
  })

  return get(result.data, 'data.result', [])
}

export type RangeVector = Array<[number, string]>

export const queryRange = async (
  queryExp: string,
  start: number,
  end: number,
  step: Step,
  completePayload = false
): Promise<RangeVector> => {
  const result = await api.get(metrics('queryrange'), {
    params: {
      query: queryExp,
      start,
      end,
      step,
    },
  })

  return get(result.data, completePayload ? 'data.result' : 'data.result[0].values', [])
}

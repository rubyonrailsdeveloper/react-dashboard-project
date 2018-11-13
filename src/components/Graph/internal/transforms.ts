import { RangeVector } from 'src/api/metrics'
import { bytesToMB } from 'src/util/formating'

export type MetricTransform = (data: RangeVector) => RangeVector

export const bytesArrToMBArr = (data: RangeVector) => {
  return data.map(timeSeries => [timeSeries[0], bytesToMB(parseFloat(timeSeries[1]))])
}

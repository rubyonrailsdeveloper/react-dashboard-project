import { Dataset } from 'plottable'
import { OriginalTimeSeries } from 'src/components/Graph/internal/types'
import {
  areDatasetsZero,
  getStepBaseOnTimeRange,
  sliceDataSet,
} from 'src/components/Graph/internal/utils'
import { healthClass } from 'src/constants'
import { Health } from 'src/store/constants'
import { TimeRange } from 'src/store/metrics/metrics-model'

describe('Graph Utils', () => {
  describe('areDatasetsZero()', () => {
    it('should return false when datasets empty', () => {
      const datasets: Dataset[] = []

      expect(areDatasetsZero(datasets)).toBe(false)
    })

    it('should return false when first dataset is empty', () => {
      const datasets: Dataset[] = [new Dataset()]

      expect(areDatasetsZero(datasets)).toBe(false)
    })

    it('should return false when first dataset value is empty', () => {
      const datasets: Dataset[] = [new Dataset([])]

      expect(areDatasetsZero(datasets)).toBe(false)
    })

    it('should return false when first dataset value is not zero', () => {
      const datasets: Dataset[] = [new Dataset([[new Date().getTime() * 1000, 1]])]

      expect(areDatasetsZero(datasets)).toBe(false)
    })

    it('should return false when any dataset value are different than zero', () => {
      const datasets: Dataset[] = [
        new Dataset([[new Date().getTime() * 1000, 1]]),
        new Dataset([[new Date().getTime() * 1000, 0]]),
        new Dataset([[new Date().getTime() * 1000, 0]]),
      ]

      expect(areDatasetsZero(datasets)).toBe(false)
    })

    it('should return true when all datasets values are zero', () => {
      const datasets: Dataset[] = [
        new Dataset([[new Date().getTime() * 1000, 0]]),
        new Dataset([[new Date().getTime() * 1000, 0]]),
      ]

      expect(areDatasetsZero(datasets)).toBe(true)
    })
  })

  describe('getStepBaseOnTimeRange()', () => {
    it('should return 8h when timeRange is 1 month', () => {
      const res = getStepBaseOnTimeRange(TimeRange.MONTH)

      expect(res).toBe('8h')
    })

    it('should return 2h when timeRange is 1 week', () => {
      const res = getStepBaseOnTimeRange(TimeRange.WEEK)

      expect(res).toBe('2h')
    })

    it('should return 16m when timeRange is 1 day', () => {
      const res = getStepBaseOnTimeRange(TimeRange.DAY)

      expect(res).toBe('16m')
    })

    it('should return 8m when timeRange is 12 hours', () => {
      const res = getStepBaseOnTimeRange(TimeRange.TWELVE_HOURS)

      expect(res).toBe('8m')
    })

    it('should return 4m when timeRange is 6 hours', () => {
      const res = getStepBaseOnTimeRange(TimeRange.SIX_HOURS)

      expect(res).toBe('4m')
    })

    it('should return 2m when timeRange is 2 hours', () => {
      const res = getStepBaseOnTimeRange(TimeRange.TWO_HOURS)

      expect(res).toBe('2m')
    })

    it('should return 1m as default', () => {
      const minute = '1m'

      expect(getStepBaseOnTimeRange(TimeRange.THIRTY_MINUTES)).toBe(minute)
      expect(getStepBaseOnTimeRange(TimeRange.HOUR)).toBe(minute)
      expect(getStepBaseOnTimeRange(TimeRange.THREE_HOURS)).toBe(minute)
    })
  })

  describe('sliceDataSet', () => {
    const label = 'Im a metric'

    it('should return a transform dataset values to decimal', () => {
      const dataset: OriginalTimeSeries[] = [[1234, '123.123']]
      const res = sliceDataSet(dataset, label)

      expect(res[0].dataset[0][1]).toBe(123.123)
    })

    it('should return the correct healty classname when max value is provided', () => {
      const dataset: OriginalTimeSeries[] = [[123, '1'], [124, '7'], [12345, '9'], [12345, '9.5']]
      const res = sliceDataSet(dataset, label, 10)

      expect(res[0].metadata.className).toBe(healthClass(Health.OK))
      expect(res[1].metadata.className).toBe(healthClass(Health.UNHEALTHY))
      expect(res[2].metadata.className).toBe(healthClass(Health.FAILING))
    })

    it('should return a healty dataset when max value is not provided', () => {
      const res = sliceDataSet([], label)

      expect(res[0].metadata.className).toBe(healthClass(Health.OK))
    })
  })
})

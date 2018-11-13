import orderBy from 'lodash-es/orderBy'
import { defaultMemoize } from 'reselect'
import { SortOrder } from 'src/constants'

interface SortAndPage<F> {
  page: number
  sortOrder: SortOrder
  sortField: F | string
  perPage: number
}

export type FieldIterator<T> = (item: T) => number | string

type FieldIterates<Fields extends string, T> = { [F in Fields]: FieldIterator<T> | null }

type Pager<T, Fields> = (list: T[] | null, sortAndPage: SortAndPage<Fields>) => T[] | null

export const pagerFactory = <T>() => <Fields extends string>(
  fieldIterates: FieldIterates<Fields, T>
): Pager<T, Fields> => {
  const memoizedPaginate = defaultMemoize(
    (list: T[] | null, field: Fields | string, order: SortOrder, page: number, perPage: number) => {
      if (!list) return null

      const fieldIterate = fieldIterates[field as Fields]
      const sorted = fieldIterate ? sortWithIterator(list, fieldIterate, order)! : list

      const pageStart = (page - 1) * perPage
      return sorted.slice(pageStart, pageStart + perPage)
    }
  )

  // Expand arguments so memoization ignores the wrapping object reference (which may change often)
  return (list, { sortField, sortOrder, page, perPage }: SortAndPage<Fields>) =>
    memoizedPaginate(list, sortField, sortOrder, page, perPage)
}

export const sortWithIterator = <T>(
  list: T[] | null,
  iterator: FieldIterator<T>,
  order: SortOrder
) => (list ? orderBy(list, iterator, order) : null)

import { LocationDescriptor } from 'history'
import * as React from 'react'
import urlConnect, { ConfigInjectedPropsWithDefault } from 'src/components/Url/urlConnect'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { Serializer, UrlView } from 'src/components/Url/UrlView'
import { SortOrder } from 'src/constants'
import { wrapDisplayName } from 'src/util/hoc'

const paramsConfig = {
  page: {
    serializer: Serializer.Number,
  },
  sortOrder: {
    serializer: Serializer.String,
  },
  sortField: {
    serializer: Serializer.String,
  },
  perPage: {
    serializer: Serializer.Number,
  },
}

type ParamsConfig = typeof paramsConfig

interface PaginationParams extends ConfigInjectedPropsWithDefault<ParamsConfig> {
  sortOrder: SortOrder
}

export const defaultPaginationParams: PaginationParams = {
  page: 1,
  sortOrder: SortOrder.ASC,
  sortField: '',
  perPage: 100,
}

interface PaginationDispatchers {
  onSortChange: (field: string, order: SortOrder) => void
  onPerPageChange: (perPage: number) => void
  pagerHrefBuilder: (page: number) => LocationDescriptor
  onPageJump: (page: number) => void
}

export interface PaginationInjectedProps extends PaginationParams, PaginationDispatchers {}

const dispatchGen = (urlView: UrlView<ParamsConfig>): PaginationDispatchers => ({
  onSortChange(field, order) {
    // Whenever sort changes, we reset the page to the default (usually 1)
    urlView
      .without('page')
      .with('sortField', field)
      .with('sortOrder', order)
      .historyReplace()
  },
  onPerPageChange(perPage) {
    // Whenever perPage changes, we reset the page to the default (usually 1)
    urlView
      .without('page')
      .with('perPage', perPage)
      .historyReplace()
  },
  pagerHrefBuilder(page) {
    return urlView.with('page', page).href()
  },
  onPageJump(page) {
    urlView.with('page', page).historyReplace()
  },
})

const withPagination = (urlNs: UrlNamespace, defaults = defaultPaginationParams) => <
  T extends PaginationInjectedProps
>(
  WrappedComponent: React.ComponentType<T>
) => {
  const opts = { urlNamespace: urlNs }

  class WithPagination extends React.Component<PaginationInjectedProps> {
    static displayName = wrapDisplayName(WrappedComponent, 'withPagination')

    static defaultProps: Partial<PaginationInjectedProps> = defaults

    render() {
      const sortOrder = this.props.sortOrder === SortOrder.DESC ? SortOrder.DESC : SortOrder.ASC

      return <WrappedComponent {...this.props} sortOrder={sortOrder} />
    }
  }

  return urlConnect(paramsConfig, dispatchGen, () => opts)(WithPagination)
}

export default withPagination

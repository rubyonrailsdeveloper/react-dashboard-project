import { Classes, IconClasses } from '@blueprintjs/core'
import classes from 'classnames'
import { range } from 'd3-array'
import { LocationDescriptor } from 'history'
import ceil from 'lodash-es/ceil'
import clamp from 'lodash-es/clamp'
import * as React from 'react'
import { ChangeEvent } from 'react'
import AppLink from 'src/components/Url/AppLink'

interface PagerProps {
  totalSize: number
  perPage: number
  currentPage: number
  hrefBuilder: (page: number) => LocationDescriptor
  onPageJump: (page: number) => void
}

class Pager extends React.Component<PagerProps> {
  handlePageJump = (ev: ChangeEvent<HTMLSelectElement>) => {
    this.props.onPageJump(+ev.target.value)
  }

  render() {
    const { totalSize, perPage, currentPage, hrefBuilder } = this.props
    const totalPages = ceil(totalSize / perPage)
    const clampedCurrentPage = clamp(currentPage, 0, totalPages + 1)
    const prevPage = clampedCurrentPage - 1
    const nextPage = clampedCurrentPage + 1
    const showPager: boolean = totalSize > perPage
    return (showPager &&
      <div className="pager">
        <AppLink to={hrefBuilder(prevPage)}
          replace
          disabled={prevPage < 1}
          className={classes(IconClasses.CHEVRON_LEFT, Classes.MINIMAL, Classes.BUTTON)} />

        <div className={classes(Classes.FORM_GROUP, Classes.INLINE, 'labeled-input')}>
          <div className={Classes.SELECT}>
            <select value={currentPage} onChange={this.handlePageJump}>
              {range(1, totalPages + 1).map(i => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
              {currentPage > totalPages && <option value={currentPage}>{currentPage}</option>}
            </select>
          </div>
          <label className={classes(Classes.LABEL, 'st-button-label')}>of {totalPages}</label>
        </div>

        <AppLink to={hrefBuilder(nextPage)}
          replace
          disabled={nextPage > totalPages}
          className={classes(IconClasses.CHEVRON_RIGHT, Classes.MINIMAL, Classes.BUTTON)} />
      </div>
    )
  }
}

export default Pager

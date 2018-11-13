import { Spinner } from '@blueprintjs/core'
import * as classes from 'classnames'
import isFunction from 'lodash-es/isFunction'
import * as React from 'react'
import ReactTable, { Column, SortingRule, TableProps as ReactTableProps } from 'react-table'
import CellWrapper from 'src/components/Tables/CellWrapper'
import TableExpander from 'src/components/Tables/TableExpander'
import { SortOrder } from 'src/constants'
import { Omit } from 'src/types'

import Panel from 'src/components/Panel/Panel'
import StackGraphWithLabelLayout from 'src/components/Graph/StackGraphWithLabelLayout'

import StIcon from 'src/components/StIcon/StIcon'

type OurReactTableProps = Omit<ReactTableProps, 'data'>

export interface ExternalTableProps extends Partial<OurReactTableProps> {
  pageSize?: number
  page?: number
  onSortChange: (field: string, order: SortOrder) => void
  sortField: string
  sortOrder: SortOrder
  hrefBuilder?: (row: any) => string
  isLoading: boolean
  data: any[] | null
}

interface TableProps extends ExternalTableProps {
  manual?: boolean
  columns: ColumnsDef<any>
}

export type ColumnsDef<T> = Array<ColumnDef<T>>

export interface ColumnDef<T> extends Column<T> {
  linkToEntity?: boolean
}

interface TableState {
  sorted: SortedDef
  columns: ColumnsDef<any>
}

type SortedDef = [{ id: string; desc: boolean }]

export default class Table extends React.Component<TableProps, TableState> {
  state: TableState = {
    sorted: Table.buildSorted(this.props),
    columns: Table.enhanceColumns(this.props),
  }

  static buildSorted(props: TableProps): SortedDef {
    return [{ id: props.sortField!, desc: props.sortOrder === SortOrder.DESC }]
  }

  static enhanceColumns({ columns, hrefBuilder }: TableProps) {
    return columns.map(col => ({
      ...col,
      Cell: isFunction(col.Cell)
        ? (colData: any, colInfo: any) => (
            <CellWrapper
              to={hrefBuilder && col.linkToEntity ? hrefBuilder(colData.original) : null}
            >
              {(col.Cell as any)(colData, colInfo)}
            </CellWrapper>
          )
        : (colData: any) => (
            <CellWrapper
              to={hrefBuilder && col.linkToEntity ? hrefBuilder(colData.original) : null}
            >
              {col.Cell}
            </CellWrapper>
          ),
    }))
  }

  onSortChange = (newSorted: SortingRule[]) => {
    if (!this.props.onSortChange) return
    const sort = newSorted[0]
    this.props.onSortChange(sort.id, sort.desc ? SortOrder.DESC : SortOrder.ASC)
  }

  componentWillReceiveProps(nextProps: TableProps) {
    if (
      nextProps.sortField !== this.props.sortField ||
      nextProps.sortOrder !== this.props.sortOrder
    ) {
      this.setState({ sorted: Table.buildSorted(nextProps) })
    }

    if (nextProps.columns !== this.props.columns)
      this.setState({
        columns: Table.enhanceColumns(nextProps),
      })
  }

  loadingComponent = ({ className, ...rest }: { className: string }) => (
    <div className={classes('rt-tbody', 'st-table-loading', className)} {...rest}>
      <Spinner />
    </div>
  )

  render() {
    // noinspection JSUnusedLocalSymbols
    const { data, isLoading, page, ...tableProps } = this.props
    console.log(data);
    return data && data.length > 0 ? (
      <ReactTable
        data={data}
        page={page ? page - 1 : 0}
        onSortedChange={this.onSortChange}
        resizable={false}
        {...tableProps}
        minRows={0}
        className="-highlight"
        noDataText=""
        showPagination={false}
        sortable={false}
        sorted={this.state.sorted}
        columns={this.state.columns}
        ExpanderComponent={TableExpander}
      />       
    ) : isLoading ? (
      // Loading state table      
      <ReactTable
        TbodyComponent={this.loadingComponent}
        minRows={this.props.pageSize}
        resizable={false}
        showPagination={false}
        sortable={false}
        columns={this.state.columns}
        onSortedChange={this.onSortChange}
      />
    ) : (
      
      <section className="blankpage-container">
        <Panel className="blankpage-content">
          {/* <img src={require('path/to/one.jpeg')} /> */}
          <StIcon className="st-icon-pipeline" />
          <div>All your data pipelines will be listed here.</div>            
        </Panel>
      </section>      
    )
  }
}

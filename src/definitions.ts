declare module '*.json'

declare module 'react-sizeme' {
  interface Options {
    monitorWidth?: boolean
    monitorHeight?: boolean
    monitorPosition?: boolean
    refreshRate?: number
    refreshMode?: 'throttle' | 'debounce'
    noPlaceholder?: boolean
  }

  interface Size {
    width: number
    height?: number
  }

  interface ExternalProps {
    onSize?: (size: Size) => void
  }

  export interface SizeMeInjectedProps {
    size?: Size
  }

  export interface SizeMeWithHeightInjectedProps {
    size: {
      width: number
      height: number
    }
  }

  interface SizeMeHoc {
    <OriginalProps>(
      WrappedComponent: React.ComponentType<OriginalProps & SizeMeWithHeightInjectedProps>
    ): React.ComponentClass<OriginalProps>

    <OriginalProps>(
      WrappedComponent: React.ComponentType<OriginalProps & SizeMeInjectedProps>
    ): React.ComponentClass<OriginalProps & ExternalProps>
  }

  const sizeMe: (opts: Options) => SizeMeHoc
  export default sizeMe
}

declare module 'react-table' {
  export type ReactTableFunction = () => void
  export type AccessorFunction = (row: object) => any
  export type Accessor = string | string[] | object | AccessorFunction
  export type Aggregator = (values: any, rows: any) => any
  export type TableCellRenderer<T = any> =
    | ((
        data: { original: T; aggregated?: boolean; value?: any; values?: [any] },
        column: any
      ) => React.ReactNode)
    | React.ReactNode
  export type FilterRender = (
    params: { column: Column; filter: any; onFilterChange: ReactTableFunction; key?: string }
  ) => React.ReactElement<any>

  export type ComponentPropsGetter0 = (
    finalState: any,
    rowInfo: undefined,
    column: undefined,
    instance?: any
  ) => object | undefined
  export type ComponentPropsGetterR = (
    finalState: any,
    rowInfo?: RowInfo,
    column?: undefined,
    instance?: any
  ) => object | undefined
  export type ComponentPropsGetterC = (
    finalState: any,
    rowInfo?: undefined,
    column?: Column,
    instance?: any
  ) => object | undefined
  export type ComponentPropsGetterRC = (
    finalState: any,
    rowInfo?: RowInfo,
    column?: Column,
    instance?: any
  ) => object | undefined

  export type FilterFunction = (filter: any, row: any, column: any) => boolean
  export type SubComponentFunction = (rowInfo: RowInfo) => React.ReactNode
  export type PageChangeFunction = (page: number) => void
  export type PageSizeChangeFunction = (newPageSize: number, newPage: number) => void
  export type SortedChangeFunction = (
    newSorted: SortingRule[],
    column: Column[],
    shiftKey: boolean
  ) => void
  export type FilteredChangeFunction = (column: any, value: any, pivotColumn: any) => void
  export type ExpandedChangeFunction = (column: any, event: any, isTouch: boolean) => void

  /** NOTE: to many configuration ways (only true values are confusing) */
  export interface SortingRule {
    id: string
    sort?: 'desc' | 'asc'
    asc?: boolean
    desc?: boolean
  }

  export interface TableProps
    extends Partial<TextProps>,
      Partial<ComponentDecoratorProps>,
      Partial<ControlledStateCallbackProps>,
      Partial<PivotingProps>,
      Partial<ControlledStateOverrideProps>,
      Partial<ComponentProps> {
    /** Default: [] */
    data: any[]

    /** Default: false */
    loading: boolean

    /** Default: false */
    showPagination: boolean

    /** Default: false */
    manual?: boolean

    /** Default: false */
    showPageSizeOptions: boolean

    /** Default: [5, 10, 20, 25, 50, 100] */
    pageSizeOptions: number[]

    /** Default: 20 */
    defaultPageSize: number

    /**
     * Default: undefined
     * Otherwise take value from 'pageSize' if defined
     */
    minRows: number

    /** Default: true */
    showPageJump: boolean

    /** Default: true */
    collapseOnSortingChange: boolean

    /** Default: true */
    collapseOnPageChange: boolean

    /** Default: true */
    collapseOnDataChange: boolean

    /** Default: false */
    freezeWhenExpanded: boolean

    /** Default: [] */
    defaultSorted: SortingRule[]

    /** Default: false */
    showFilters: boolean

    /** Default: [] */
    defaultFiltering: any[]

    /** Default: ... */
    defaultFilterMethod: FilterFunction

    sortable: boolean

    /** Default: true */
    resizable: boolean

    /** Default: false */
    filterable: boolean

    /** Default: [] */
    defaultResizing: any[]

    /** On change. */
    onChange: ReactTableFunction

    /**
     * Default: string
     * Adding a -striped className to ReactTable will slightly color odd numbered rows for legibility
     * Adding a -highlight className to ReactTable will highlight any row as you hover over it
     */
    className: string

    /** Default: {} */
    style: object

    /** Global Column Defaults */
    column: Partial<GlobalColumn>

    /** Array of all Available Columns */
    columns?: Column[]

    /** Expander defaults. */
    expanderDefaults: Partial<ExpanderDefaults>

    /** Privot defaults. */
    pivotDefaults: Partial<PivotDefaults>
  }

  export interface ControlledStateOverrideProps {
    /** Default: undefined */
    page: number

    /** Default: undefined */
    pageSize: number

    /** Default: undefined */
    sorted: SortingRule[]

    /** Sub component */
    SubComponent: SubComponentFunction
  }

  export interface PivotingProps {
    /** Default: undefined */
    pivotBy: string[]

    /** Default: 200 */
    pivotColumnWidth: number

    /** Default: _pivotVal */
    pivotValKey: string

    /** Default: _pivotID */
    pivotIDKey: string

    /** Default: _subRows */
    subRowsKey: string

    /**
     * Default: {} - Pivoting State Overrides (see Fully Controlled Component section)
     * @example { 4: true }
     * @example { 5: { 9: true }, 10: true }
     */
    expandedRows: ExpandedRows

    /** Default: ??? - Pivoting State Callbacks */
    onExpandRow: ReactTableFunction
  }

  export interface ExpandedRows {
    [idx: number]: boolean | ExpandedRows
  }

  export interface ControlledStateCallbackProps {
    onPageChange: PageChangeFunction
    onPageSizeChange: PageSizeChangeFunction
    onSortedChange: SortedChangeFunction
    onFilteredChange: FilteredChangeFunction
    onExpandedChange: ExpandedChangeFunction
  }

  export interface ComponentDecoratorProps {
    getProps: ComponentPropsGetterRC | ComponentPropsGetterC | ComponentPropsGetter0
    getTableProps: ComponentPropsGetter0
    getTheadGroupProps: ComponentPropsGetter0
    getTheadGroupTrProps: ComponentPropsGetter0
    getTheadGroupThProps: ComponentPropsGetterC
    getTheadProps: ComponentPropsGetter0
    getTheadTrProps: ComponentPropsGetter0
    getTheadThProps: ComponentPropsGetterC
    getTheadFilterProps: ComponentPropsGetter0
    getTheadFilterTrProps: ComponentPropsGetter0
    getTheadFilterThProps: ComponentPropsGetterC
    getTbodyProps: ComponentPropsGetter0
    getTrGroupProps: ComponentPropsGetterR | ComponentPropsGetter0
    getTrProps: ComponentPropsGetterR | ComponentPropsGetter0

    // getThProps: ComponentPropsGetter
    getTdProps: ComponentPropsGetterRC | ComponentPropsGetterR
    getTfootProps: ComponentPropsGetter0
    getTfootTrProps: ComponentPropsGetter0

    // getTfootThProps: ComponentPropsGetter
    getPaginationProps: ComponentPropsGetter0
    getLoadingProps: ComponentPropsGetter0
    getNoDataProps: ComponentPropsGetter0
    getResizerProps: ComponentPropsGetter0
  }

  export interface ComponentProps {
    TableComponent: React.ReactType
    TheadComponent: React.ReactType
    TbodyComponent: React.ReactType | React.ReactNode
    TrGroupComponent: React.ReactType
    TrComponent: React.ReactType
    ThComponent: React.ReactType
    TdComponent: React.ReactType
    TfootComponent: React.ReactType
    ExpanderComponent: React.ReactType
    PaginationComponent: React.ReactType
    PreviousComponent: React.ReactType
    NextComponent: React.ReactType
    LoadingComponent: React.ReactType
    NoDataComponent: React.ReactType
    ResizerComponent: React.ReactType
    PadRowComponent: React.ReactType | React.ReactNode
  }

  export interface TextProps {
    /** Default: 'Previous' */
    previousText: string

    /** Default: 'Next' */
    nextText: string

    /** Default: 'Loading...' */
    loadingText: string

    /** Default: 'No rows found' */
    noDataText: string

    /** Default: 'Page' */
    pageText: string

    /** Default: 'of' */
    ofText: string

    /** Default: 'rows' */
    rowsText: string
  }

  export interface GlobalColumn
    extends Column.Basics,
      Column.CellProps,
      Column.FilterProps,
      Column.FooterProps,
      Column.HeaderProps {}

  export namespace Column {
    /** Basic column props */
    interface Basics {
      /** Default: true */
      sortable: boolean

      /** Default: true */
      show: boolean

      /** Default: 100 */
      minWidth: number
    }

    /** Configuration of a columns cell section */
    interface CellProps<T = any> {
      /**
       * Default: undefined
       * A function that returns a primitive, or JSX / React Component
       *
       * @example 'Cell Value'
       * @example ({data, column}) => <div>Cell Value</div>,
       */
      Cell: TableCellRenderer<T>

      /**
       * Default: undefined
       * A function that returns a primitive, or JSX / React Component
       *
       * @example 'Pivot Value'
       * @example ({data, column}) => <div>Pivot Value</div>,
       */
      PivotValue: TableCellRenderer<T>

      /**
       * Default: undefined
       * A function that returns a primitive, or JSX / React Component
       *
       * @example 'Pivot Value'
       * @example ({data, column}) => <div>Pivot Value</div>,
       */
      Aggregated: TableCellRenderer<T>
      /**
       * Set the classname of the `td` element of the column
       * @default string
       */
      className: string

      /**
       * Set the style of the `td` element of the column
       * @default {}
       */
      style: object

      /**
       * @default () => ({})
       */
      getProps: ReactTableFunction
    }

    /** Configuration of a columns header section */
    interface HeaderProps {
      /**
       * Default: undefined
       * A function that returns a primitive, or JSX / React Component
       *
       * @example 'Header Name'
       * @example ({data, column}) => <div>Header Name</div>,
       */
      Header: TableCellRenderer

      /**
       * Set the classname of the `th` element of the column
       * @default string
       */
      headerClassName: string

      /**
       * Default: {}
       * Set the style of the `th` element of the column
       */
      headerStyle: object

      /**
       * Default: (state, rowInfo, column, instance) => ({})
       * A function that returns props to decorate the `th` element of the column
       */
      getHeaderProps: ReactTableFunction
    }

    /** Configuration of a columns footer section */
    interface FooterProps {
      /**
       * Default: undefined
       * A function that returns a primitive, or JSX / React Component
       *
       * @example 'Footer Name'
       * @example ({data, column}) => <div>Footer Name</div>,
       */
      footer: TableCellRenderer

      /**
       * Default: string
       * Set the classname of the `td` element of the column's footer
       */
      footerClassName: string

      /**
       * Default: {}
       * Set the style of the `td` element of the column's footer
       */
      footerStyle: object

      /**
       * Default: (state, rowInfo, column, instance) => ({})
       * A function that returns props to decorate the `th` element of the column
       */
      getFooterProps: ReactTableFunction
    }

    /** Filtering related column props */
    interface FilterProps {
      /** Default: undefined */
      filterMethod: ReactTableFunction

      /** Default: false */
      hideFilter: boolean

      /** Default: ... */
      filterRender: FilterRender

      /** Default: undefined */
      sortMethod: Accessor
    }
  }

  export interface ExpanderDefaults {
    /** Default: false */
    sortable: boolean

    /** Default: 35 */
    width: number

    /** Default: true */
    hideFilter: boolean

    /** Will be overriden in methods.js to display ExpanderComponent */
    render: TableCellRenderer
  }

  export interface PivotDefaults {
    /** Will be overriden in methods.js to display ExpanderComponent */
    render: TableCellRenderer
  }

  export interface Column<T = any>
    extends Partial<Column.Basics>,
      Partial<Column.CellProps<T>>,
      Partial<Column.FilterProps>,
      Partial<Column.FooterProps>,
      Partial<Column.HeaderProps> {
    /**
     * Property name as string or Accessor
     * @example: 'myProperty'
     * @example ["a.b", "c"]
     * @example ["a", "b", "c"]
     * @example {"a": {"b": {"c": $}}}
     * @example (row) => row.propertyName
     */
    accessor?: Accessor

    /**
     * Conditional - A unique ID is required if the accessor is not a string or if you would like to override the column name used in server-side calls
     * @example 'myProperty'
     */
    id?: string

    /**
     * No description
     * @example (values, rows) => _.round(_.mean(values))
     * @example (values, rows) => _.sum(values)
     */
    aggregate?: Aggregator

    /**
     * Default: undefined - A hardcoded width for the column. This overrides both min and max width options
     */
    width?: number

    /**
     * Default: undefined - A maximum width for this column.
     * @default undefined
     */
    maxWidth?: number

    /**
     * Turns this column into a special column for specifying expander and pivot column options.
     * If this option is true and there is NOT a pivot column, the `expanderDefaults` options will be applied on top of the column options.
     * If this option is true and there IS a pivot column, the `pivotDefaults` options will be applied on top of the column options.
     * Adding a column with the `expander` option set will allow you to rearrange expander and pivot column orderings in the table.
     * It will also let you specify rendering of the header (and header group if this special column is placed in the `columns` option of another column) and the rendering of the expander itself.
     */
    expander?: boolean

    /** Header Groups only */
    columns?: any[]
  }

  export interface ColumnRenderProps {
    /** Sorted data. */
    data: any[]

    /** The column. */
    column: Column
  }

  export interface RowRenderProps extends Partial<RowInfo> {
    /** Whenever the current row is expanded */
    isExpanded?: boolean

    /** The current cell value */
    value?: any
  }

  export interface RowInfo {
    /** Original row from your data */
    row: any

    /** The post-accessed values from the original row */
    rowValues: any

    /** The index of the row */
    index: number

    /** The index of the row relative to the current page */
    viewIndex: number

    /** The nesting depth (zero-indexed) */
    level: number

    /** The nesting path of the row */
    nestingPath: number[]

    /** A boolean stating if the row is an aggregation row */
    aggregated: boolean

    /** An array of any expandable sub-rows contained in this row */
    subRows: any[]
  }

  export interface FinalState extends TableProps {
    startRow: number
    endRow: number
    pageRows: number
    padRows: number
    hasColumnFooter: boolean
    canPrevious: boolean
    canNext: boolean
    rowMinWidth: number
  }

  export default class ReactTable extends React.Component<Partial<TableProps>> {}
}

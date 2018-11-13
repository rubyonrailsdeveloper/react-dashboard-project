import { ColumnDef } from 'src/components/Tables/Table'
import { FieldIterator } from 'src/util/pager'

export interface FieldsDescriptor<T> {
  [field: string]: FieldDescriptor<T>
}

interface FieldDescriptor<T> {
  id: string
  label: string
  sortIterator: FieldIterator<T> | null
}

export const fieldColumn = <T extends {}>(
  { id, label, sortIterator }: FieldDescriptor<T>,
  merge: ColumnDef<T>
): ColumnDef<T> => ({
  id,
  Header: label,
  sortable: !!sortIterator,
  linkToEntity: true,
  accessor: sortIterator ? sortIterator : undefined,
  ...merge,
})

interface FieldDescriptor<T> {
  id: string
  label: string
  sortIterator: FieldIterator<T> | null
}

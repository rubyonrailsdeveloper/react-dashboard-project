import * as React from 'react'

export const getNumberInputValue = (evt: React.FormEvent<HTMLInputElement>, minValue = 1) => {
  let value: number | string = (evt.target as HTMLInputElement).value

  if (!value) return minValue

  value = parseInt(value, 10)
  return value < minValue ? minValue : value
}

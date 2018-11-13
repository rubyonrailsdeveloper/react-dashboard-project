export const unfilterableClass = (condition: string | number | undefined | null | boolean) => {
  return !!condition ? 'is-unfilterable' : ''
}

import isString from 'lodash-es/isString'

type NamedComponent = string | { displayName?: string; name?: string }

const getDisplayName = (Component: NamedComponent) =>
  isString(Component) ? Component : Component.displayName || Component.name || 'Component'

export const wrapDisplayName = (BaseComponent: NamedComponent, hocName: string) => {
  return `${hocName}(${getDisplayName(BaseComponent)})`
}

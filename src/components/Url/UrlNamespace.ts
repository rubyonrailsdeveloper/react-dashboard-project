import isArray from 'lodash-es/isArray'

export default class UrlNamespace {
  static readonly Separator = ':'

  private readonly ns: string[]

  constructor(ns: string | string[]) {
    this.ns = isArray(ns) ? ns : ns ? [ns] : []
  }

  childNs(childNs: string) {
    return new UrlNamespace([...this.ns, childNs])
  }

  prefix(param: string) {
    return [...this.ns, param].join(UrlNamespace.Separator)
  }
}

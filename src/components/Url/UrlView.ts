import { History, LocationDescriptorObject } from 'history'
import isArray from 'lodash-es/isArray'
import isNan from 'lodash-es/isNaN'
import isString from 'lodash-es/isString'
import mapKeys from 'lodash-es/mapKeys'
import mapValues from 'lodash-es/mapValues'
import parseInt from 'lodash-es/parseInt'
import pickBy from 'lodash-es/pickBy'
import reduce from 'lodash-es/reduce'
import UrlNamespace from 'src/components/Url/UrlNamespace'
import { parseQs, RawSerializeType, stringifyQs } from 'src/util/query-string'

export interface Serializer<T> {
  _type: T
  deserialize(value: RawSerializeType): T | undefined
}

// tslint:disable no-object-literal-type-assertion
const SNumber = {
  deserialize(value: RawSerializeType): number | undefined {
    if (!value || isArray(value)) return undefined
    const maybeNumber = parseInt(value, 10)
    return isNan(maybeNumber) ? undefined : maybeNumber
  },
} as Serializer<number>

const SString = {
  deserialize(value: RawSerializeType): string | undefined {
    if (value === null || value === '') return ''
    if (!value || !isString(value)) return undefined
    return value
  },
} as Serializer<string>

const SStringArray = {
  deserialize(value: RawSerializeType): string[] | undefined {
    if (value === null) return []
    if (!value) return undefined
    if (isString(value)) return [value]
    return value
  },
} as Serializer<string[]>

const SNumberArray = {
  deserialize(value: RawSerializeType): number[] | undefined {
    if (value === null) return []
    if (!value) return undefined
    if (isString(value)) value = [value]
    return value.map(v => parseInt(v, 10))
  },
} as Serializer<number[]>

export const Serializer = {
  String: SString,
  Number: SNumber,
  StringArray: SStringArray,
  NumberArray: SNumberArray,
}

interface ParamConfig {
  alias?: string
  serializer: typeof SNumber | typeof SString
}

export type UrlViewConfig<C> = { [P in keyof C]: ParamConfig }

export type SerializerType<
  P extends keyof C,
  C extends UrlViewConfig<C>
> = C[P]['serializer']['_type']

interface ParsedQuery<C extends UrlViewConfig<C>> {
  [k: string]: SerializerType<keyof C, C>
}

type FilteredQuery<C extends UrlViewConfig<C>> = { [P in keyof C]?: SerializerType<P, C> }

// tslint:disable prefer-object-spread
export class UrlView<Config extends UrlViewConfig<Config>> {
  private get parsedQuery(): ParsedQuery<Config> {
    if (!this._parsedQuery) this._parsedQuery = this.deserialize()

    return this._parsedQuery
  }

  constructor(
    private readonly config: Config,
    private readonly ns: UrlNamespace,
    private readonly loc: LocationDescriptorObject,
    private readonly history: History,
    private _parsedQuery?: ParsedQuery<Config>
  ) {}

  private static parseParamValue(config: ParamConfig, value: RawSerializeType) {
    return config.serializer.deserialize(value)
  }

  get<P extends keyof Config>(param: P): SerializerType<P, Config> | undefined {
    return this.parsedQuery[this.prefix(param)]
  }

  getDefined(): FilteredQuery<Config> {
    const prefixToParamMap = this.prefixToParamMap()
    return mapKeys(
      pickBy(this.parsedQuery, (_, prefixed) => !!prefixToParamMap[prefixed]),
      (_, prefixed) => prefixToParamMap[prefixed]
    ) as FilteredQuery<Config>
  }

  getEverything(): ParsedQuery<Config> {
    return this.parsedQuery
  }

  with<P extends keyof Config>(param: P, value: SerializerType<P, Config>) {
    const mutated = Object.assign({}, this.parsedQuery, {
      [this.prefix(param)]: value,
    })
    return this.makeNew(mutated)
  }

  without<P extends keyof Config>(param: P) {
    const copy = Object.assign({}, this.parsedQuery)
    delete copy[this.prefix(param)]
    return this.makeNew(copy)
  }

  withoutDefined() {
    const prefixToParamMap = this.prefixToParamMap()
    const cleaned = pickBy(
      this.parsedQuery,
      (_, prefixed) => !prefixToParamMap[prefixed]
    ) as ParsedQuery<Config>
    return this.makeNew(cleaned)
  }

  withoutEverything() {
    return this.makeNew({})
  }

  location() {
    if (!this._parsedQuery) return this.loc
    return this.serialize()
  }

  historyReplace() {
    this.history.replace(this.location())
  }

  historyPush() {
    this.history.push(this.location())
  }

  href() {
    return this.location()
  }

  toString() {
    return this.href()
  }

  private deserialize(): ParsedQuery<Config> {
    const prefixToParamMap = this.prefixToParamMap()
    const parsed = parseQs(this.loc.search || '')
    return mapValues(parsed, (value, param) => {
      const paramConfig = prefixToParamMap[param]
      return paramConfig ? UrlView.parseParamValue(this.config[paramConfig], value) : value
    })
  }

  private prefixToParamMap() {
    return reduce<object, { [k: string]: keyof Config }>(
      this.config,
      (res, _, paramName) => {
        res[this.prefix(paramName)] = paramName
        return res
      },
      {}
    )
  }

  private serialize(): LocationDescriptorObject {
    const search = stringifyQs(this.parsedQuery)
    return {
      ...this.loc,
      search,
    }
  }

  private paramName<P extends keyof Config>(param: P) {
    return this.param(param).alias || param
  }

  private param<P extends keyof Config>(param: P) {
    return this.config[param] as ParamConfig
  }

  private prefix<P extends keyof Config>(param: P) {
    return this.ns.prefix(this.paramName(param))
  }

  private makeNew(parsedQuery: ParsedQuery<Config>) {
    return new UrlView<Config>(this.config, this.ns, this.loc, this.history, parsedQuery)
  }
}

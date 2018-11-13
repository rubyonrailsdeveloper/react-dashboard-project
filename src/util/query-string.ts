import isEmpty from 'lodash-es/isEmpty'
import isObject from 'lodash-es/isObject'
import * as qs from 'qs'
import { IParseOptions, IStringifyOptions } from 'qs'

const stringifyFilter = (prefix: string, value: any) =>
  isObject(value) && isEmpty(value) ? '' : value

export const stringifyQs = (obj: any, options?: IStringifyOptions) =>
  qs.stringify(obj, {
    arrayFormat: 'brackets',
    encodeValuesOnly: true,
    format: 'RFC1738',
    filter: stringifyFilter,
    ...options,
  })

export const parseQs = (
  query: string,
  options?: IParseOptions
): { [k: string]: RawSerializeType } =>
  qs.parse(query, {
    ignoreQueryPrefix: true,
    ...options,
  })

export const applyQs = (query: string, obj: any) =>
  stringifyQs({
    ...parseQs(query),
    ...obj,
  })

export type RawSerializeType = string | string[] | null

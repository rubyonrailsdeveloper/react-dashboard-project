export const assertUnreachable = (any: never): never => {
  throw new Error('Incorrect data type')
}

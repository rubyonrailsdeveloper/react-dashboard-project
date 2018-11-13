export const formatPercentage = (value: number, maxFractionDigits = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: maxFractionDigits,
  }).format(value)

export const formatDecimal = (value: number, maxFractionDigits = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: maxFractionDigits,
  }).format(value)

export const formatFixedDecimal = (value: number, fractionDigits = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value)

const integerFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
export const formatInteger = (number: number) => integerFormat.format(number)

export const bytesToMB = (bytes: number) => bytes / 1024 / 1024

export const mbToBytes = (mbs: number) => mbs * 1024 * 1024

export const scaleBytes = (bytes: number) => {
  if (bytes > 1000) bytes = bytes / 1.024
  if (bytes > 1000000) bytes = bytes / 1.024
  if (bytes > 1000000000) bytes = bytes / 1.024
  if (bytes > 1000000000000) bytes = bytes / 1.024

  return bytes
}

// Format the unit of storage based on how large the value is
export const bytesToHumanSize = (bytes: number, opts?: Intl.NumberFormatOptions, labelOverride?: string) => {
  bytes = scaleBytes(bytes)
  const abs_bytes = Math.abs(bytes)
  let denom = 1
  let label = ''

  if (abs_bytes < Math.pow(10, 3)) {
    label = 'Bytes'
  } else if (abs_bytes >= Math.pow(10, 3) && abs_bytes < Math.pow(10, 6)) {
    denom = Math.pow(10, 3)
    label = 'KB'
  } else if (abs_bytes >= Math.pow(10, 6) && abs_bytes < Math.pow(10, 9)) {
    denom = Math.pow(10, 6)
    label = 'MB'
  } else if (abs_bytes >= Math.pow(10, 9) && abs_bytes < Math.pow(10, 12)) {
    denom = Math.pow(10, 9)
    label = 'GB'
  } else if (abs_bytes >= Math.pow(10, 12)) {
    denom = Math.pow(10, 12)
    label = 'TB'
  }

  if (labelOverride) {
    label = labelOverride
  }

  return {
    quantity: bytes,
    denom,
    label,
    formatted: `${Intl.NumberFormat('en-US', opts).format(bytes / denom)} ${label}`,
  }
}

export const precisionRound = (number: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

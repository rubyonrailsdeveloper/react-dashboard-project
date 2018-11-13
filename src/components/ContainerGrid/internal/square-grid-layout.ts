import { range } from 'd3-array'
import { scaleBand } from 'd3-scale'
import ceil from 'lodash-es/ceil'
import floor from 'lodash-es/floor'

function optimalSquare(n: number, w: number, h: number, minSide: number, maxSide: number) {
  const px = ceil(Math.sqrt(n * w / h))
  const sx = floor(px * h / w) * px < n ? h / ceil(px * h / w) : w / px
  const py = ceil(Math.sqrt(n * h / w))
  const sy = floor(py * w / h) * py < n ? w / ceil(py * w / h) : h / py

  return Math.min(Math.max(sx, sy, minSide), maxSide)
}

interface SquareGridOptions {
  width: number
  height: number
  padding?: number
  minSide: number
  maxSide?: number
}

export interface SquarePosition {
  x: number
  y: number
  side: number
}

export type SquareGridLayout = (count: number) => SquarePosition[]

export type SquareGridLayoutBuilder = (options: SquareGridOptions) => SquareGridLayout

export const defaultMaxSide = 89

const squareGridLayout: SquareGridLayoutBuilder = ({
  width,
  height,
  padding = 0,
  minSide,
  maxSide = defaultMaxSide,
}) => count => {
  const side = optimalSquare(count, width, height, minSide, maxSide)

  const cols = floor(width / side)
  const xScale = scaleBand<number>()
    .domain(range(cols))
    .range([0, width])
    .paddingInner(padding)

  const rows = ceil(count / cols)
  const yScale = scaleBand<number>()
    .domain(range(rows))
    .range([0, rows * side])
    .padding(padding)

  return range(count).map((_, i) => {
    const col = i % cols
    const row = floor(i / cols)
    return { x: xScale(col)!, y: yScale(row)!, side }
  })
}

export default squareGridLayout

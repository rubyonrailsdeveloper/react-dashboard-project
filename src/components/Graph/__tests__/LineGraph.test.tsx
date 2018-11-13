import { mount, render } from 'enzyme'
import * as React from 'react'
import LineGraph from 'src/components/Graph/internal/LineGraph'
import { CustomDataSet } from 'src/components/Graph/internal/types'

describe('LineGraph Component', () => {
  const dataSets: CustomDataSet[] = [
    {
      dataset: [],
      metadata: {
        className: 'metadata-class',
        label: 'metadata-label',
      },
    },
  ]

  const baseProps = {
    hasDots: false,
    error: null,
    isLoading: false,
    showLoadingIndicator: true,
    dataSets,
  }

  it('should display no data message when dataset is empty', () => {
    const noDataClass = '.graph-no-data-message'
    const graph = render(<LineGraph {...baseProps} />)

    expect(graph.find(noDataClass)).toHaveLength(1)
  })

  it('should not display Loader when isLoading is falsy', () => {
    const loaderClass = '.graph-loader'
    const graph = render(<LineGraph {...baseProps} />)

    expect(graph.find(loaderClass)).toHaveLength(0)
  })

  it('should display Loader when isLoading === true', () => {
    const loaderClass = '.graph-loader'
    const graph = render(<LineGraph {...baseProps} isLoading={true} />)

    expect(graph.find(loaderClass)).toHaveLength(1)
  })

  it('should not display error message when error is falsy', () => {
    const errorClass = '.graph-error'
    const graph = render(<LineGraph {...baseProps} />)

    expect(graph.find(errorClass)).toHaveLength(0)
  })

  it('should display error message when error is truthy', () => {
    const errorClass = '.graph-error'
    const graph = render(<LineGraph {...baseProps} error={{}} />)

    expect(graph.find(errorClass)).toHaveLength(1)
  })

  it('should have custom height when graphHeight is provided', () => {
    const customHeight = '100px'
    const graphWrapper = mount(<LineGraph {...baseProps} graphHeight={customHeight} />)

    expect(graphWrapper.find('.line-graph').props().style!.height).toBe(customHeight)
  })
})

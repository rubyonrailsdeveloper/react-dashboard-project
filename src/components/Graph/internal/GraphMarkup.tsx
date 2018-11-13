import { Classes, Spinner } from '@blueprintjs/core'
import classes from 'classnames'
import _isEmpty from 'lodash-es/isEmpty'
import * as React from 'react'
import sizeMe, { SizeMeWithHeightInjectedProps } from 'react-sizeme'
import { CustomDataSet, StackDataSet } from 'src/components/Graph/internal/types'

interface GraphMarkupOwnProps {
  dataSets: CustomDataSet[] | StackDataSet[]
  error: object | null
  isLoading: boolean
  showLoadingIndicator: boolean
  graphHeight?: string
  xAxisHeight?: string
  saveGraphReference: (lineGraphDOM: HTMLDivElement) => void
  saveXAxisReference: (lineGraphDOM: HTMLDivElement) => void
  isStack?: boolean
  onSizeUpdate?: () => void
}

interface GraphMarkupProps extends GraphMarkupOwnProps, SizeMeWithHeightInjectedProps {}

class GraphMarkup extends React.Component<GraphMarkupProps> {
  componentDidUpdate(oldProps: GraphMarkupProps) {
    if (oldProps.size !== this.props.size && this.props.onSizeUpdate) {
      this.props.onSizeUpdate()
    }
  }

  render() {
    const {
      dataSets,
      error,
      graphHeight,
      isLoading,
      isStack,
      saveGraphReference,
      saveXAxisReference,
      size: { height, width },
      showLoadingIndicator,
      xAxisHeight,
    } = this.props

    return (
      <div
        className="line-graph-wrapper"
        style={{ position: 'absolute', height: '100%', width: '100%' }}
      >
        <div
          ref={saveGraphReference}
          className={classes('line-graph', isStack && 'stack')}
          style={{ height: graphHeight || height, width }}
        />

        <div ref={saveXAxisReference} className="x-axis" style={{ height: xAxisHeight, width }} />

        <div
          className={classes('graph-no-data-message', {
            hide:
              isLoading ||
              (!_isEmpty(dataSets) &&
                (isStack || !_isEmpty((dataSets[0] as CustomDataSet).dataset))),
          })}
        >
          <p>No data points.</p>
        </div>

        {isLoading && showLoadingIndicator && (
          <div className="graph-loader">
            <Spinner className={Classes.SMALL} />
          </div>
        )}
        {error && (
          <div className="graph-error">
            <p>Graph could not be loaded.</p>
          </div>
        )}
      </div>
    )
  }
}

export default sizeMe({
  monitorWidth: true,
  monitorHeight: true,
  refreshMode: 'debounce',
  noPlaceholder: true,
  refreshRate: 16 * 3,
})<GraphMarkupOwnProps>(GraphMarkup)

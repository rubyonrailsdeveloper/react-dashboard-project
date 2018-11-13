import * as React from 'react'
import * as CopyToClipboards from 'react-copy-to-clipboard'
import { showSuccessTextToast } from 'src/components/Toasts/TextToast'

interface CopyProps {
  text: string
}

class Copy extends React.Component<CopyProps> {
  handleCopy = () => {
    showSuccessTextToast(`Copied ${this.props.text} to clipboard`)
  }

  render() {
    return (
      <CopyToClipboards text={this.props.text} onCopy={this.handleCopy}>
        {React.Children.only(this.props.children)}
      </CopyToClipboards>
    )
  }
}

export default Copy

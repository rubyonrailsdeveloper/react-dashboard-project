import json from 'node_modules/react-syntax-highlighter/languages/hljs/json'
import SyntaxHighlighter, { registerLanguage } from 'node_modules/react-syntax-highlighter/light'
import railscasts from 'node_modules/react-syntax-highlighter/styles/hljs/railscasts'
import * as React from 'react'

registerLanguage('json', json)

class Schema extends React.Component {
  render() {
    const codeString = `
    {
      "type": "record",
      "name": "aisClassAPositionReport",
      "namespace": "com.production",
      "doc": "Schema for AIS Class A Position Reports.",
      "fields": [
        {
          "name": "Type",
          "type": "int",
          "doc": "The type of the AIS Message. 1/2/3 are Class A position reports."
        },
        {
          "name": "Repeat",
          "type": "int",
          "doc": "Repeat Indicator"
        },
        {
          "name": "MMSI",
          "type": "long",
          "doc": "User ID (MMSI)"
        },
        {
          "name": "Speed",
          "type": "float",
          "doc": "Speed over Ground (SOG)"
        },
        {
          "name": "Accuracy",
          "type": "boolean",
          "doc": "Position Accuracy"
        }
      ]
    }
    `
    return (
      <div className="st-schema">
        <div className="pt-text-muted">
          Created by Karthik Ramasamy, last edited by Sanjeev Kulkarni
        </div>
        <SyntaxHighlighter language="json" style={railscasts} customStyle={{'background': 'none'}}>{codeString}</SyntaxHighlighter>
      </div>
    )
  }
}
export default Schema

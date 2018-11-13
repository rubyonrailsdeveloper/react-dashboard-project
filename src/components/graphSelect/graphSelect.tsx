import * as React from 'react'

import Select from 'react-select'
var options = [
  { value: 'backlog', label: 'BACKLOG(EVENTS)' },
  { value: 'two', label: 'Two' }
];
// function logChange(val) {
//   console.log("Selected: " + val);
// }
interface stSelectProps {
  //
}

interface stSelectState {
  //
}

class GraphSelect extends React.Component<stSelectProps, stSelectState> {
  
  state: stSelectState = {
    //
  }

  render() {
    return <Select {...this.props} 
    name="form-field-name"
    value="backlog"
    options={options}
    // onChange={logChange}
    />
  }
}

export default GraphSelect

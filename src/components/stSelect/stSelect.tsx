import * as React from 'react'

import Select from 'react-select'
var options = [
  { value: 'cpu-usage', label: 'CPU USAGE(CORES)' },
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

class StSelect extends React.Component<stSelectProps, stSelectState> {
  
  state: stSelectState = {
    //
  }

  render() {
    return <Select {...this.props} 
    name="form-field-name"
    value="cpu-usage"
    options={options}
    // onChange={logChange}
    />
  }
}

export default StSelect

import React, { Component } from 'react';

class RegionSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'brooklyn'
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <select value={this.state.value} onChange={this.handleChange}>
        <option value="manhattan">Manhattan</option>
        <option value="brooklyn">Brooklyn</option>
      </select>
    );
  }
}

export default RegionSelect;

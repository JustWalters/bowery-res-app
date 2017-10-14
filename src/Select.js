import React, { Component } from 'react';

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.options[0].value
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
        {this.props.options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }
}

export default Select;

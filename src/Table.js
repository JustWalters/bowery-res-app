import React, { Component } from 'react';

class TableRow extends Component {
  render() {
    return (
      <tr>
      {this.props.cells.map((cell, idx) => <td key={idx}>{cell}</td>)}
      </tr>
    );
  }
}

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colNames: [],
      data: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data.length >= 2) {
      this.setState({
        colNames: nextProps.data.splice(0,1)[0],
        data: nextProps.data
      });
    }
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
          {this.state.colNames.map((col, idx) => <th key={idx}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {this.state.data.map((row, idx) => <TableRow key={idx} cells={row} />)}
        </tbody>
      </table>
    );
  }
}

export default Table;

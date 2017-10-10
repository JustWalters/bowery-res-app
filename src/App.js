import React, { Component } from 'react';
import './App.css';

class TableRow extends Component {
  render() {
    return (
      <tr>
      {this.props.cells.map(cell => <td key={cell}>{cell}</td>)}
      </tr>
    );
  }
}

class Table extends Component {
  constructor(props) {
    super(props);
    this.data = [["STNAME","POP","DATE","state"],
    ["Alabama","4849377","7","01"],
    ["Alaska","736732","7","02"],
    ["Arizona","6731484","7","04"],
    ["Arkansas","2966369","7","05"],
    ["California","38802500","7","06"],
    ["Colorado","5355866","7","08"],
    ["Connecticut","3596677","7","09"],
    ["Delaware","935614","7","10"],
    ["District of Columbia","658893","7","11"]];
    this.colNames = this.data.splice(0,1);
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
          {this.colNames.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {this.data.map(row => <TableRow key={row[0]} cells={row} />)}
        </tbody>
      </table>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Table />
      </div>
    );
  }
}

export default App;

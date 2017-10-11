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

    this.state = {
      colNames: this.props.data.splice(0,1)
    };
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
          {this.state.colNames.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {this.props.data.map(row => <TableRow key={row[0]} cells={row} />)}
        </tbody>
      </table>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    const apiBase = 'https://api.census.gov/data';
    const year = '2015';
    const dataset = 'acs5/profile';
    const vars = ['DP03_0018E', 'DP03_0019E', 'DP03_0020E'];
    const geo = `for=${encodeURIComponent('county:061')}&in=${encodeURIComponent('state:36')}`;

    let url = [apiBase, year, dataset].join('/');
    let getParam = vars.join(',');

    url = `${url}?get=${encodeURIComponent(getParam)}&${geo}`;

    fetch(url)
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {}
    })
    .then(json => {
      this.setState({data: json});
    })
    .catch(err => {console.error(err);});
  }

  render() {
    return (
      <div className="App">
        <Table data={this.state.data} />
      </div>
    );
  }
}

export default App;

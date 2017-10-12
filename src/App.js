import React, { Component } from 'react';
import './App.css';

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

class CensusTable extends Component {
  constructor(props){
    super(props);
    this.data = [];
  }

  componentWillReceiveProps(nextProps) {
    if (!(nextProps.neighborhoodData[1] && nextProps.countyData[1])) {
      // Don't do anything unless we have both sets of data
      return;
    }

    let neighborhood = nextProps.neighborhood;
    let county = nextProps.county;

    let countyData = this.calculateValues(nextProps.countyData[1]);
    let neighborhoodData = this.calculateValues(nextProps.neighborhoodData[1]);

    let row0 = ['', neighborhood, '% Total (neighborhood)', county, '% Total (county)'];
    let row1 = ['2015 Est. Pop 16+ by Transp. to Work', neighborhoodData.commuters, '', countyData.commuters, ''];
    let row2 = ['Drove Alone', neighborhoodData.alone, neighborhoodData.alonePercent, countyData.alone, countyData.alonePercent];
    let row3 = ['Carpooled', neighborhoodData.carpool, neighborhoodData.carpoolPercent, countyData.carpool, countyData.carpoolPercent];
    let row4 = ['Other', neighborhoodData.other, neighborhoodData.otherPercent, countyData.other, countyData.otherPercent];
    this.data = [row0, row1, row2, row3, row4];
  }

  calculateValues(data) {
    let commuters = Number(data[0]);
    let alone = Number(data[1]);
    let carpool = Number(data[2]);
    let other = commuters - (alone + carpool);

    let alonePercent = alone/commuters;
    let carpoolPercent = carpool/commuters;
    let otherPercent = 1 - ((alone + carpool)/commuters);

    return {
      commuters,
      alone,
      carpool,
      other,
      alonePercent,
      carpoolPercent,
      otherPercent
    };
  }

  render() {
    return <Table data={this.data}/>;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { neighborhoodData: [], countyData: [] };
  }

  componentDidMount() {
    const apiBase = 'https://api.census.gov/data';
    const year = '2015';
    const dataset = 'acs5/profile';
    const vars = ['DP03_0018E', 'DP03_0019E', 'DP03_0020E'];
    const geoCounty = `for=county:061&in=state:36`;
    const geoNeighborhood = `for=zip+code+tabulation+area:10009`;

    this.neighborhood = 'Slope';
    this.county = 'Kings';

    let urlCounty, urlNeighborhood, url = [apiBase, year, dataset].join('/');
    let getParam = vars.join(',');
    url = `${url}?get=${encodeURIComponent(getParam)}`;

    urlCounty = `${url}&${geoCounty}`;
    urlNeighborhood = `${url}&${geoNeighborhood}`;

    fetch(urlCounty)
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {}
    })
    .then(json => {
      this.setState({countyData: json});
    })
    .catch(err => {console.error(err);});

    fetch(urlNeighborhood)
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {}
    })
    .then(json => {
      this.setState({neighborhoodData: json});
    })
    .catch(err => {console.error(err);});
  }

  render() {
    return (
      <div className="App">
        <CensusTable neighborhoodData={this.state.neighborhoodData} countyData={this.state.countyData} neighborhood={this.neighborhood} county={this.county} />
      </div>
    );
  }
}

export default App;

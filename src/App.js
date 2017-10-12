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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { neighborhoodData: [], countyData: [] };
    this.apiResults = {};
    this.updateRegion = this.updateRegion.bind(this);
  }

  componentDidMount() {
    this.updateRegion();
  }

  updateRegion(region) {
    if (!region) region = 'brooklyn';

    switch (region) {
      case 'manhattan':
        this.neighborhood = 'East Village';
        this.county = 'New York County';
        this.geoCounty = 'for=county:061&in=state:36';
        this.geoNeighborhood = 'for=zip+code+tabulation+area:10009';
        break;
      case 'brooklyn':
      default:
        this.neighborhood = 'Park Slope';
        this.county = 'King\'s County';
        this.geoCounty = 'for=county:047&in=state:36';
        this.geoNeighborhood = 'for=zip+code+tabulation+area:11215';
        break;
    }

    this.updateTable(region);
  }

  updateTable(region) {
    const apiBase = 'https://api.census.gov/data';
    const year = '2015';
    const dataset = 'acs5/profile';
    const vars = ['DP03_0018E', 'DP03_0019E', 'DP03_0020E'];
    const url = `${[apiBase, year, dataset].join('/')}?get=${encodeURIComponent(vars.join(','))}`;

    const urlCounty = `${url}&${this.geoCounty}`;
    const urlNeighborhood = `${url}&${this.geoNeighborhood}`;

    if (this.apiResults[region]) {
      let data;
      if (data = this.apiResults[region].neighborhoodData) {
        this.setState({
          neighborhoodData: data
        });
      } else {
        this.fetchInfo(urlNeighborhood)
        .then(json => {
          this.setState({
            neighborhoodData: json
          });
          this.apiResults[region].neighborhoodData = json;
        });
      }

      if (data = this.apiResults[region].countyData) {
        this.setState({
          countyData: data
        });
      } else {
        this.fetchInfo(urlCounty)
        .then(json => {
          this.setState({
            countyData: json
          });
          this.apiResults[region].countyData = json;
        })
      }
    } else {
      this.apiResults[region] = {};
      this.fetchInfo(urlNeighborhood)
      .then(json => {
        this.setState({
          neighborhoodData: json
        });
        this.apiResults[region].neighborhoodData = json;
      });

      this.fetchInfo(urlCounty)
      .then(json => {
        this.setState({
          countyData: json
        });
        this.apiResults[region].countyData = json;
      });
    }
  }

  fetchInfo(url) {
    return fetch(url)
    .then(res => {
      if (res.ok) {
        return res.json();
      } else throw res;
    })
    .catch(err => {
      console.error(err);
      return {};
    });
  }

  render() {
    return (
      <div className="App">
        <RegionSelect onChange={this.updateRegion} />
        <CensusTable neighborhoodData={this.state.neighborhoodData} countyData={this.state.countyData} neighborhood={this.neighborhood} county={this.county} />
      </div>
    );
  }
}

export default App;

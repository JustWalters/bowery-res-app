import React, { Component } from 'react';
import Select from './Select';
import CensusTable from './CensusTable';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { neighborhoodData: [], countyData: [] };
    this.apiResults = {};
    this.regions = [
      {
        label: 'Manhattan',
        value: 'manhattan',
        county: 'New York County',
        neighborhood: 'East Village',
        geoCounty: 'for=county:061&in=state:36',
        geoNeighborhood: 'for=zip+code+tabulation+area:10009'
      },
      {
        label: 'Brooklyn',
        value: 'brooklyn',
        county: 'King\'s County',
        neighborhood: 'Park Slope',
        geoCounty: 'for=county:047&in=state:36',
        geoNeighborhood: 'for=zip+code+tabulation+area:11215'
      }
    ];

    this.updateRegion = this.updateRegion.bind(this);
  }

  updateRegion(region) {
    let regionInfo = this.regions.find(r => region === r.value);

    if (regionInfo) {
      this.county = regionInfo.county;
      this.neighborhood = regionInfo.neighborhood;
      this.geoCounty = regionInfo.geoCounty;
      this.geoNeighborhood = regionInfo.geoNeighborhood;
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

    if (!this.apiResults[region]) {
      this.apiResults[region] = {};
    }

    this.updateState(region, 'neighborhoodData', urlNeighborhood);
    this.updateState(region, 'countyData', urlCounty);
  }

  updateState(region, dataType, url) {
    let data, newState = {};

    if (data = this.apiResults[region][dataType]) {
      newState[dataType] = data;
      this.setState(newState);
    } else {
      this.fetchInfo(url)
      .then(json => {
        if (!Object.keys(json).length) return;

        newState[dataType] = json;
        this.setState(newState);
        this.apiResults[region][dataType] = json;
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
      alert('Sorry, something went wrong. Please try refreshing.');
      return {};
    });
  }

  render() {
    return (
      <div className="App">
        <Select onChange={this.updateRegion} options={this.regions} />
        <CensusTable neighborhoodData={this.state.neighborhoodData} countyData={this.state.countyData} neighborhood={this.neighborhood} county={this.county} />
      </div>
    );
  }
}

export default App;

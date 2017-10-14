import React, { Component } from 'react';
import Table from './Table';

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

    let res = {
      commuters,
      alone,
      carpool,
      other,
      alonePercent,
      carpoolPercent,
      otherPercent
    };

    for (let key in res) {
      if (res.hasOwnProperty(key)) {
        res[key] = this.formatNumber(res[key]);
      }
    }
    return res;
  }

  formatNumber(num) {
    if (num < 1) {
      return num.toLocaleString('en-US', {style: 'percent', minimumFractionDigits: 2});
    }
    return num.toLocaleString('en-US');
  }

  render() {
    return <Table data={this.data}/>;
  }
}

export default CensusTable;

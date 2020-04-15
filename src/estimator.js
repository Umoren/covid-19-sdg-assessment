/* eslint-disable linebreak-style */
const covid19ImpactEstimator = (data) => {
  const checkPeriod = () => {
    if (data.periodType === 'days') {
      return data.timeToElapse;
    }
    if (data.periodType === 'weeks') {
      return data.timeToElapse * 7;
    }
    if (data.periodType === 'months') {
      return data.timeToElapse * 30;
    }
    return false;
  };
  const impact = data.reportedCases * 10;
  const severe = data.reportedCases * 50;
  const factor = Math.floor(checkPeriod(data) / 3);
  const impactInfectionsTime = impact * 2 ** factor;
  const severeInfectionsTime = severe * 2 ** factor;
  const impactSevereInfectionsTime = (15 / 100) * Math.floor(impactInfectionsTime);
  const severeSevereInfectionsTime = (15 / 100) * Math.floor(severeInfectionsTime);
  const totalBeds = data.totalHospitalBeds;
  const flooredBeds = ((35 / 100) * totalBeds);
  const impactHospitalBeds = Math.floor(flooredBeds - impactSevereInfectionsTime);
  const severeHospitalBeds = Math.floor(flooredBeds - severeSevereInfectionsTime);
  const impactIcuCases = (5 / 100) * impactInfectionsTime;
  const severeIcuCases = (5 / 100) * severeInfectionsTime;
  const impactVentilatorCases = (2 / 100) * impactInfectionsTime;
  const severeVentilatorCases = (2 / 100) * severeInfectionsTime;
  const avgIncomeUSD = data.region.avgDailyIncomeInUSD;
  const avgIncomePOP = data.region.avgDailyIncomeInPopulation;
  const impactDollarsFlight = impactInfectionsTime * avgIncomeUSD * avgIncomePOP * checkPeriod();
  const severeDollarsFlight = severeInfectionsTime * avgIncomeUSD * avgIncomePOP * checkPeriod();
  const result = {
    data: 'data',
    impact: {
      currentlyInfected: impact,
      infectionsByRequestedTime: impactInfectionsTime,
      severeCasesByRequestedTime: impactSevereInfectionsTime,
      hospitalBedsByRequestedTime: impactHospitalBeds,
      casesForICUByRequestedTime: impactIcuCases,
      casesForVentilatorsByRequestedTime: impactVentilatorCases,
      dollarsInFlight: impactDollarsFlight
    },
    severeImpact: {
      currentlyInfected: severe,
      infectionsByRequestedTime: severeInfectionsTime,
      severeCasesByRequestedTime: severeSevereInfectionsTime,
      hospitalBedsByRequestedTime: severeHospitalBeds,
      casesForICUByRequestedTime: severeIcuCases,
      casesForVentilatorsByRequestedTime: severeVentilatorCases,
      dollarsInFlight: severeDollarsFlight
    }
  };
  return result;
};

export default covid19ImpactEstimator;

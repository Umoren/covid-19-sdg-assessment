/* eslint-disable linebreak-style */
/* global floor */
const checkPeriod = (data) => {
    const dateType = data.periodType;
    const actualPeriod = 'timeToElapse';
    if (dateType === 'days') {
      return actualPeriod;
    } if (dateType === 'weeks') {
      return actualPeriod * 7;
    } if (dateType === 'months') {
      return actualPeriod * 30;
    }
    return false;
  };
  
  const covid19ImpactEstimator = (data) => {
    const impact = data.reportedCases * 10;
    const severe = data.reportedCases * 50;
    const factor = floor(checkPeriod(data) / 3);
    const impactInfectionsTime = impact * 2 ** factor;
    const severeInfectionsTime = severe * 2 ** factor;
    const impactSevereInfectionsTime = (15 / 100) * impactInfectionsTime;
    const severeSevereInfectionsTime = (15 / 100) * severeInfectionsTime;
    const totalBeds = data.totalHospitalBeds;
    const impactHospitalBeds = (35 / 100) * (totalBeds - impactSevereInfectionsTime);
    const severeHospitalBeds = (35 / 100) * (totalBeds - severeSevereInfectionsTime);
    const impactIcuCases = (5 / 100) * impactInfectionsTime;
    const severeIcuCases = (5 / 100) * severeInfectionsTime;
    const impactVentilatorCases = (2 / 100) * impactInfectionsTime;
    const severeVentilatorCases = (2 / 100) * severeInfectionsTime;
    const avgIncomeUSD = data.region.avgDailyIncomeInUSD;
    const avgIncomePOP = data.region.avgDailyIncomeInPopulation;
    const impactDollarsFlight = (impactInfectionsTime * avgIncomeUSD * avgIncomePOP * checkPeriod());
    const severeDollarsFlight = (severeInfectionsTime * avgIncomeUSD * avgIncomePOP * checkPeriod());
    const result = {
      data: 'data',
      impact: {
        currentlyInfected: data.impact,
        infectionsByRequestedTime: data.impactInfectionsTime,
        severeCasesByRequestedTime: data.impactSevereInfectionsTime,
        hospitalBedsByRequestedTime: data.impactHospitalBeds,
        casesForICUByRequestedTime: data.impactIcuCases,
        casesForVentilatorsByRequestedTime: data.impactVentilatorCases,
        dollarsInFlight: data.impactDollarsFlight
      },
      severeImpact: {
        currentlyInfected: data.severe,
        infectionsByRequestedTime: data.severeInfectionsTime,
        severeCasesByRequestedTime: data.severeSevereInfectionsTime,
        hospitalBedsByRequestedTime: data.severeHospitalBeds,
        casesForICUByRequestedTime: data.severeIcuCases,
        casesForVentilatorsByRequestedTime: data.severeVentilatorCases,
        dollarsInFlight: data.severeDollarsFlight
      }
    };
    return result;
  };
  
  export default covid19ImpactEstimator;
  
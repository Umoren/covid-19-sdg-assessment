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
  const period = checkPeriod(data);
  const factor = Math.trunc(checkPeriod(data) / 3);
  const impactInfectionsTime = impact * (2 ** factor);
  const severeInfectionsTime = severe * (2 ** factor);
  const impactSevereInfectionsTime = Math.trunc(0.15 * impactInfectionsTime);
  const severeSevereInfectionsTime = Math.trunc(0.15 * severeInfectionsTime);
  const totalBeds = data.totalHospitalBeds;
  const impactHospitalBeds = Math.trunc((0.35 * totalBeds) - impactSevereInfectionsTime);
  const severeHospitalBeds = Math.trunc((0.35 * totalBeds) - severeSevereInfectionsTime);
  const impactIcuCases = Math.trunc(0.05 * impactInfectionsTime);
  const severeIcuCases = Math.trunc(0.05 * severeInfectionsTime);
  const impactVentilatorCases = Math.trunc(0.02 * impactInfectionsTime);
  const severeVentilatorCases = Math.trunc(0.02 * severeInfectionsTime);
  const avgUSD = data.region.avgDailyIncomeInUSD;
  const avgPOP = data.region.avgDailyIncomePopulation;
  const impactDollarsFlight = Math.trunc(impactInfectionsTime * avgPOP * avgUSD * period);
  const severeDollarsFlight = Math.trunc(severeInfectionsTime * avgPOP * avgUSD * period);
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

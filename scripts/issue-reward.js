const FarmOne = artifacts.require("FarmOne");
const FarmTwo = artifacts.require("FarmTwo");
const FarmThree = artifacts.require("FarmThree");

module.exports = async function(callback) {
  let farmOne = await FarmOne.deployed();
  let farmTwo = await FarmTwo.deployed();
  let farmThree = await FarmThree.deployed();
  await farmOne.issueReward();
  await farmTwo.issueReward();
  await farmThree.issueReward();
  console.log("Tokens issued!");
  callback();
};

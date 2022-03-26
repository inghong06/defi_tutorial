const FarmOne = artifacts.require('FarmOne')
const FarmTwo = artifacts.require('FarmTwo')
const FarmThree = artifacts.require('FarmThree')
const SolidTokenOne = artifacts.require('SolidTokenOne')
const SolidTokenTwo = artifacts.require('SolidTokenTwo')
const SolidTokenThree = artifacts.require('SolidTokenThree')
const RewardToken = artifacts.require('RewardToken')

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

module.exports = async function(deployer, network, accounts) {
  // Deploy solidtoken1
  await deployer.deploy(SolidTokenOne)
  await deployer.deploy(SolidTokenTwo)
  await deployer.deploy(SolidTokenThree)
  const solidTokenOne = await SolidTokenOne.deployed()
  const solidTokenTwo = await SolidTokenTwo.deployed()
  const solidTokenThree = await SolidTokenThree.deployed()

  // Deploy Dapp Token
  await deployer.deploy(RewardToken)
  const rewardToken = await RewardToken.deployed()

  // Deploy TokenFarms
  await deployer.deploy(FarmOne, solidTokenOne.address, rewardToken.address)
  await deployer.deploy(FarmTwo, solidTokenTwo.address, rewardToken.address)
  await deployer.deploy(FarmThree, solidTokenThree.address, rewardToken.address)
  const farmOne = await FarmOne.deployed()
  const farmTwo = await FarmTwo.deployed()
  const farmThree = await FarmThree.deployed()

  // Transfer all reward tokens to TokenFarms (1 million each)
  await rewardToken.transfer(farmOne.address, tokens('1000000'))
  await rewardToken.transfer(farmTwo.address, tokens('1000000'))
  await rewardToken.transfer(farmThree.address, tokens('1000000'))

  // Transfer 100 solidtoken1 tokens to investor
  await solidTokenOne.mint(tokens('100'), {from:accounts[1]})
  await solidTokenOne.mint(tokens('100'), {from:accounts[2]})
  await solidTokenTwo.mint(tokens('100'), {from:accounts[1]})
  await solidTokenTwo.mint(tokens('100'), {from:accounts[2]})
  await solidTokenThree.mint(tokens('100'), {from:accounts[1]})
  await solidTokenThree.mint(tokens('100'), {from:accounts[2]})
}
const { assert } = require("chai");

const SolidTokenTwo = artifacts.require("SolidTokenTwo");
const RewardToken = artifacts.require("RewardToken");
const FarmTwo = artifacts.require("FarmTwo");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("FarmTwo", ([owner, investor, investor2]) => {
  let solidTokenTwo, rewardToken, farmTwo;

  before(async () => {
    //load contract
    solidTokenTwo = await SolidTokenTwo.new();
    rewardToken = await RewardToken.new();
    farmTwo = await FarmTwo.new(solidTokenTwo.address, rewardToken.address);

    // mint some SolidTokenTwo tokens to investor
    await solidTokenTwo.mint(tokens("1000"), { from: investor });
    await solidTokenTwo.mint(tokens("1000"), { from: investor2 });

    //transfer reward token to tp farm contract
    await rewardToken.transfer(farmTwo.address, tokens("1000000"));
  });

  // test contract deployment
  describe("solidTokenTwo deployment", async () => {
    it("has a name", async () => {
      const name = await solidTokenTwo.name();
      assert.equal(name, "Solid Token Two");
    });
  });

  describe("Reward Token deployment", async () => {
    it("has a name", async () => {
      const name = await rewardToken.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has a name", async () => {
      const name = await farmTwo.name();
      assert.equal(name, "Farm Two");
    });
  });

  //test farm and investor initial balances
  describe("Token Farm balances", async () => {
    it("has 1 million reward tokens", async () => {
      const result = await rewardToken.balanceOf(farmTwo.address);
      assert.equal(result.toString(), tokens("1000000"));
    });
  });

  describe("Investor 1 LP token Balance", async () => {
    it("has 1000 LP tokens", async () => {
      const result = await solidTokenTwo.balanceOf(investor);
      assert.equal(result.toString(), tokens("1000"));
    });
  });

  describe("Investor 2 LP token Balance", async () => {
    it("has 1000 LP tokens", async () => {
      const result = await solidTokenTwo.balanceOf(investor2);
      assert.equal(result.toString(), tokens("1000"));
    });
  });

  // test staking

  describe("Farming Token", async () => {
    it("stake 100 tokens", async () => {
      let result;

      // approve and stake 100 LP tokens
      await solidTokenTwo.approve(farmTwo.address, tokens("100"), {
        from: investor,
      });
      await farmTwo.stake(tokens("100"), { from: investor });
      await solidTokenTwo.approve(farmTwo.address, tokens("150"), {
        from: investor2,
      });
      await farmTwo.stake(tokens("150"), { from: investor2 });

      // check staking results
      result = await solidTokenTwo.balanceOf(investor);
      assert.equal(result.toString(), tokens("900"));

      result = await solidTokenTwo.balanceOf(investor2);
      assert.equal(result.toString(), tokens("850"));

      result = await farmTwo.stakingBalance(investor);
      assert.equal(result.toString(), tokens("100"));

      result = await farmTwo.stakingBalance(investor2);
      assert.equal(result.toString(), tokens("150"));

      result = await farmTwo.totalPool();
      assert.equal(result.toString(), tokens("250"));
    });
  });

  describe("Collect reward", async () => {
    it("Check reward per block and block per day", async () => {
      let result;

      //check stake duration
      result = await farmTwo.stakeDuration(investor);
      assert.equal(result.toString(), "1");

      // check reward per block
      result = await farmTwo.rewardPerBlock();
      assert.equal(result.toString(), tokens("30"));

      // check block per day
      result = await farmTwo.blockPerDay();
      assert.equal(result.toString(), "1");

      //calculate reward for investor
      result = await farmTwo.calculateReward(investor);
      assert.equal(result.toString(), tokens("12"));

      //calculate reward for investor 2
      result = await farmTwo.calculateReward(investor2);
      assert.equal(result.toString(), tokens("18"));
    });

    it("Distribute reward to all stakers", async () => {
      let result;

      // Issue Tokens
      await farmTwo.issueReward({ from: owner });

      //Check investor reward token balance
      result = await rewardToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("12"));

      result = await rewardToken.balanceOf(investor2);
      assert.equal(result.toString(), tokens("18"));

      // check farm balance for reward token
      result = await rewardToken.balanceOf(farmTwo.address);
      assert.equal(result.toString(), tokens("999970"));
    });
  });

  describe("Unstake Token", async () => {
    it("Check investor balances and staking status", async () => {
      let result;

      // unstake lp token
      await farmTwo.unstake({from:investor});

      //check investor lp balance
      result = await solidTokenTwo.balanceOf(investor);
      assert.equal(result.toString(), tokens("1000"));

      //check lp pool
      result = await farmTwo.totalPool();
      assert.equal(result.toString(), tokens("150"));
    });

    it("distribute reward after 1 staker unstaked", async () => {
      let result;

      // Issue Tokens
      await farmTwo.issueReward({ from: owner });

      //investor have 20 from 1st issue and 0 from 2nd issue
      result = await rewardToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("12"));

      // investor 2 should have 80 because he collected 30 from first issue and then 50 from 2nd issue
      result = await rewardToken.balanceOf(investor2);
      assert.equal(result.toString(), tokens("48"));

      // check farm balance for reward token
      result = await rewardToken.balanceOf(farmTwo.address);
      assert.equal(result.toString(), tokens("999940"));
    });
    
  });
}



);

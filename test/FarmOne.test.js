const { assert } = require("chai");

const SolidTokenOne = artifacts.require("SolidTokenOne");
const RewardToken = artifacts.require("RewardToken");
const FarmOne = artifacts.require("FarmOne");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("FarmOne", ([owner, investor, investor2]) => {
  let solidTokenOne, rewardToken, farmOne;

  before(async () => {
    //load contract
    solidTokenOne = await SolidTokenOne.new();
    rewardToken = await RewardToken.new();
    farmOne = await FarmOne.new(solidTokenOne.address, rewardToken.address);

    // mint some SolidTokenOne tokens to investor
    await solidTokenOne.mint(tokens("1000"), { from: investor });
    await solidTokenOne.mint(tokens("1000"), { from: investor2 });

    //transfer reward token to tp farm contract
    await rewardToken.transfer(farmOne.address, tokens("1000000"));
  });

  // test contract deployment
  describe("solidTokenOne deployment", async () => {
    it("has a name", async () => {
      const name = await solidTokenOne.name();
      assert.equal(name, "Solid Token One");
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
      const name = await farmOne.name();
      assert.equal(name, "Farm One");
    });
  });

  //test farm and investor initial balances
  describe("Token Farm balances", async () => {
    it("has 1 million reward tokens", async () => {
      const result = await rewardToken.balanceOf(farmOne.address);
      assert.equal(result.toString(), tokens("1000000"));
    });
  });

  describe("Investor 1 LP token Balance", async () => {
    it("has 1000 LP tokens", async () => {
      const result = await solidTokenOne.balanceOf(investor);
      assert.equal(result.toString(), tokens("1000"));
    });
  });

  describe("Investor 2 LP token Balance", async () => {
    it("has 1000 LP tokens", async () => {
      const result = await solidTokenOne.balanceOf(investor2);
      assert.equal(result.toString(), tokens("1000"));
    });
  });

  // test staking

  describe("Farming Token", async () => {
    it("stake 100 tokens", async () => {
      let result;

      // approve and stake 100 LP tokens
      await solidTokenOne.approve(farmOne.address, tokens("100"), {
        from: investor,
      });
      await farmOne.stake(tokens("100"), { from: investor });
      await solidTokenOne.approve(farmOne.address, tokens("150"), {
        from: investor2,
      });
      await farmOne.stake(tokens("150"), { from: investor2 });

      // check staking results
      result = await solidTokenOne.balanceOf(investor);
      assert.equal(result.toString(), tokens("900"));

      result = await solidTokenOne.balanceOf(investor2);
      assert.equal(result.toString(), tokens("850"));

      result = await farmOne.stakingBalance(investor);
      assert.equal(result.toString(), tokens("100"));

      result = await farmOne.stakingBalance(investor2);
      assert.equal(result.toString(), tokens("150"));

      result = await farmOne.totalPool();
      assert.equal(result.toString(), tokens("250"));
    });
  });

  describe("Collect reward", async () => {
    it("Check reward per block and block per day", async () => {
      let result;

      //check stake duration
      result = await farmOne.stakeDuration(investor);
      assert.equal(result.toString(), "1");

      // check reward per block
      result = await farmOne.rewardPerBlock();
      assert.equal(result.toString(), tokens("50"));

      // check block per day
      result = await farmOne.blockPerDay();
      assert.equal(result.toString(), "1");

      //calculate reward for investor
      result = await farmOne.calculateReward(investor);
      assert.equal(result.toString(), tokens("20"));

      //calculate reward for investor 2
      result = await farmOne.calculateReward(investor2);
      assert.equal(result.toString(), tokens("30"));
    });

    it("Distribute reward to all stakers", async () => {
      let result;

      // Issue Tokens
      await farmOne.issueReward({ from: owner });

      //Check investor reward token balance
      result = await rewardToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("20"));

      result = await rewardToken.balanceOf(investor2);
      assert.equal(result.toString(), tokens("30"));

      // check farm balance for reward token
      result = await rewardToken.balanceOf(farmOne.address);
      assert.equal(result.toString(), tokens("999950"));
    });
  });

  describe("Unstake Token", async () => {
    it("Check investor balances and staking status", async () => {
      let result;

      // unstake lp token
      await farmOne.unstake({from:investor});

      //check investor lp balance
      result = await solidTokenOne.balanceOf(investor);
      assert.equal(result.toString(), tokens("1000"));

      //check lp pool
      result = await farmOne.totalPool();
      assert.equal(result.toString(), tokens("150"));
    });

    it("distribute reward after 1 staker unstaked", async () => {
      let result;

      // Issue Tokens
      await farmOne.issueReward({ from: owner });

      //investor have 20 from 1st issue and 0 from 2nd issue
      result = await rewardToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("20"));

      // investor 2 should have 80 because he collected 30 from first issue and then 50 from 2nd issue
      result = await rewardToken.balanceOf(investor2);
      assert.equal(result.toString(), tokens("80"));

      // check farm balance for reward token
      result = await rewardToken.balanceOf(farmOne.address);
      assert.equal(result.toString(), tokens("999900"));
    });
    
  });
}



);

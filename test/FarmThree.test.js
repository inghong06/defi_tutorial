const { assert } = require("chai");

const SolidTokenThree = artifacts.require("SolidTokenThree");
const RewardToken = artifacts.require("RewardToken");
const FarmThree = artifacts.require("FarmThree");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("FarmThree", ([owner, investor, investor2]) => {
  let solidTokenThree, rewardToken, farmThree;

  before(async () => {
    //load contract
    solidTokenThree = await SolidTokenThree.new();
    rewardToken = await RewardToken.new();
    farmThree = await FarmThree.new(
      solidTokenThree.address,
      rewardToken.address
    );

    // mint some SolidTokenThree tokens to investor
    await solidTokenThree.mint(tokens("1000"), { from: investor });
    await solidTokenThree.mint(tokens("1000"), { from: investor2 });

    //transfer reward token to tp farm contract
    await rewardToken.transfer(farmThree.address, tokens("1000000"));
  });

  // test contract deployment
  describe("solidTokenThree deployment", async () => {
    it("has a name", async () => {
      const name = await solidTokenThree.name();
      assert.equal(name, "Solid Token Three");
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
      const name = await farmThree.name();
      assert.equal(name, "Farm Three");
    });
  });

  //test farm and investor initial balances
  describe("Token Farm balances", async () => {
    it("has 1 million reward tokens", async () => {
      const result = await rewardToken.balanceOf(farmThree.address);
      assert.equal(result.toString(), tokens("1000000"));
    });
  });

  describe("Investor 1 LP token Balance", async () => {
    it("has 1000 LP tokens", async () => {
      const result = await solidTokenThree.balanceOf(investor);
      assert.equal(result.toString(), tokens("1000"));
    });
  });

  describe("Investor 2 LP token Balance", async () => {
    it("has 1000 LP tokens", async () => {
      const result = await solidTokenThree.balanceOf(investor2);
      assert.equal(result.toString(), tokens("1000"));
    });
  });

  // test staking

  describe("Farming Token", async () => {
    it("stake 100 tokens", async () => {
      let result;

      // approve and stake 100 LP tokens
      await solidTokenThree.approve(farmThree.address, tokens("100"), {
        from: investor,
      });
      await farmThree.stake(tokens("100"), { from: investor });
      await solidTokenThree.approve(farmThree.address, tokens("150"), {
        from: investor2,
      });
      await farmThree.stake(tokens("150"), { from: investor2 });

      // check staking results
      result = await solidTokenThree.balanceOf(investor);
      assert.equal(result.toString(), tokens("900"));

      result = await solidTokenThree.balanceOf(investor2);
      assert.equal(result.toString(), tokens("850"));

      result = await farmThree.stakingBalance(investor);
      assert.equal(result.toString(), tokens("100"));

      result = await farmThree.stakingBalance(investor2);
      assert.equal(result.toString(), tokens("150"));

      result = await farmThree.totalPool();
      assert.equal(result.toString(), tokens("250"));
    });
  });

  describe("Collect reward", async () => {
    it("Check reward per block and block per day", async () => {
      let result;

      //check stake duration
      result = await farmThree.stakeDuration(investor);
      assert.equal(result.toString(), "1");

      // check reward per block
      result = await farmThree.rewardPerBlock();
      assert.equal(result.toString(), tokens("20"));

      // check block per day
      result = await farmThree.blockPerDay();
      assert.equal(result.toString(), "1");

      //calculate reward for investor
      result = await farmThree.calculateReward(investor);
      assert.equal(result.toString(), tokens("8"));

      //calculate reward for investor 2
      result = await farmThree.calculateReward(investor2);
      assert.equal(result.toString(), tokens("12"));
    });

    it("Distribute reward to all stakers", async () => {
      let result;

      // Issue Tokens
      await farmThree.issueReward({ from: owner });

      //Check investor reward token balance
      result = await rewardToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("8"));

      result = await rewardToken.balanceOf(investor2);
      assert.equal(result.toString(), tokens("12"));

      // check farm balance for reward token
      result = await rewardToken.balanceOf(farmThree.address);
      assert.equal(result.toString(), tokens("999980"));
    });
  });

  describe("Unstake Token", async () => {
    it("Check investor balances and staking status", async () => {
      let result;

      // unstake lp token
      await farmThree.unstake({ from: investor });

      //check investor lp balance
      result = await solidTokenThree.balanceOf(investor);
      assert.equal(result.toString(), tokens("1000"));

      //check lp pool
      result = await farmThree.totalPool();
      assert.equal(result.toString(), tokens("150"));
    });

    it("distribute reward after 1 staker unstaked", async () => {
      let result;

      // Issue Tokens
      await farmThree.issueReward({ from: owner });

      //investor have 20 from 1st issue and 0 from 2nd issue
      result = await rewardToken.balanceOf(investor);
      assert.equal(result.toString(), tokens("8"));

      // investor 2 should have 80 because he collected 30 from first issue and then 50 from 2nd issue
      result = await rewardToken.balanceOf(investor2);
      assert.equal(result.toString(), tokens("32"));

      // check farm balance for reward token
      result = await rewardToken.balanceOf(farmThree.address);
      assert.equal(result.toString(), tokens("999960"));
    });
  });
});

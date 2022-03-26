//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SolidTokenTwo.sol";
import "./RewardToken.sol";

contract FarmTwo {
    uint256 public blockPerDay;
    uint256 public rewardPerBlock;
    uint256 public totalPool;
    uint256 public totalRewardAllocated;
    address public owner;

    address[] public stakers;
    mapping(address => uint256) public stakeDate;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    mapping(address => uint256) public entitledReward;
    SolidTokenTwo solidTokenTwo;
    RewardToken rewardToken;

    string public name = "Farm Two";

    constructor(SolidTokenTwo _solidTokenTwo, RewardToken _rewardToken) {
        owner = msg.sender;
        blockPerDay = 1;
        rewardPerBlock = 30 * 10**18;
        solidTokenTwo = _solidTokenTwo;
        rewardToken = _rewardToken;
    }

    function stake(uint256 _amount) public {
        require(_amount > 0, "Amount cannot be less than 0");

        // transfer LP to contract for staking
        solidTokenTwo.transferFrom(msg.sender, address(this), _amount);

        // update staking balance and total pool
        stakingBalance[msg.sender] += _amount;
        totalPool += _amount;

        // Update staking status
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
        stakeDate[msg.sender] = block.timestamp;
    }

    function unstake() public {
        uint256 balance = stakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        solidTokenTwo.transfer(msg.sender, balance);

        // Adjust staking balance
        stakingBalance[msg.sender] = 0;
        totalPool -= balance;

        // Update staking status
        isStaking[msg.sender] = false;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "owner only");
        _;
    }

    function issueReward() public onlyOwner {
        // Transfer reward tokens to stakers
        for (uint256 i = 0; i < stakers.length; i++) {
            if (stakingBalance[stakers[i]] > 0) {
                //distribute reward token to stakers
                rewardToken.transfer(stakers[i], calculateReward(stakers[i]));

                // change stake date to reward collection timestamp
                stakeDate[stakers[i]] = block.timestamp;
            }
        }
    }

    function calculateReward(address _stakerAddress)
        public
        view
        returns (uint256)
    {
        uint256 reward = (stakingBalance[_stakerAddress] *
            stakeDuration(_stakerAddress) *
            rewardPerBlock *
            blockPerDay) / totalPool;

        return reward;
    }

    // stake duration starts with 1 so staker can farm reward on first day
    function stakeDuration(address _stakerAddress)
        public
        view
        returns (uint256)
    {
        return ((block.timestamp - stakeDate[_stakerAddress]) / 1 days) + 1;
    }
}

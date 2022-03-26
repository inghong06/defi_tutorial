import React, { useState } from "react";
import "./stakingCard.css";

const StakingCard = ({
  poolName,
  stakedToken,
  stakeTokenBalance,
  stakingBalance,
  stakeTokens,
  unstakeTokens,
  rewardPerBlock,
  farmContractAddress,
  rewardBalance
}) => {
  const [stakeAmount, setStakeAmount] = useState("0");

  const handleStake = (event) => {
    event.preventDefault();
    let amount;
    amount = window.web3.utils.toWei(stakeAmount, "Ether");
    stakeTokens(amount);
  };

  const handleUnstake = (event) => {
    event.preventDefault();
    unstakeTokens();
  };

  return (
    <div className="card">
      <div className="card-title">
        <a href={farmContractAddress} rel="noreferrer" target="blank">
          <h2>{poolName}</h2>
        </a>
      </div>
      <div className="card-header">
        <div className="card-header-row">
          <p>
            Staked Amount: {window.web3.utils.fromWei(stakingBalance, "Ether")}
          </p>
          <p>
            {stakedToken} balance:
            {window.web3.utils.fromWei(stakeTokenBalance, "Ether")}
          </p>
        </div>
        <div className="card-header-row">
        <p>
            Reward Token in Pool:{" "}
            {window.web3.utils.fromWei(rewardBalance, "Ether")}
          </p>
          <p>
            Reward per Block:{" "}
            {window.web3.utils.fromWei(rewardPerBlock, "Ether")}
          </p>
        </div>
      </div>

      <div className="card-body">
        <form onSubmit={handleStake}>
          <div className="form">
            <input
              type="text"
              className="input-field"
              placeholder="0"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
            />
            <button type="submit">Stake</button>
          </div>
        </form>
        <button onClick={handleUnstake}>Unstake</button>
      </div>
    </div>
  );
};

export default StakingCard;

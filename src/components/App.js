import React, { Component } from "react";
import Web3 from "web3";
import Navbar from "./Navbar";
import StakingCard from "./StakingCard";
import "./app.css";
import {
  farmOneAbi,
  farmTwoAbi,
  farmThreeAbi,
  rewardTokenAbi,
  solidTokenOneAbi,
  solidTokenTwoAbi,
  solidTokenThreeAbi,
  farmOneAddress,
  farmTwoAddress,
  farmThreeAddress,
  rewardTokenAddress,
  solidTokenOneAddress,
  solidTokenThreeAddress,
  solidTokenTwoAddress,
} from "../utils/constants";

class App extends Component {
  
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Load SolidTokenOne
    const solidTokenOne = new web3.eth.Contract(
      solidTokenOneAbi,
      solidTokenOneAddress
    );

    this.setState({ solidTokenOne });
    let solidTokenOneBalance = await solidTokenOne.methods
      .balanceOf(this.state.account)
      .call();
    this.setState({ solidTokenOneBalance: solidTokenOneBalance.toString() });

    // Load SolidTokenTwo

    const solidTokenTwo = new web3.eth.Contract(
      solidTokenTwoAbi,
      solidTokenTwoAddress
    );
    this.setState({ solidTokenTwo });
    let solidTokenTwoBalance = await solidTokenTwo.methods
      .balanceOf(this.state.account)
      .call();
    this.setState({ solidTokenTwoBalance: solidTokenTwoBalance.toString() });

    // Load SolidTokenThree

    const solidTokenThree = new web3.eth.Contract(
      solidTokenThreeAbi,
      solidTokenThreeAddress
    );
    this.setState({ solidTokenThree });
    let solidTokenThreeBalance = await solidTokenThree.methods
      .balanceOf(this.state.account)
      .call();
    this.setState({
      solidTokenThreeBalance: solidTokenThreeBalance.toString(),
    });

    // Load RewardToken

    const rewardToken = new web3.eth.Contract(
      rewardTokenAbi,
      rewardTokenAddress
    );
    this.setState({ rewardToken });
    let rewardTokenBalance = await rewardToken.methods
      .balanceOf(this.state.account)
      .call();
    this.setState({ rewardTokenBalance: rewardTokenBalance.toString() });

    // Load FarmOne

    const farmOne = new web3.eth.Contract(  farmOneAbi
      , farmOneAddress);
    this.setState({ farmOne });
    let farmOneStakingBalance = await farmOne.methods
      .stakingBalance(this.state.account)
      .call();
    let farmOneRewardPerBlock = await farmOne.methods.rewardPerBlock().call()
    let farmOneRewardBalance = await rewardToken.methods.balanceOf(farmOneAddress).call()
    this.setState({farmOneRewardBalance: farmOneRewardBalance.toString()})
    this.setState({farmOneRewardPerBlock: farmOneRewardPerBlock.toString()})
    this.setState({
      farmOneStakingBalance: farmOneStakingBalance.toString(),
    });

    
    
    // Load FarmTwo

    const farmTwo = new web3.eth.Contract(farmTwoAbi, farmTwoAddress);
    this.setState({ farmTwo });
    let farmTwoStakingBalance = await farmTwo.methods
      .stakingBalance(this.state.account)
      .call();
      let farmTwoRewardPerBlock = await farmTwo.methods.rewardPerBlock().call()
      let farmTwoRewardBalance = await rewardToken.methods.balanceOf(farmTwoAddress).call()
    this.setState({farmTwoRewardBalance: farmTwoRewardBalance.toString()})
    this.setState({farmTwoRewardPerBlock: farmTwoRewardPerBlock.toString()})
    this.setState({
      farmTwoStakingBalance: farmTwoStakingBalance.toString(),
    });

    // Load FarmThree

    const farmThree = new web3.eth.Contract(farmThreeAbi, farmThreeAddress);
    this.setState({ farmThree });
    let farmThreeStakingBalance = await farmThree.methods
      .stakingBalance(this.state.account)
      .call();
      let farmThreeRewardPerBlock = await farmThree.methods.rewardPerBlock().call()
      let farmThreeRewardBalance = await rewardToken.methods.balanceOf(farmThreeAddress).call()
    this.setState({farmThreeRewardBalance: farmThreeRewardBalance.toString()})
    this.setState({farmThreeRewardPerBlock: farmThreeRewardPerBlock.toString()})
    this.setState({
      farmThreeStakingBalance: farmThreeStakingBalance.toString(),
    });

    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  // stake and unstake
  stakeSolidTokenOne = (amount) => {
    this.state.solidTokenOne.methods
      .approve(this.state.farmOne._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.farmOne.methods
          .stake(amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
          });
      });
  };

  unStakeSolidTokenOne = () => {
    this.state.farmOne.methods
      .unstake()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
      });
  };

  stakeSolidTokenTwo = (amount) => {
    this.state.solidTokenTwo.methods
      .approve(this.state.farmTwo._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.farmTwo.methods
          .stake(amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
          });
      });
  };

  unStakeSolidTokenTwo = () => {
    this.state.farmTwo.methods
      .unstake()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
      });
  };

  stakeSolidTokenThree = (amount) => {
    this.state.solidTokenThree.methods
      .approve(this.state.farmThree._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.farmThree.methods
          .stake(amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
          });
      });
  };

  unStakeSolidTokenThree = () => {
    this.state.farmThree.methods
      .unstake()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      solidTokenOne: {},
      solidTokenTwo: {},
      solidTokenThree: {},
      rewardToken: {},
      farmOne: {},
      farmTwo: {},
      farmThree: {},
      solidTokenOneBalance: "0",
      solidTokenTwoBalance: "0",
      solidTokenThreeBalance: "0",
      rewardTokenBalance: "0",
      farmOneStakingBalance: "0",
      farmTwoStakingBalance: "0",
      farmThreeStakingBalance: "0",
      farmOneRewardPerBlock:'0',
      farmTwoRewardPerBlock:'0',
      farmThreeRewardPerBlock:'0',
      farmOneRewardBalance:'0',
      farmTwoRewardBalance:'0',
      farmThreeRewardBalance:'0',
      
      loading: true,
    };
  }

  render() {
    //mint
    // mintSolidTokenOne = () => {
    //   this.state.solidTokenOne.methods
    //     .mint(window.web3.utils.toWei("1000", "Ether"))
    //     .send({ from: this.state.account });
    // };

    // mintSolidTokenTwo = () => {
    //   this.state.solidTokenTwo.methods
    //     .mint(window.web3.utils.toWei("1000", "Ether"))
    //     .send({ from: this.state.account });
    // };

    // mintSolidTokenThree = () => {
    //   this.state.solidTokenThree.methods
    //     .mint(window.web3.utils.toWei("1000", "Ether"))
    //     .send({ from: this.state.account });
    // };

    // // handle click

    // handleMintSolidTokenOne = (event) => {
    //   event.preventDefault();
    //   mintSolidTokenOne();
    // };

    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    } else {
      content = (
        <div>
          <div>
            <p>Welcome to LP token farm</p>
            <p>
              In this farm, You can stake 3 different LP tokens to earn Reward
              Token
            </p>
            <p></p>
          </div>
          <div className="button-set">
            <button
              className="button"
              onClick={(event) => {
                event.preventDefault();
                this.state.solidTokenOne.methods
                  .mint(window.web3.utils.toWei("1000", "Ether"))
                  .send({ from: this.state.account });
              }}
            >
              Mint 1000 ST1
            </button>
            <button className="button" onClick={(event) => {
                event.preventDefault();
                this.state.solidTokenTwo.methods
                  .mint(window.web3.utils.toWei("1000", "Ether"))
                  .send({ from: this.state.account });
              }}>
              Mint 1000 ST2
            </button>
            <button className="button" onClick={(event) => {
                event.preventDefault();
                this.state.solidTokenThree.methods
                  .mint(window.web3.utils.toWei("1000", "Ether"))
                  .send({ from: this.state.account });
              }}>
              Mint 1000 ST3
            </button>
          </div>
          <div className="reward-token">
            <p>
              Reward Token Balance:{" "}
              {window.web3.utils.fromWei(
                this.state.rewardTokenBalance,
                "Ether"
              )}
            </p>
          </div>
          <div className="card-container">
            <StakingCard
              poolName={"Farm One"}
              stakedToken={"ST1"}
              farmContractAddress={"https://rinkeby.etherscan.io/address/0xa363913a7cfdf31a479e24faa1801dfd0f438d66"}
              stakeTokenBalance={this.state.solidTokenOneBalance}
              stakingBalance={this.state.farmOneStakingBalance}
              stakeTokens={this.stakeSolidTokenOne}
              unstakeTokens={this.unStakeSolidTokenOne}
              rewardPerBlock={this.state.farmOneRewardPerBlock}
              rewardBalance={this.state.farmOneRewardBalance}
            />

            <StakingCard
              poolName={"Farm Two"}
              stakedToken={"ST2"}
              farmContractAddress={"https://rinkeby.etherscan.io/address/0x21ebc501eff1b1aaeea226cb5ee977448547996b"}
              stakeTokenBalance={this.state.solidTokenTwoBalance}
              stakingBalance={this.state.farmTwoStakingBalance}
              stakeTokens={this.stakeSolidTokenTwo}
              unstakeTokens={this.unStakeSolidTokenTwo}
              rewardPerBlock={this.state.farmTwoRewardPerBlock}
              rewardBalance={this.state.farmTwoRewardBalance}
            />

            <StakingCard
              poolName={"Farm Three"}
              stakedToken={"ST3"}
              farmContractAddress={"https://rinkeby.etherscan.io/address/0xbb2a72f9e30efd8a7485a6ba72791250083c2079"}
              stakeTokenBalance={this.state.solidTokenThreeBalance}
              stakingBalance={this.state.farmThreeStakingBalance}
              stakeTokens={this.stakeSolidTokenThree}
              unstakeTokens={this.unStakeSolidTokenThree}
              rewardPerBlock={this.state.farmThreeRewardPerBlock}
              rewardBalance={this.state.farmThreeRewardBalance}
            />
          </div>
        </div>
      );
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">{content}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

import build from "./build.json";

//abi
const {
  output: {
    contracts: {
      "contracts/FarmOne.sol": FarmOne,
      "contracts/FarmTwo.sol": FarmTwo,
      "contracts/FarmThree.sol": FarmThree,
      "contracts/RewardToken.sol": RewardToken,
      "contracts/SolidTokenOne.sol": SolidTokenOne,
      "contracts/SolidTokenTwo.sol": SolidTokenTwo,
      "contracts/SolidTokenThree.sol": SolidTokenThree,
    },
  },
} = build;

const {FarmOne: {abi: FarmOneABI}} = FarmOne;
const {FarmTwo: {abi: FarmTwoABI}} = FarmTwo;
const {FarmThree: {abi: FarmThreeABI}} = FarmThree;
const {RewardToken: {abi: RewardTokenABI}} = RewardToken;
const {SolidTokenOne: {abi: SolidTokenOneABI}} = SolidTokenOne;
const {SolidTokenTwo: {abi: SolidTokenTwoABI}} = SolidTokenTwo;
const {SolidTokenThree: {abi: SolidTokenThreeABI}} = SolidTokenThree;

// export abi
export const farmOneAbi = FarmOneABI
export const farmTwoAbi = FarmTwoABI
export const farmThreeAbi = FarmThreeABI
export const rewardTokenAbi = RewardTokenABI
export const solidTokenOneAbi = SolidTokenOneABI
export const solidTokenTwoAbi = SolidTokenTwoABI
export const solidTokenThreeAbi = SolidTokenThreeABI

//export address

export const farmOneAddress = "0xA363913A7cFdf31a479E24FaA1801Dfd0F438D66" 
export const farmTwoAddress = "0x21eBC501efF1B1AAeEA226Cb5Ee977448547996b" 
export const farmThreeAddress = "0xbB2a72F9e30EFd8a7485A6bA72791250083c2079" 
export const rewardTokenAddress = "0xE3A529f102aDF33E401F589d75C6dA2f26bEA1DA" 
export const solidTokenOneAddress = "0x924daEaE6176FBE751F3dfBB5F38FdFeba7f04b1" 
export const solidTokenTwoAddress = "0xc277a4d98e61cbc05781fF9eB39261c4C2c0eFAd" 
export const solidTokenThreeAddress = "0x93BA417A1a358C268187C6703aafb9ebE8be5005" 
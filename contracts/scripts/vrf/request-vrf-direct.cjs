const { ethers } = require('hardhat')
const hre = require('hardhat')

async function main() {
  const vrfConsumerMock = await ethers.getContract('VRFConsumerMock')
  const { consumer } = await hre.getNamedAccounts()

  const vrfConsumerSigner = await ethers.getContractAt(
    'VRFConsumerMock',
    vrfConsumerMock.address,
    consumer,
  )

  const keyHash = '0x16f30d078cdb35c573cf70cf7f3c74fdbf420e9671bc4df8f9c58822d0b6cd58'
  const callbackGasLimit = 500_000
  const numWords = 1
  const refundWallet = '0x8b736035BbDA71825e0219f5FE4DfB22C35FbDDC'

  const tx = await vrfConsumerSigner.requestRandomWordsDirectPayment(
    keyHash,
    callbackGasLimit,
    numWords,
    refundWallet,
    {
      value: ethers.utils.parseEther('0.001'),
    },
  )
  const receipt = await tx.wait()
  console.log('tx hash', receipt.hash)
  console.log('tx receipt', receipt)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

const func = async function (hre) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, get } = deployments
  const { deployer } = await getNamedAccounts()

  console.log('ADCSConsumerMock.ts')
  const coordinator = await get('RequestResponseCoordinator_v0.1')
  const consumerDeployment = await deploy('ADCSConsumerMock', {
    args: [coordinator.address],
    from: deployer,
    log: true,
  })
  console.log('ADCSConsumerMock deployed to', consumerDeployment.address)
}

func.id = 'deploy-adcs-consumer-mock'
func.tags = ['adcs-consumer-mock']

module.exports = func

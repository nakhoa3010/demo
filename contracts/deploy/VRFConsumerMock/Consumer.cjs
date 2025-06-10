const func = async function (hre) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, get } = deployments
  const { deployer } = await getNamedAccounts()

  console.log('VRFConsumerMock.ts')
  const coordinator = await get('VRFCoordinator_v0.1')
  const consumerDeployment = await deploy('VRFConsumerMock', {
    args: [coordinator.address],
    from: deployer,
    log: true,
  })
  console.log('VRFConsumerMock deployed to', consumerDeployment.address)
}

func.id = 'deploy-vrf-consumer-mock'
func.tags = ['vrf-consumer-mock']

module.exports = func

const func = async function (hre) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, get } = deployments
  const { deployer } = await getNamedAccounts()

  console.log('RequestResponseConsumerMock.ts')
  const coordinator = await get('RequestResponseCoordinator_v0.1')
  const consumerDeployment = await deploy('RequestResponseConsumerMock', {
    args: [coordinator.address],
    from: deployer,
    log: true,
  })
  console.log('RequestResponseConsumerMock deployed to', consumerDeployment.address)
}

func.id = 'deploy-request-response-consumer-mock'
func.tags = ['request-response-consumer-mock']

module.exports = func

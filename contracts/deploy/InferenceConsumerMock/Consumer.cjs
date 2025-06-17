const func = async function (hre) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, get } = deployments
  const { deployer } = await getNamedAccounts()

  console.log('InferenceConsumerMock.ts')
  const coordinator = await get('RequestResponseCoordinator_v0.1')
  const consumerDeployment = await deploy('InferenceConsumerMock', {
    args: [coordinator.address],
    from: deployer,
    log: true,
  })
  console.log('InferenceConsumerMock deployed to', consumerDeployment.address)
}

func.id = 'deploy-inference-consumer-mock'
func.tags = ['inference-consumer-mock']

module.exports = func

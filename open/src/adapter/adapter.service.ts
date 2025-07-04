import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { adapterStructure } from '../structures/adapter'
import { graphStructure } from '../structures/graph'
import { CreateAdapterDto } from './dto/create.dto'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { generateUniqueId } from '../app.utils'
import { ProviderService } from '../provider/provider.service'
import { AIService } from '../ai/ai.service'
import { extractJsonFromText } from 'src/ai/ai.utils'

@Injectable()
export class AdapterService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly providerV2Service: ProviderService,
    private readonly aiService: AIService
  ) {}

  async getAdapterStructure() {
    return adapterStructure
  }

  async getGraphStructure() {
    return graphStructure
  }

  async getAllAdapters() {
    const adapters = await this.prismaService.adcsAdaptor.findMany({
      include: {
        graphFlow: true,
        category: true,
        outputType: true
      }
    })
    return adapters.map((adapter) => ({
      id: adapter.code,
      name: adapter.name,
      description: adapter.description,
      iconUrl: adapter.iconUrl,
      coreLLM: adapter.coreLLM,
      staticContext: adapter.staticContext,
      nodesDefinition: JSON.parse(adapter.nodesDefinition),
      graphFlow: adapter.graphFlow.map((node) => ({
        ...node,
        inputValues: JSON.parse(node.inputValues)
      })),
      inputSchema: adapter.inputSchema,
      outputSchema: adapter.outputSchema,
      category: adapter.category?.name || '',
      outputType: adapter.outputType?.name || '',
      outputTypeId: adapter.outputType?.id || 0,
      categoryId: adapter.category?.id || 0,
      requestCount: adapter.requestCount
    }))
  }

  async getAdapter(id: string) {
    const adapter = await this.prismaService.adcsAdaptor.findUnique({
      where: { code: id },
      include: {
        graphFlow: true,
        category: true,
        outputType: true
      }
    })
    if (!adapter) {
      throw new HttpException(`Adapter ${id} not found`, HttpStatus.BAD_REQUEST)
    }
    const nodeProvider = await this.prismaService.adcsProvider.findMany({
      where: {
        id: {
          in: adapter.graphFlow
            .filter((node) => node.nodeType === 'provider')
            .map((node) => node.nodeId)
        }
      },
      include: {
        providerMethod: true
      }
    })
    const nodeAdaptor = await this.prismaService.adcsAdaptor.findMany({
      where: {
        id: {
          in: adapter.graphFlow
            .filter((node) => node.nodeType === 'adaptor')
            .map((node) => node.nodeId)
        }
      }
    })
    const entities = []
    return {
      id: adapter.code,
      name: adapter?.name,
      description: adapter?.description,
      iconUrl: adapter?.iconUrl,
      coreLLM: adapter?.coreLLM,
      staticContext: adapter?.staticContext,
      nodesDefinition: JSON.parse(adapter?.nodesDefinition),
      graphFlow: adapter.graphFlow.map((node) => ({
        ...node,
        inputValues: JSON.parse(node.inputValues)
      })),
      inputEntity: adapter.inputSchema,
      outputEntity: adapter.outputSchema,
      category: adapter.category?.name || '',
      outputType: adapter.outputType?.name || '',
      fulfillDataRequestFn: adapter.outputType?.fulfillDataRequestFn,
      outputTypeId: adapter.outputType?.id || 0,
      categoryId: adapter.category?.id || 0,
      entities: entities.filter((entity, index, self) => self.indexOf(entity) === index),
      requestCount: adapter.requestCount
    }
  }
  async verifyAdapter(adapterDto: CreateAdapterDto) {
    const nodeDefinition = Object.keys(adapterDto.nodes)
    await Promise.all(
      adapterDto.graph_flow.map(async (node, i) => {
        const nodeKey = nodeDefinition.find((key) => key === node.id)
        const nodeId = adapterDto.nodes[nodeKey]
        if (!nodeId) {
          throw new HttpException(`Node ${node.id} not found`, HttpStatus.BAD_REQUEST)
        }
        if (!nodeId.startsWith('A') && !nodeId.startsWith('P')) {
          throw new HttpException(`Node ${nodeId} must start with A or P`, HttpStatus.BAD_REQUEST)
        }

        const sourceType = nodeId.startsWith('P') ? 'provider' : 'adaptor'
        const nodeSource =
          sourceType === 'provider'
            ? await this.prismaService.adcsProvider.findUnique({ where: { code: nodeId } })
            : await this.prismaService.adcsAdaptor.findUnique({ where: { code: nodeId } })
        if (!nodeSource) {
          throw new HttpException(`Node ${nodeId} not found`, HttpStatus.BAD_REQUEST)
        }

        // if (node.input.some((input) => !input.startsWith('IR.'))) {
        //   throw new HttpException(`Input ${node.input} must start with IR.`, HttpStatus.BAD_REQUEST)
        // }

        if (sourceType === 'provider') {
          const method = await this.prismaService.adcsProviderMethod.findFirst({
            where: { providerId: nodeSource.id, methodName: node.input_method }
          })
          if (!method) {
            throw new HttpException(`Method ${node.input_method} not found`, HttpStatus.BAD_REQUEST)
          }
        }
        return {
          nodeId: nodeSource.id,
          nodeType: sourceType
        }
      })
    )
    return {
      isValid: true,
      message: 'Adapter is valid'
    }
  }

  async createAdapter(walletAddress: string, adapterDto: CreateAdapterDto) {
    await this.verifyAdapter(adapterDto)
    const nodeDefinition = Object.keys(adapterDto.nodes)
    const graphFlow: Prisma.AdcsNodeCreateManyInput[] = await Promise.all(
      adapterDto.graph_flow.map(async (node, i) => {
        const nodeKey = nodeDefinition.find((key) => key === node.id)
        const nodeId = adapterDto.nodes[nodeKey]
        const sourceType = nodeId.startsWith('P') ? 'provider' : 'adaptor'
        const nodeSource =
          sourceType === 'provider'
            ? await this.prismaService.adcsProvider.findUnique({ where: { code: nodeId } })
            : await this.prismaService.adcsAdaptor.findUnique({ where: { code: nodeId } })

        if (!nodeSource) {
          throw new HttpException(`Node ${nodeId} not found`, HttpStatus.BAD_REQUEST)
        }
        const nodeSourceId = nodeSource.id
        let methodId = undefined
        if (sourceType === 'provider') {
          const method = await this.prismaService.adcsProviderMethod.findFirst({
            where: { providerId: nodeSourceId, methodName: node.input_method }
          })
          if (!method) {
            throw new HttpException(`Method ${node.input_method} not found`, HttpStatus.BAD_REQUEST)
          }
          methodId = method.id
        }
        return {
          nodeId: nodeSourceId,
          nodeType: sourceType,
          methodName: node.input_method,
          providerMethodId: methodId,
          inputValues: JSON.stringify(node.input),
          index: i,
          outputName: node.output
        }
      })
    )

    const code = generateUniqueId()
    const adapterData: Prisma.AdcsAdaptorCreateInput = {
      name: adapterDto.name,
      description: adapterDto.description,
      iconUrl: adapterDto.icon,
      coreLLM: adapterDto.core_llm,
      staticContext: adapterDto.static_context,
      nodesDefinition: JSON.stringify(adapterDto.nodes),
      code: `A${code}`,
      inputSchema: adapterDto.input_schema,
      outputSchema: adapterDto.output_schema,
      creator: walletAddress,
      outputType: {
        connect: {
          id: adapterDto.output_type_id || 1
        }
      },
      category: {
        connect: {
          id: adapterDto.category_id || 5
        }
      }
    }

    const adapter = await this.prismaService.adcsAdaptor.create({
      data: adapterData
    })

    await this.prismaService.adcsNode.createMany({
      data: graphFlow.map((node) => ({
        ...node,
        adaptorId: adapter.id
      }))
    })

    return adapter
  }

  async deleteAdapter(id: string) {
    const adapter = await this.prismaService.adcsAdaptor.findUnique({ where: { code: id } })
    if (!adapter) {
      throw new HttpException(`Adapter ${id} not found`, HttpStatus.BAD_REQUEST)
    }
    await this.prismaService.adcsNode.deleteMany({ where: { adaptorId: adapter.id } })
    await this.prismaService.adcsAdaptor.delete({ where: { id: adapter.id } })
    return {
      message: 'Adapter deleted successfully'
    }
  }

  async runAdapterById(id: string, input: { [key: string]: any }) {
    const adapter = await this.prismaService.adcsAdaptor.findUnique({
      where: { code: id },
      include: {
        graphFlow: true
      }
    })
    if (!adapter) {
      throw new HttpException(`Adapter ${id} not found`, HttpStatus.BAD_REQUEST)
    }
    // check input schema
    const inputSchema = adapter.inputSchema
    const inputKeys = Object.keys(inputSchema)

    const missingKeys = inputKeys.filter((key) => !input[key])
    if (missingKeys.length > 0) {
      throw new HttpException(`Missing keys: ${missingKeys.join(', ')}`, HttpStatus.BAD_REQUEST)
    }
    const graphFlow = adapter.graphFlow.map((node) => ({
      ...node,
      inputValues: JSON.parse(node.inputValues)
    }))

    let lastOutputData = {}
    let inputData = input

    for (const node of graphFlow.sort((a, b) => a.index - b.index)) {
      try {
        const nodeSource =
          node.nodeType === 'provider'
            ? await this.prismaService.adcsProvider.findUnique({ where: { id: node.nodeId } })
            : await this.prismaService.adcsAdaptor.findUnique({ where: { id: node.nodeId } })

        if (!nodeSource) {
          throw new HttpException(`Node ${node.nodeId} not found`, HttpStatus.BAD_REQUEST)
        }
        if (node.nodeType === 'provider') {
          const method = await this.prismaService.adcsProviderMethod.findFirst({
            where: { providerId: nodeSource.id, methodName: node.methodName }
          })
          if (!method) {
            throw new HttpException(`Method ${node.methodName} not found`, HttpStatus.BAD_REQUEST)
          }

          const methodInput = method.inputSchema
          const methodInputKeys = Object.keys(methodInput)
          let inputValues = inputData
          if (node.inputValues.find((value: any) => value.startsWith('IR.'))) {
            const data = node.inputValues.map((value: any) => {
              const inputKey = value.split('.')[1]
              return { [inputKey]: inputData[inputKey] }
            })
            inputValues = Object.assign({}, ...data)
          }
          if (Object.keys(inputValues).length !== methodInputKeys.length) {
            throw new HttpException(`Input values length mismatch`, HttpStatus.BAD_REQUEST)
          }

          const methodInputValues = methodInputKeys.map((key) => {
            return { [key]: inputValues[key] }
          })
          const finalMethodInputValues = Object.assign({}, ...methodInputValues)
          // execute method
          const methodOutput = await this.providerV2Service.executeMethod(
            nodeSource.code,
            node.methodName,
            finalMethodInputValues
          )
          lastOutputData = methodOutput
          inputData = methodOutput
        } else if (node.nodeType === 'adaptor') {
          const adaptor = await this.prismaService.adcsAdaptor.findUnique({
            where: { id: node.nodeId }
          })
          const adapterInput = adaptor.inputSchema
          const adaptorInputKeys = Object.keys(adapterInput)
          let inputValues = inputData
          if (node.inputValues.find((value: any) => value.startsWith('IR.'))) {
            const data = node.inputValues.map((value: any) => {
              const inputKey = value.split('.')[1]
              return { [inputKey]: inputData[inputKey] }
            })
            inputValues = Object.assign({}, ...data)
          }
          if (Object.keys(inputValues).length !== adaptorInputKeys.length) {
            throw new HttpException(`Input values length mismatch`, HttpStatus.BAD_REQUEST)
          }
          const adaptorInputValues = adaptorInputKeys.map((key) => {
            return { [key]: inputValues[key] }
          })
          const finalInputValues = Object.assign({}, ...adaptorInputValues)
          // execute adaptor
          if (adaptor.code === id) {
            throw new HttpException(`Adaptor ${id} cannot run itself`, HttpStatus.BAD_REQUEST)
          }
          lastOutputData = await this.runAdapterById(adaptor.code, finalInputValues)
          inputData = lastOutputData
        } else {
          throw new HttpException(
            `Node ${node.nodeId} is not a provider or adaptor`,
            HttpStatus.BAD_REQUEST
          )
        }
      } catch (error) {
        console.log('error at node', node.nodeId, error)
        throw error
      }
    }

    // use coreLLM to generate output
    const coreLLM = adapter.coreLLM
    if (coreLLM) {
      // get llm model
      const llmModel = await this.prismaService.aIModel.findFirst({ where: { name: coreLLM } })
      if (!llmModel) {
        throw new HttpException(`LLM model ${coreLLM} not found`, HttpStatus.BAD_REQUEST)
      }
      const coreLLMInput = `${adapter.staticContext}\n${JSON.stringify(inputData)}\n
      the response should be in json format and should be like this: ${JSON.stringify(adapter.outputSchema)}`
      const coreLLMOutput = await this.aiService.executeModel(llmModel.name, coreLLMInput)
      lastOutputData = extractJsonFromText(coreLLMOutput.response)
    }
    // update request count
    await this.prismaService.adcsAdaptor.update({
      where: { code: id },
      data: { requestCount: { increment: 1 } }
    })

    return lastOutputData
  }

  async runTestAdapter(adapter: CreateAdapterDto, input: { [key: string]: any }) {
    if (!adapter) {
      throw new HttpException(`Adapter not found`, HttpStatus.BAD_REQUEST)
    }
    const inputSchema = adapter.input_schema

    const inputKeys = Object.keys(inputSchema)

    const missingKeys = inputKeys.filter((key) => !input[key])
    if (missingKeys.length > 0) {
      throw new HttpException(`Missing keys: ${missingKeys.join(', ')}`, HttpStatus.BAD_REQUEST)
    }
    const graphFlow = adapter.graph_flow.map((node) => ({
      ...node,
      inputValues: node.input
    }))

    let lastOutputData = {}
    let inputData = input

    for (const node of graphFlow) {
      const nodeId = adapter.nodes[node.id]
      if (!nodeId) {
        throw new HttpException(`Node ${node.id} not found`, HttpStatus.BAD_REQUEST)
      }
      try {
        const nodeSource = nodeId.startsWith('P')
          ? await this.prismaService.adcsProvider.findUnique({ where: { code: nodeId } })
          : await this.prismaService.adcsAdaptor.findUnique({ where: { code: nodeId } })

        if (!nodeSource) {
          throw new HttpException(`Node ${node.id} not found`, HttpStatus.BAD_REQUEST)
        }
        if (nodeId.startsWith('P')) {
          const method = await this.prismaService.adcsProviderMethod.findFirst({
            where: { providerId: nodeSource.id, methodName: node.input_method }
          })
          if (!method) {
            throw new HttpException(`Method ${node.input_method} not found`, HttpStatus.BAD_REQUEST)
          }

          const methodInput = method.inputSchema
          const methodInputKeys = Object.keys(methodInput)
          let inputValues = inputData
          if (node.inputValues.find((value: any) => value.startsWith('IR.'))) {
            const data = node.inputValues.map((value: any) => {
              const inputKey = value.split('.')[1]
              return { [inputKey]: inputData[inputKey] }
            })
            inputValues = Object.assign({}, ...data)
          }
          if (Object.keys(inputValues).length !== methodInputKeys.length) {
            throw new HttpException(`Input values length mismatch`, HttpStatus.BAD_REQUEST)
          }

          const methodInputValues = methodInputKeys.map((key) => {
            return { [key]: inputValues[key] }
          })
          const finalMethodInputValues = Object.assign({}, ...methodInputValues)
          // execute method
          const methodOutput = await this.providerV2Service.executeMethod(
            nodeSource.code,
            node.input_method,
            finalMethodInputValues
          )
          lastOutputData = methodOutput
          inputData = methodOutput
        } else if (nodeId.startsWith('A')) {
          const adaptor = await this.prismaService.adcsAdaptor.findUnique({
            where: { code: nodeId }
          })
          const adapterInput = adaptor.inputSchema
          const adaptorInputKeys = Object.keys(adapterInput)
          let inputValues = inputData
          if (node.inputValues.find((value: any) => value.startsWith('IR.'))) {
            const data = node.inputValues.map((value: any) => {
              const inputKey = value.split('.')[1]
              return { [inputKey]: inputData[inputKey] }
            })
            inputValues = Object.assign({}, ...data)
          }
          if (Object.keys(inputValues).length !== adaptorInputKeys.length) {
            throw new HttpException(`Input values length mismatch`, HttpStatus.BAD_REQUEST)
          }
          const adaptorInputValues = adaptorInputKeys.map((key) => {
            return { [key]: inputValues[key] }
          })
          const finalInputValues = Object.assign({}, ...adaptorInputValues)
          // execute adaptor
          // if (adaptor.code === nodeId) {
          //   throw new HttpException(`Adaptor ${nodeId} cannot run itself`, HttpStatus.BAD_REQUEST)
          // }
          lastOutputData = await this.runAdapterById(nodeId, finalInputValues)
          inputData = lastOutputData
        } else {
          throw new HttpException(
            `Node ${nodeId} is not a provider or adaptor`,
            HttpStatus.BAD_REQUEST
          )
        }
      } catch (error) {
        console.log('error at node', nodeId, error)
        throw error
      }
    }

    // use coreLLM to generate output
    const coreLLM = adapter.core_llm
    if (coreLLM) {
      // get llm model
      const llmModel = await this.prismaService.aIModel.findFirst({ where: { name: coreLLM } })
      if (!llmModel) {
        throw new HttpException(`LLM model ${coreLLM} not found`, HttpStatus.BAD_REQUEST)
      }
      const coreLLMInput = `${adapter.static_context}\n${JSON.stringify(inputData)}\n
      the response should be in json format and should be like this: ${JSON.stringify(adapter.output_schema)}`
      const coreLLMOutput = await this.aiService.executeModel(llmModel.name, coreLLMInput)
      lastOutputData = extractJsonFromText(coreLLMOutput.response)
    }

    return lastOutputData
  }

  async adapterByCreator(walletAddress: string) {
    const adapters = await this.prismaService.adcsAdaptor.findMany({
      where: { creator: walletAddress },
      include: {
        graphFlow: true,
        category: true,
        outputType: true
      }
    })
    return adapters.map((adapter) => ({
      id: adapter.code,
      name: adapter.name,
      description: adapter.description,
      iconUrl: adapter.iconUrl,
      coreLLM: adapter.coreLLM,
      staticContext: adapter.staticContext,
      nodesDefinition: JSON.parse(adapter.nodesDefinition),
      graphFlow: adapter.graphFlow.map((node) => ({
        ...node,
        inputValues: JSON.parse(node.inputValues)
      })),
      inputEntity: adapter.inputSchema,
      outputEntity: adapter.outputSchema,
      category: adapter.category?.name || '',
      outputType: adapter.outputType?.name || '',
      outputTypeId: adapter.outputType?.id || 0,
      categoryId: adapter.category?.id || 0,
      requestCount: adapter.requestCount
    }))
  }
}

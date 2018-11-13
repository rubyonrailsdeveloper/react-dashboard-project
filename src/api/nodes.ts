import { normalize } from 'normalizr'
import api, { path } from 'src/api/api'
import { clusters } from 'src/api/clusters'
import { postProcessContainer } from 'src/api/containers'
import { Container } from 'src/store/container/container-model'
import { Node, nodeSchema } from 'src/store/node/node-model'

const nodes = path('nodes')

const postProcessNode = (n: Partial<Node>) => {
  n.id = `${n.cluster}/${n.id}`
  if (n.containers) {
    n.containers.forEach((container: Partial<Container>) => {
      container.node = n.name
      container.cluster = n.cluster

      postProcessContainer(container)
    })
  }

  // TODO: Remove when API delivers this (missing API implementation)
  n.address = '/1.2.3.4.5.6'
}

export const findAll = async () => {
  const result = await api.get(nodes())
  const nodeList: Array<Partial<Node>> = result.data.data

  nodeList.forEach(postProcessNode)

  return normalize(nodeList, [nodeSchema])
}

export const find = async (id: string) => {
  const splitId = id.split('/')
  const endpoint = `clusters/${splitId[0]}/nodes/${splitId[1]}`
  const result = await api.get(endpoint)
  const node: Partial<Node> = result.data

  postProcessNode(node)

  return normalize(node, nodeSchema)
}

export const findByCluster = async (cluster: string) => {
  const result = await api.get(`${clusters(cluster)}/nodes`)
  const nodeList: Array<Partial<Node>> = result.data.data

  nodeList.forEach(postProcessNode)

  return normalize(nodeList, [nodeSchema])
}

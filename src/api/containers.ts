import { normalize } from 'normalizr'
import api from 'src/api/api'
import { Container, containerSchema } from 'src/store/container/container-model'

export const postProcessContainer = (container: Partial<Container>) => {
  container.id = `${container.cluster}/${container.node}/${container.id}`
  container.nodeId = `${container.cluster}/${container.node}`
}

export const find = async (id: string) => {
  const [cluster, node, containerName] = id.split('/')
  const result = await api.get(`clusters/${cluster}/nodes/${node}/containers/${containerName}`)
  const container: Partial<Container> = result.data

  container.node = node
  container.cluster = cluster
  postProcessContainer(container)

  return normalize(container, containerSchema)
}

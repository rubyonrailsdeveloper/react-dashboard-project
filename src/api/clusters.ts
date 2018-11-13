import { normalize } from 'normalizr'
import api, { path } from 'src/api/api'
import { Cluster, clusterSchema } from 'src/store/cluster/cluster-model'

export const clusters = path('clusters')

const postProcessCluster = (c: Partial<Cluster>) => {
  // nothing right now
}

export const findAll = async () => {
  const result = await api.get(clusters())
  const clusterList: Array<Partial<Cluster>> = result.data.data

  clusterList.forEach(postProcessCluster)

  return normalize(clusterList, [clusterSchema])
}

export const find = async (id: string) => {
  const result = await api.get(clusters(id))
  const cluster: Partial<Cluster> = result.data

  postProcessCluster(cluster)

  return normalize(cluster, clusterSchema)
}

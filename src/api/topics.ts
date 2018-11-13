import forOwn from 'lodash-es/forOwn'
import { normalize } from 'normalizr'
import api, { path } from 'src/api/api'
import { Health } from 'src/store/constants'
import { Consumer, Producer, Topic, TopicIOType, topicSchema } from 'src/store/topic/topic-model'

const topics = path('topics')

const postProcessTopic = (t: Partial<Topic>) => {
  // Make it easy for the rest of the codebase to reference IDs
  t.groupId = t.group
  t.namespaceId = `${t.group}/${t.namespace}`

  // Add type 'external' to producers so we don't have to check for property existence
  t.producers!.forEach((p: Partial<Producer>) => {
    if (!p.type) p.type = TopicIOType.EXTERNAL
  })

  // Add type 'external' to consumers so we don't have to check for property existence
  forOwn(t.subscriptions!, (s, sk) => {
    s.consumers.forEach((c: Partial<Consumer>) => {
      if (!c.type) c.type = TopicIOType.EXTERNAL
      c.health = Health.UNKNOWN
    })
  })
}

export const findAll = async () => {
  const result = await api.get(topics())
  const topicList: Array<Partial<Topic>> = result.data.data

  topicList.forEach(postProcessTopic)

  return normalize(topicList, [topicSchema])
}

export const find = async (id: string) => {
  const result = await api.get(topics(id))
  const topic: Partial<Topic> = result.data

  postProcessTopic(topic)

  return normalize(topic, topicSchema)
}

export const destroy = async (id: string) => {
  const result = await api.delete(topics(`${id}`))
  return result.data || 'OK'
}

const subscription = (id: string, subs: string, op: string, suffix?: string | number) =>
  topics(`${id}/subscriptions/${subs}/${op}/${suffix ? suffix : ''}`)

export const skipMsgs = async (id: string, subs: string, numMessages: number) => {
  const result = await api.post(subscription(id, subs, 'skip', numMessages))
  return result.data || 'OK'
}

export const clearSubsBacklog = async (id: string, subs: string) => {
  const result = await api.post(subscription(id, subs, 'clear'))
  return result.data || 'OK'
}

export const applySubsTtl = async (id: string, subs: string, seconds: number) => {
  const result = await api.post(subscription(id, subs, 'ttl', seconds))
  return result.data || 'OK'
}

export const rollbackSubs = async (id: string, subs: string, date: Date) => {
  const result = await api.post(subscription(id, subs, 'rollback', date.getTime()))
  return result.data || 'OK'
}

export const peekSubs = async (id: string, subs: string, position: number) => {
  const result = await api.get(subscription(id, subs, 'position', position))
  return result.data || 'OK'
}

export const unload = async (id: string) => {
  const result = await api.post(topics(`${id}/unload`))
  return result.data || 'OK'
}

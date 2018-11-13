import { groupUrl, namespaceUrl, pipelineUrl, topicUrl } from 'src/routes'

describe('routes', () => {
  describe('groupUrl', () => {
    it('should correctly build a group URL', () => {
      const groupId = 'group-1234_'
      expect(groupUrl({ id: groupId })).toBe(`/groups/${groupId}`)
    })
  })

  describe('namespaceUrl', () => {
    it('should correctly build a namespace URL', () => {
      const nsId = 'group-1234_/ns-123_'
      expect(namespaceUrl({ id: nsId })).toBe(`/namespaces/${nsId}`)
    })
  })

  describe('pipelineUrl', () => {
    it('should correctly build a pipeline URL', () => {
      const pipelineId = 'group-1234_/ns-123_/pipeline-_123'
      expect(pipelineUrl({ id: pipelineId })).toBe(`/pipelines/${pipelineId}`)
    })
  })

  describe('topicUrl', () => {
    it('should correctly build a topic URL', () => {
      const topicId = 'group-1234_/ns-123_/topic-_123'
      expect(topicUrl({ id: topicId })).toBe(`/topics/${topicId}`)
    })
  })
})

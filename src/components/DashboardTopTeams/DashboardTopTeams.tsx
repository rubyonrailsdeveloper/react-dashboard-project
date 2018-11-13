import * as React from 'react'
import ValueBar from 'src/components/ValueBar/ValueBar'
import { Group } from 'src/store/group/group-model'

import { bytesToHumanSize } from 'src/util/formating'

interface DashboardTopTeamsProps {
  prop: string
  groups: Group[]
  limit?: number
}
class DashboardTopTeams extends React.Component<DashboardTopTeamsProps> {
  static teamSortByCpu = (a: Group, b: Group) => (b.resources.used.cpu - a.resources.used.cpu)
  static teamSortByMemory = (a: Group, b: Group) => (b.resources.used.memory - a.resources.used.memory)
  static teamSortByStorage = (a: Group, b: Group) => (b.resources.used.storage - a.resources.used.storage)

  topTeamsBy(prop: string, groups: Group[], limit: number=3) {
    const fnMap: any = {cpu: this.topTeamsByCpu, memory: this.topTeamsByMemory, storage: this.topTeamsByStorage}
    return fnMap[prop](groups, limit)
  }

  topTeamsByCpu(groups: Group[], limit: number=3) {
    return groups.sort(DashboardTopTeams.teamSortByCpu).slice(0, limit).map((g, index, filteredTeams) => {
      const max = filteredTeams[0].resources.used.cpu
      const value = Math.round(g.resources.used.cpu)
      return (
        <div key={g.id}>
          <ValueBar label={g.name}
            value={value}
            max={max}
            barColor="rgba(166, 99, 227, 0.7)"
            valueLabel={`${value} cores`}/>
        </div>
      )}
    )
  }

  topTeamsByMemory(groups: Group[], limit: number=3) {
    return groups.sort(DashboardTopTeams.teamSortByMemory).slice(0, limit).map((g, index, filteredTeams) => {
      const max = filteredTeams[0].resources.used.memory
      const value = g.resources.used.memory
      const valueLabel = bytesToHumanSize(value).formatted
      return (
      <div key={g.id}>
        <ValueBar label={g.name}
          value={value}
          max={max}
          barColor="rgba(228, 110, 196, 0.7)"
          valueLabel={valueLabel}/>
      </div>
    )})
  }

  topTeamsByStorage(groups: Group[], limit: number=3) {
    return groups.sort(DashboardTopTeams.teamSortByStorage).slice(0, limit).map((g, index, filteredTeams) => {
      const max = filteredTeams[0].resources.used.storage
      const value = g.resources.used.storage
      const valueLabel = bytesToHumanSize(value).formatted
      return (
        <div key={g.id}>
          <ValueBar label={g.name}
            value={value}
            max={max}
            barColor="rgba(73, 196, 169, 0.7)"
            valueLabel={valueLabel}/>
        </div>
    )})
  }

  render() {
    const groups = [ ...this.props.groups ]
    return (
      groups && groups.length &&<div className="DashboardTopTeams">
        {this.topTeamsBy(this.props.prop, groups)}
      </div>
    )
  }
}

export default DashboardTopTeams
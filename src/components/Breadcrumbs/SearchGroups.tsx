import { IconClasses, InputGroup } from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import BreadcrumbList, { BreadcrumbListItem } from 'src/components/Breadcrumbs/BreadcrumbList'
import { Icons } from 'src/constants'
import { groupUrl } from 'src/routes'
import { Group } from 'src/store/group/group-model'
import { getGroupList } from 'src/store/group/group-reducers'
import { State } from 'src/store/root-reducer'

interface ConnectProps {
  groups: Group[]
}

type SearchGroupsProps = ConnectProps & RouteComponentProps<{}>

interface SearchGroupsState {
  search: string
  processedGroups: BreadcrumbListItem[]
}

class SearchGroups extends React.Component<SearchGroupsProps, SearchGroupsState> {
  state = {
    search: '',
    ...SearchGroups.process(this.props, ''),
  }

  static mapEntityArray = (groups: Group[]) =>
    groups.map(({ id, name, health }) => ({
      name: name,
      health: health,
      url: groupUrl({ id }),
    }))

  static process({ groups }: SearchGroupsProps, search: string) {
    return {
      processedGroups: SearchGroups.searchArray(SearchGroups.mapEntityArray(groups), search),
    }
  }

  static searchArray = (array: BreadcrumbListItem[], search: string) =>
    array.filter(entity => !search || entity.name.includes(search))

  onSearchChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      search: ev.currentTarget.value,
      ...SearchGroups.process(this.props, ev.currentTarget.value),
    })
  }

  componentWillReceiveProps(nextProps: SearchGroupsProps) {
    if (nextProps.groups !== this.props.groups)
      this.setState(SearchGroups.process(nextProps, this.state.search))
  }

  render() {
    const { processedGroups, search } = this.state

    return (
      <div className="breadcrumbs-search search-groups">
        <div className="breadcrumbs-search-input">
          <InputGroup
            type="text"
            placeholder="Search all groups"
            leftIconName={IconClasses.SEARCH}
            value={search}
            onChange={this.onSearchChange}
          />
        </div>
        <BreadcrumbList
          items={processedGroups}
          noItemsMsg={search !== '' ? 'No groups match your search' : 'No groups'}
          icon={Icons.GROUP}
        />
      </div>
    )
  }
}

export default withRouter(
  connect(() => {
    return (state: State) => {
      const allGroups = getGroupList(state)
      return {
        groups: allGroups,
      }
    }
  })(SearchGroups)
)

import { Classes} from '@blueprintjs/core' // , NavbarDivider
import * as React from 'react'
import UserMenu from 'src/components/Navbar/UserMenu'
import MenuLink from 'src/components/Url/MenuLink'
import {
  // clusterListUrl,
  // containerListUrl,
  groupListUrl,
  indexUrl,
  namespaceListUrl,
  // nodeListUrl,
  pipelineListUrl,
  // streamFunctionListUrl,
  topicListUrl,
  // userListUrl
} from 'src/routes'

const { NAVBAR_GROUP, NAVBAR_HEADING, ALIGN_LEFT, ALIGN_RIGHT, MINIMAL, BUTTON } = Classes

interface NavbarWrapPageProps {
  onMount: () => void
}
interface State {
  isMounted: boolean
}

class NavbarWrap extends React.Component<NavbarWrapPageProps, State> {
  constructor(props: NavbarWrapPageProps) {
    super(props)
    this.state = {
      isMounted: false
    }
  }
  render() {
    return (
      <div className="navbar-wrap">
        <div className={`${NAVBAR_GROUP} ${ALIGN_LEFT}`}>
          <div className={NAVBAR_HEADING}>
            <MenuLink exact to={indexUrl} className={`navbar-logo`}>Streaml.io</MenuLink>
          </div>
          <MenuLink to={groupListUrl()} className={`${BUTTON} ${MINIMAL}`}>Teams</MenuLink>
          <MenuLink to={namespaceListUrl()} className={`${BUTTON} ${MINIMAL}`}>Namespaces</MenuLink>
          <MenuLink to={pipelineListUrl()} className={`${BUTTON} ${MINIMAL}`}>Pipelines</MenuLink>
          <MenuLink to={topicListUrl()} className={`${BUTTON} ${MINIMAL}`}>Topics</MenuLink>
          {/* <MenuLink to={streamFunctionListUrl()} className={`${BUTTON} ${MINIMAL}`}>Functions</MenuLink>
          <NavbarDivider />
          <MenuLink to={clusterListUrl()} className={`${BUTTON} ${MINIMAL}`}>Clusters</MenuLink>
          <MenuLink to={nodeListUrl()} className={`${BUTTON} ${MINIMAL}`}>Nodes</MenuLink>
          <MenuLink to={containerListUrl()} className={`${BUTTON} ${MINIMAL}`}>Containers</MenuLink>
          <NavbarDivider />
          <MenuLink exact to={userListUrl()} className={`${BUTTON} ${MINIMAL}`}>Users</MenuLink> */}
        </div>
        <div className={`${NAVBAR_GROUP} ${ALIGN_RIGHT}`}>
          {/* part of P1.5 <InputGroup className="navbar-search" type="search" placeholder="Search Streaml.io" leftIconName={Icon.SEARCH} /> */}
          <UserMenu />
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.setState({isMounted: true})
    this.props.onMount()
  }
}
export default NavbarWrap

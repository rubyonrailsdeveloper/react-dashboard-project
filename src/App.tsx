import * as React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Store } from 'redux'
import PrivateRoute from 'src/components/Authentication/PrivateRoute'
import Navbar from 'src/components/Navbar/Navbar'
import {
  clusterListUrl,
  clusterUrl,
  containerListUrl,
  containerUrl,
  groupListUrl,
  groupUrl,
  indexUrl,
  loginUrl,
  namespaceListUrl,
  namespaceUrl,
  nodeListUrl,
  nodeUrl,
  pipelineListUrl,
  pipelineUrl,
  streamFunctionListUrl,
  streamFunctionUrl,
  topicListUrl,
  topicUrl,
  userListUrl,
} from 'src/routes'
import LoginPage from 'src/scenes/Authentication/LoginPage'
import ClusterList from 'src/scenes/ClusterList/ClusterList'
import ContainerList from 'src/scenes/ContainerList/ContainerList'
import Dashboard from 'src/scenes/Dashboard/Dashboard'
import EntityPage from 'src/scenes/EntityPage/EntityPage'
import GroupList from 'src/scenes/GroupList/GroupList'
import NamespaceList from 'src/scenes/NamespaceList/NamespaceList'
import NodeList from 'src/scenes/NodeList/NodeList'
import NotFound from 'src/scenes/NotFound/NotFound'
import PipelineList from 'src/scenes/PipelineList/PipelineList'
import StreamFunctionList from 'src/scenes/StreamFunctionList/StreamFunctionList'
import TopicList from 'src/scenes/TopicList/TopicList'
import UserList from 'src/scenes/UserList/UserList'
import { State } from 'src/store/root-reducer'

interface AppProps {
  store: Store<State>
}

export default class App extends React.Component<AppProps> {
  render() {
    return (
      <Provider store={this.props.store}>
        <BrowserRouter basename={process.env.PUBLIC_PATH}>
          <div className="app pt-dark">
            <Navbar />
            <Switch>
              <Route path={loginUrl.route} component={LoginPage} />
              <PrivateRoute path={topicUrl.route} component={EntityPage} />
              <PrivateRoute path={streamFunctionUrl.route} component={EntityPage} />
              <PrivateRoute path={pipelineUrl.route} component={EntityPage} />
              <PrivateRoute path={namespaceUrl.route} component={EntityPage} />
              <PrivateRoute path={groupUrl.route} component={EntityPage} />
              <PrivateRoute path={clusterUrl.route} component={EntityPage} />
              <PrivateRoute path={nodeUrl.route} component={EntityPage} />
              <PrivateRoute path={containerUrl.route} component={EntityPage} />
              <PrivateRoute exact path={userListUrl.route} component={UserList} />
              <PrivateRoute exact path={topicListUrl.route} component={TopicList} />
              <PrivateRoute exact path={streamFunctionListUrl.route} component={StreamFunctionList} />
              <PrivateRoute exact path={pipelineListUrl.route} component={PipelineList} />
              <PrivateRoute exact path={namespaceListUrl.route} component={NamespaceList} />
              <PrivateRoute exact path={groupListUrl.route} component={GroupList} />
              <PrivateRoute exact path={clusterListUrl.route} component={ClusterList} />
              <PrivateRoute exact path={nodeListUrl.route} component={NodeList} />
              <PrivateRoute exact path={containerListUrl.route} component={ContainerList} />
              <PrivateRoute exact path={indexUrl} component={Dashboard} />
              <PrivateRoute component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    )
  }
}

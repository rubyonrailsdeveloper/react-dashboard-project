import { Classes } from '@blueprintjs/core'
import * as React from 'react'
import MenuLink from 'src/components/Url/MenuLink'
import { Icons } from 'src/constants'
import { clusterListUrl, containerListUrl, nodeListUrl } from 'src/routes'

const {
  BUTTON,
  MINIMAL,
  ICON_STANDARD,

  POPOVER_DISMISS,

  TREE,
  TREE_NODE_LIST,
  TREE_ROOT,
  TREE_NODE,
  TREE_NODE_EXPANDED,
  TREE_NODE_CONTENT,
  TREE_NODE_ICON,
} = Classes

const ClusterNavTree: React.SFC = () => (
  <div className={`${TREE} nav-tree`}>
    <ul className={`${TREE_NODE_LIST} ${TREE_ROOT}`}>
      <li className={`${TREE_NODE} ${TREE_NODE_EXPANDED}`}>
        <MenuLink
          exact
          to={clusterListUrl()}
          className={`${POPOVER_DISMISS} ${TREE_NODE_CONTENT} ${BUTTON} ${MINIMAL}`}
        >
          <span className={`${TREE_NODE_ICON} ${ICON_STANDARD} ${Icons.CLUSTER}`} />
          Clusters
        </MenuLink>
        <ul className={`${TREE_NODE_LIST}`}>
          <li className={`${TREE_NODE} ${TREE_NODE_EXPANDED}`}>
            <MenuLink
              to={nodeListUrl()}
              className={`${POPOVER_DISMISS} ${TREE_NODE_CONTENT} ${TREE_NODE_CONTENT}-1 ${BUTTON} ${MINIMAL}`}
            >
              <span className={`${TREE_NODE_ICON} ${ICON_STANDARD} ${Icons.NODE}`} />
              Nodes
            </MenuLink>
            <ul className={`${TREE_NODE_LIST}`}>
              <MenuLink
                to={containerListUrl()}
                className={`${POPOVER_DISMISS} ${TREE_NODE_CONTENT} ${TREE_NODE_CONTENT}-2 ${BUTTON} ${MINIMAL}`}
              >
                <span className={`${TREE_NODE_ICON} ${ICON_STANDARD} ${Icons.CONTAINER}`} />
                Containers
              </MenuLink>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
)

export default ClusterNavTree

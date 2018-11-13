import { Classes } from '@blueprintjs/core'
import * as React from 'react'
import MenuLink from 'src/components/Url/MenuLink'
import { Icons } from 'src/constants'
import { groupListUrl, namespaceListUrl, pipelineListUrl, topicListUrl } from 'src/routes'

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

const NavTree: React.SFC = () => (
  <div className={`${TREE} nav-tree`}>
    <ul className={`${TREE_NODE_LIST} ${TREE_ROOT}`}>
      <li className={`${TREE_NODE} ${TREE_NODE_EXPANDED}`}>
        <MenuLink
          exact
          to={groupListUrl()}
          className={`${POPOVER_DISMISS} ${TREE_NODE_CONTENT} ${BUTTON} ${MINIMAL}`}
        >
          <span className={`${TREE_NODE_ICON} ${ICON_STANDARD} ${Icons.GROUP}`} />
          Groups
        </MenuLink>
        <ul className={`${TREE_NODE_LIST}`}>
          <li className={`${TREE_NODE} ${TREE_NODE_EXPANDED}`}>
            <MenuLink
              to={namespaceListUrl()}
              className={`${POPOVER_DISMISS} ${TREE_NODE_CONTENT} ${TREE_NODE_CONTENT}-1 ${BUTTON} ${MINIMAL}`}
            >
              <span className={`${TREE_NODE_ICON} ${ICON_STANDARD} ${Icons.NAMESPACE}`} />
              Namespaces
            </MenuLink>
            <ul className={`${TREE_NODE_LIST}`}>
              <MenuLink
                to={pipelineListUrl()}
                className={`${POPOVER_DISMISS} ${TREE_NODE_CONTENT} ${TREE_NODE_CONTENT}-2 ${BUTTON} ${MINIMAL}`}
              >
                <span className={`${TREE_NODE_ICON} ${ICON_STANDARD} ${Icons.PIPELINE}`} />
                Pipelines
              </MenuLink>
              <MenuLink
                to={topicListUrl()}
                className={`${POPOVER_DISMISS} ${TREE_NODE_CONTENT} ${TREE_NODE_CONTENT}-2 ${BUTTON} ${MINIMAL}`}
              >
                <span className={`${TREE_NODE_ICON} ${ICON_STANDARD} ${Icons.TOPIC}`} />
                Topics
              </MenuLink>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
)

export default NavTree

import {
  Button,
  Classes,
  IconClasses,
  InputGroup,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Position,
} from '@blueprintjs/core'
import * as React from 'react'
import { connect } from 'react-redux'
import FilterBar from 'src/components/ActionBar/FilterBar'
import Breadcrumbs from 'src/components/Breadcrumbs/Breadcrumbs'
import BreadcrumbsPageItem from 'src/components/Breadcrumbs/BreadcrumbsPageItem'
import BreadcrumbsTextItem from 'src/components/Breadcrumbs/BreadcrumbsTextItem'
import Copy from 'src/components/Copy/Copy'
import ControlledPopover from 'src/components/InlinePopover/ControlledPopover'
import { DeleteTopic } from 'src/components/Operations/operations'
import Unload from 'src/components/Operations/Unload'
import SchemaDialog from 'src/components/Schema/SchemaDialog'
import withTopicFilters, { TopicFiltersInjectedProps } from 'src/components/Topic/withTopicFilters'
import { groupUrl, namespaceUrl } from 'src/routes'
import { NestedId } from 'src/store/constants'
import { State } from 'src/store/root-reducer'
import { Topic } from 'src/store/topic/topic-model'
import { makeGetTopic } from 'src/store/topic/topic-reducers'

interface OwnProps extends NestedId, TopicFiltersInjectedProps {}

interface ConnectProps {
  topic: Topic | null
}

type TopicActionsProps = OwnProps & ConnectProps

interface TopicActionsState {
  isSchemaDialogOpen?: boolean
}

class TopicActions extends React.Component<TopicActionsProps, TopicActionsState> {
  state = {
    isSchemaDialogOpen: false
  }

  handleMenuItemClick = (open: () => void, onClick: () => void) => {
    return () => {
      open()
      onClick()
    }
  }

  toggleSchemaDialog = () => this.setState({ isSchemaDialogOpen: !this.state.isSchemaDialogOpen })

  render() {
    const { topic, clearTopicFilters, cluster } = this.props
    return (
      topic && (
        <div className="topic-actions action-bar-wrap">
          <SchemaDialog
            topicName={topic.name}
            isOpen={this.state.isSchemaDialogOpen}
            onClose={this.toggleSchemaDialog} />

          <Breadcrumbs>
            <BreadcrumbsTextItem
              href={groupUrl({ id: topic.groupId })}
              description="Group"
              name={topic.group} />
            <BreadcrumbsTextItem
              href={namespaceUrl({ id: topic.namespaceId })}
              description="Namespace"
              name={topic.namespace} />
            <BreadcrumbsPageItem name={topic.name} />
          </Breadcrumbs>
          {topic && (
            <div className="action-bar-actions">
              <ControlledPopover
                popoverClassName={Classes.MINIMAL}
                position={Position.BOTTOM_RIGHT}
                popoverTarget={<Button text="More" rightIconName={IconClasses.CHEVRON_DOWN} />}
              >
                {({ close, open, shouldDismissPopover }) => (
                  <Menu>
                    <MenuItem iconName={IconClasses.TH}
                      intent={Intent.PRIMARY}
                      text="Show Schema"
                      onClick={this.toggleSchemaDialog} />

                    <Unload id={topic.id} onClose={close}>
                      {({ onClick }) => (
                        <MenuItem
                          iconName={IconClasses.EXPORT}
                          text="Unload"
                          shouldDismissPopover={shouldDismissPopover}
                          onClick={this.handleMenuItemClick(open, onClick)}
                        />
                      )}
                    </Unload>
                    <MenuDivider />
                    <DeleteTopic id={topic.id} onClose={close}>
                      {({ onClick }) => (
                        <MenuItem
                          iconName={IconClasses.TRASH}
                          intent={Intent.DANGER}
                          text="Delete"
                          onClick={this.handleMenuItemClick(open, onClick)}
                          shouldDismissPopover={shouldDismissPopover}
                        />
                      )}
                    </DeleteTopic>
                  </Menu>
                )}
              </ControlledPopover>

              <Popover
                popoverClassName={Classes.MINIMAL}
                position={Position.BOTTOM_RIGHT}
                inheritDarkTheme={false}
                content={
                  <Menu>
                    <InputGroup
                      type="text"
                      value={topic.id}
                      rightElement={
                        <Copy text={topic.id}>
                          <Button iconName={IconClasses.DUPLICATE} intent={Intent.PRIMARY} />
                        </Copy>
                      }
                      readOnly={true}
                    />
                  </Menu>
                }
              >
                <Button
                  text="Copy topic name"
                  rightIconName={IconClasses.CHEVRON_DOWN}
                  intent={Intent.PRIMARY}
                />
              </Popover>
            </div>
          )}

          <FilterBar onClearFilter={clearTopicFilters} filterActive={!!cluster}>
            <span className="filter-bar-label">Filtering by cluster:</span>{' '}
            <span className="filter-bar-name">{cluster}</span>
          </FilterBar>
        </div>
      )
    )
  }
}
const connected = connect(() => {
  const getTopic = makeGetTopic()

  return (state: State, ownProps: OwnProps) => ({
    topic: getTopic(state, ownProps),
  })
})(TopicActions)

export default withTopicFilters()(connected)

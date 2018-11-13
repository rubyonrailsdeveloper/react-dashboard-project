import {
  Button,
  Classes,
  IconClasses,
  Menu,
  MenuDivider,
  MenuItem,
  Position,
} from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import { connect } from 'react-redux'
import ControlledPopover from 'src/components/InlinePopover/ControlledPopover'
import { UserUpdate } from 'src/components/Operations/UserModify'
import { triggerLogout } from 'src/store/auth/auth-actions'
import { AuthState, getCurrentUser } from 'src/store/auth/auth-reducers'
import { State } from 'src/store/root-reducer'
import { User } from 'src/store/user/user-model'

const { BUTTON, MINIMAL, ICON_STANDARD, ALIGN_RIGHT, MENU_ITEM, POPOVER_DISMISS } = Classes
const { CARET_DOWN } = IconClasses

interface UserMenuProps {
  auth: AuthState
  user: User | null
  triggerLogout: typeof triggerLogout
}

class UserMenu extends React.Component<UserMenuProps> {
  handleMenuItemClick = (open: () => void, onClick: () => void) => {
    return () => {
      open()
      onClick()
    }
  }

  logOut = () => {
    this.props.triggerLogout()
  }

  render() {
    const { auth, user } = this.props

    return (
      <ControlledPopover
        popoverClassName={`${MINIMAL} navbar-popover`}
        position={Position.BOTTOM_RIGHT}
        popoverTarget={
          <Button className={`${BUTTON} ${MINIMAL}`}>
            <div className="navbar-user-icon">{user && user.name[0].toUpperCase()}</div>
            {user && user.name}
            <span className={`${ICON_STANDARD} ${ALIGN_RIGHT} ${CARET_DOWN}`} />
          </Button>
        }
      >
        {({ close, open, shouldDismissPopover }) => (
          <Menu>
            <UserUpdate id={auth.id} onClose={close}>
              {({ onClick }) => (
                <MenuItem
                  className={classes(MENU_ITEM, POPOVER_DISMISS)}
                  onClick={this.handleMenuItemClick(open, onClick)}
                  text="Modify my Profile"
                  shouldDismissPopover={shouldDismissPopover}
                />
              )}
            </UserUpdate>
            <UserUpdate id={auth.id} type="password" onClose={close}>
              {({ onClick }) => (
                <MenuItem
                  className={classes(MENU_ITEM, POPOVER_DISMISS)}
                  onClick={this.handleMenuItemClick(open, onClick)}
                  text="Change my password"
                  shouldDismissPopover={shouldDismissPopover}
                />
              )}
            </UserUpdate>
            <MenuDivider />
            <MenuItem onClick={this.logOut} text="Sign out" />
          </Menu>
        )}
      </ControlledPopover>
    )
  }
}

export default connect((state: State) => ({ auth: state.auth, user: getCurrentUser(state) }), {
  triggerLogout,
})(UserMenu)

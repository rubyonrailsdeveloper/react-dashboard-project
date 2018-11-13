import { Classes, Intent } from '@blueprintjs/core'
import classes from 'classnames'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { indexUrl } from 'src/routes'

const NotFound: React.SFC = () => (
  <main className="not-found">
    <div className="not-found-img" />
    <div className="not-found-text">
      <h1>Page not found.</h1>
      <p>
        The element or page you are looking for <br /> does not exist or has been removed.
      </p>
      <Link
        className={classes(Classes.BUTTON, Classes.MINIMAL, Classes.intentClass(Intent.PRIMARY))}
        to={indexUrl}
      >
        Return to the dashboard
      </Link>
    </div>
  </main>
)

export default NotFound

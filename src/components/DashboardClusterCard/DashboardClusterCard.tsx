import classes from 'classnames'
import * as React from 'react'
import Card from 'src/components/Panel/Card'
import StIcon from 'src/components/StIcon/StIcon'
import { healthClass, healthIcon } from 'src/constants'
import { Cluster } from 'src/store/cluster/cluster-model'

interface DashboardClusterCardProps {
  cluster: Cluster
  className?: string
}

export default class DashboardClusterCard extends React.Component<DashboardClusterCardProps> {
  render() {
    const { cluster, className } = this.props
    const footer = null // TODO: draw graph when unhealthy
    const to = '' // TODO
    return (
      <Card header={null} to={to} footer={footer} className={classes('dashboard-cluster-card', className)}>
        <h3 className="cluster-name">{cluster.name}</h3>
        <div className="pt-text-muted">{cluster.containerStatus.total} containers</div>
        <StIcon className={classes(healthIcon(cluster.health), healthClass(cluster.health))} />
      </Card>
    )
  }
}

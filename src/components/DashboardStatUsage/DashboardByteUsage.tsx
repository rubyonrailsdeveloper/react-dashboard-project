import max from 'lodash-es/max'
import * as React from 'react'
import DashboardStatUsage from 'src/components/DashboardStatUsage/DashboardStatUsage'
import { bytesToHumanSize, scaleBytes } from 'src/util/formating'

interface DashboardByteUsageProps {
  title: string
  used: number | null
  quota: number | null
  containerQuota?: number
  isLoading: boolean
}

const DashboardByteUsage: React.SFC<DashboardByteUsageProps> = ({
  title,
  used,
  quota,
  containerQuota,
  isLoading,
}) => {
  const maxBytes = max([used, quota, containerQuota])
  const { label = '', denom = 1 } = maxBytes ? bytesToHumanSize(maxBytes) : {}
  return (
    <DashboardStatUsage
      title={title}
      used={used && scaleBytes(used) / denom}
      quota={quota && scaleBytes(quota) / denom}
      containerQuota={containerQuota && scaleBytes(containerQuota) / denom}
      unit={label}
      isLoading={isLoading} />
  )
}

export default DashboardByteUsage

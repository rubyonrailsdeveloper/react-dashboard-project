import actionCreatorFactory from 'typescript-fsa'

const actionCreator = actionCreatorFactory('UI')

// Dashboard
export const dashboardMounted = actionCreator('DASHBOARD_MOUNTED')
export const dashboardUnmounted = actionCreator('DASHBOARD_UNMOUNTED')

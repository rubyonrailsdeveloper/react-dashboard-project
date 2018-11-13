import * as React from 'react'

function titleAndSubmitText(text: string) {
  return { title: text, submitText: text }
}

// Group Props
export const deleteGroupProps = {
  confirmationString: 'DELETE',
  destructive: true,
  requireConfirmation: true,
  ...titleAndSubmitText('Delete Group'),
}

// Namespace Props
export const deleteNamespaceProps = {
  confirmationString: 'DELETE',
  destructive: true,
  requireConfirmation: true,
  ...titleAndSubmitText('Delete Namespace'),
}

export const unloadNamespaceProps = {
  dialogBody: <span>Are you sure you want to unload this namespace?</span>,
  ...titleAndSubmitText('Unload Namespace'),
}

export const clearBacklogNamespaceProps = {
  dialogBody: <span>Are you sure you want to clear the backlog of this subscription?</span>,
  ...titleAndSubmitText('Clear Namespace Backlog'),
}

// Pipeline Props
export const deactivatePipelineProps = {
  dialogBody: <span>Are you sure you want to deactivate this pipeline?</span>,
  ...titleAndSubmitText('Deactivate pipeline'),
}

export const activatePipelineProps = {
  dialogBody: <span>Are you sure you want to activate this pipeline?</span>,
  ...titleAndSubmitText('Activate pipeline'),
}

export const terminatePipelineProps = {
  confirmationString: 'TERMINATE',
  destructive: true,
  requireConfirmation: true,
  ...titleAndSubmitText('Terminate pipeline'),
}

// Subscription Props
export const clearBacklogSubscriptionProps = {
  dialogBody: <span>Are you sure you want to clear the backlog of this subscription?</span>,
  destructive: true,
  ...titleAndSubmitText('Clear backlog'),
}

// Topic Props
export const deleteTopicProps = {
  confirmationString: 'DELETE',
  destructive: true,
  requireConfirmation: true,
  ...titleAndSubmitText('Delete topic'),
}

export const unloadTopicProps = {
  dialogBody: <span>Are you sure you want to unload this topic?</span>,
  ...titleAndSubmitText('Unload Topic'),
}

// User Props
export const deleteUserProps = {
  confirmationString: 'DELETE',
  destructive: true,
  requireConfirmation: true,
  ...titleAndSubmitText('Delete user'),
}

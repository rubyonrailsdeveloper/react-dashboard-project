import { Intent } from '@blueprintjs/core'
import { shallow } from 'enzyme'
import * as React from 'react'
import Dialog from '../Dialog'

describe('Dialog component', () => {
  const baseProps = {
    isBusy: false,
    isOpen: true,
    onSubmit() {
      return
    },
  }

  it('should disable submit when requireConfirmation is true', () => {
    const dialog = shallow(<Dialog inline={true} requireConfirmation={true} {...baseProps} />)

    expect(dialog.find('Button.submit').is('[disabled]')).toBe(true)
  })

  it('should be submitable when the input value matches the confirmationString', () => {
    const dialog = shallow(<Dialog inline={true} requireConfirmation={true} {...baseProps} />)

    dialog.find('input').simulate('change', { target: { value: 'DELETE' } })
    expect(dialog.state().isConfirmed).toBe(true)
    expect(dialog.find('Button.submit').prop('disabled')).toBe(false)
  })

  it('should allow you to change the confirmationString', () => {
    const value = 'CONFIRMATION'
    const dialog = shallow(
      <Dialog inline={true} requireConfirmation={true} confirmationString={value} {...baseProps} />
    )

    dialog.find('input').simulate('change', { target: { value: 'FOO' } })
    expect(dialog.state().isConfirmed).toBe(false)
    expect(dialog.find('Button.submit').prop('disabled')).toBe(true)

    dialog.find('input').simulate('change', { target: { value } })
    expect(dialog.state().isConfirmed).toBe(true)
    expect(dialog.find('Button.submit').prop('disabled')).toBe(false)
  })

  it('should not be submittable or cancellable when it is busy', () => {
    const dialog = shallow(<Dialog inline={true} {...baseProps} isBusy={true} />)

    dialog.find('Button').forEach(b => {
      expect(b.is('[disabled]')).toBe(true)
    })
  })

  it('should change the intent when it is a destructive operation', () => {
    const dialog = shallow(<Dialog inline={true} destructive={true} {...baseProps} />)

    expect(dialog.find('Button.submit').prop('intent')).toEqual(Intent.DANGER)
  })
})

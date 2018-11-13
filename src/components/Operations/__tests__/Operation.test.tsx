import { mount, shallow } from 'enzyme'
import * as React from 'react'
import makeOperation from 'src/components/Operations/internal/Operation'
import { NestedId } from 'src/store/constants'
import actionCreatorFactory from 'typescript-fsa'

describe('Operation Component', () => {
  const actionCreator = actionCreatorFactory('DUMMY')
  const dummyTrigger = actionCreator<NestedId>('TRIGGER_OPERATION')
  const Operation = makeOperation<NestedId, string>()
  const baseProps = {
    id: '1',
    toastSuccessText: 'success',
    toastFailureText: 'failure',
    triggerOperation: dummyTrigger,
    onTrigger: jest.fn(),
    onSuccess: jest.fn(),
    onError: jest.fn(),
    children: ({ triggerOperation }: { triggerOperation: () => void }) => {
      return <button onClick={triggerOperation}>Luck I'm your father</button>
    },
    operation: {
      error: null,
      result: null,
      isLoading: false,
    },
  }

  it('should call onTrigger when operation is triggered', () => {
    const Component = mount(<Operation {...baseProps} onTrigger={jest.fn()} />)

    Component.children()
      .first()
      .simulate('click')

    expect(Component.props().onTrigger).toBeCalled()
  })

  it('should call onSuccess when operation.result is provided', () => {
    const Component = shallow(<Operation {...baseProps} onSuccess={jest.fn()} />)

    Component.setProps({
      operation: {
        result: 'OK',
      },
    })

    expect(Component.instance().props.onSuccess).toBeCalled()
  })

  it('should call onError when operation.error  is provided', () => {
    const Component = shallow(<Operation {...baseProps} onError={jest.fn()} />)

    Component.setProps({
      operation: {
        error: {},
      },
    })

    expect(Component.instance().props.onError).toBeCalled()
  })
})

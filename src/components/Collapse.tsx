import {
  AbstractComponent,
  AnimationStates,
  Classes,
  ICollapseProps,
  ICollapseState,
} from '@blueprintjs/core'
import classNames from 'classnames'
import * as React from 'react'

/*
 * A collapse can be in one of 5 states:
 * CLOSED
 * When in this state, the contents of the collapse is not rendered, the collapse height is 0,
 * and the body Y is at -height (so that the bottom of the body is at Y=0).
 *
 * OPEN
 * When in this state, the collapse height is set to auto, and the body Y is set to 0 (so the element can be seen
 * as normal).
 *
 * CLOSING_START
 * When in this state, height has been changed from auto to the measured height of the body to prepare for the
 * closing animation in CLOSING_END.
 *
 * CLOSING_END
 * When in this state, the height is set to 0 and the body Y is at -height. Both of these properties are transformed,
 * and then after the animation is complete, the state changes to CLOSED.
 *
 * OPENING
 * When in this state, the body is re-rendered, height is set to the measured body height and the body Y is set to 0.
 * This is all animated, and on complete, the state changes to OPEN.
 *
 * When changing the isOpen prop, the following happens to the states:
 * isOpen = true : CLOSED -> OPENING -> OPEN
 * isOpen = false: OPEN -> CLOSING_START -> CLOSING_END -> CLOSED
 * These are all animated.
 */
export class Collapse extends AbstractComponent<ICollapseProps, ICollapseState> {
  public static displayName = 'Blueprint.Collapse'

  public static defaultProps: ICollapseProps = {
    component: 'div',
    isOpen: false,
    keepChildrenMounted: false,
    transitionDuration: 200,
  }

  public state = {
    animationState: AnimationStates.OPEN,
    height: '0px',
  }

  // The element containing the contents of the collapse.
  private contents: HTMLElement
  // The most recent non-0 height (once a height has been measured - is 0 until then)
  private height: number = 0

  public componentWillReceiveProps(nextProps: ICollapseProps) {
    if (this.contents != null && this.contents.clientHeight !== 0) {
      this.height = this.contents.clientHeight
    }
    if (this.props.isOpen !== nextProps.isOpen) {
      this.clearTimeouts()
      if (this.state.animationState !== AnimationStates.CLOSED && !nextProps.isOpen) {
        this.setState({
          animationState: AnimationStates.CLOSING_START,
          height: `${this.height}px`,
        })
      } else if (this.state.animationState !== AnimationStates.OPEN && nextProps.isOpen) {
        this.setState({
          animationState: AnimationStates.OPENING,
          height: `${this.height}px`,
        })
        this.setTimeout(() => this.onDelayedStateChange(), this.props.transitionDuration)
      }
    }
  }

  public render() {
    const isContentVisible = this.state.animationState !== AnimationStates.CLOSED
    const shouldRenderChildren = isContentVisible || this.props.keepChildrenMounted
    const displayWithTransform =
      isContentVisible && this.state.animationState !== AnimationStates.CLOSING_END
    const isAutoHeight = this.state.height === 'auto'

    const containerStyle = {
      height: isContentVisible ? this.state.height : undefined,
      overflowY: (isAutoHeight ? 'visible' : undefined) as 'visible' | undefined,
      transition: isAutoHeight ? 'none' : undefined,
    }

    const contentsStyle = {
      transform: displayWithTransform ? 'translateY(0)' : `translateY(-${this.height}px)`,
      transition: isAutoHeight ? 'none' : undefined,
    }

    // HACKHACK: type cast because there's no single overload that supports all
    // three ReactTypes (string | ComponentClass | StatelessComponent)
    return React.createElement(
      this.props.component as any,
      {
        className: classNames(Classes.COLLAPSE, this.props.className),
        style: containerStyle,
      },
      <div
        className="pt-collapse-body"
        ref={this.contentsRefHandler}
        style={contentsStyle}
        aria-hidden={!isContentVisible && this.props.keepChildrenMounted}
      >
        {shouldRenderChildren ? this.props.children : null}
      </div>
    )
  }

  public componentDidMount() {
    this.forceUpdate()
    if (this.props.isOpen) {
      this.setState({ animationState: AnimationStates.OPEN, height: 'auto' })
    } else {
      this.setState({ animationState: AnimationStates.CLOSED })
    }
  }

  public componentDidUpdate() {
    if (this.state.animationState === AnimationStates.CLOSING_START) {
      this.setTimeout(() => {
        // Consider submitting a PR to blueprint's repo. This is required so that previous
        // height change is acknowledge by the browser, ensuring the transition starts at
        // a numeric height (not `auto`). If missing, sometimes the transition will not happen
        // jumping from 100% height to 0 without animation
        // tslint:disable-next-line no-unused-expression
        this.contents.clientHeight

        this.setState({
          animationState: AnimationStates.CLOSING_END,
          height: '0px',
        })
      })
      this.setTimeout(() => this.onDelayedStateChange(), this.props.transitionDuration)
    }
  }

  private contentsRefHandler = (el: HTMLElement | null) => {
    this.contents = el!
    if (el != null) {
      this.height = this.contents.clientHeight
      this.setState({
        animationState: this.props.isOpen ? AnimationStates.OPEN : AnimationStates.CLOSED,
        height: `${this.height}px`,
      })
    }
  }

  private onDelayedStateChange() {
    switch (this.state.animationState) {
      case AnimationStates.OPENING:
        this.setState({ animationState: AnimationStates.OPEN, height: 'auto' })
        break
      case AnimationStates.CLOSING_END:
        this.setState({ animationState: AnimationStates.CLOSED })
        break
      default:
        break
    }
  }
}

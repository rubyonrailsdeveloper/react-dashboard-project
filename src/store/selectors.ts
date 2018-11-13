import { ParametricSelector as ReParametricSelector, Selector as ReSelector } from 'reselect'
import { State } from 'src/store/root-reducer'

export type Selector<R> = ReSelector<State, R>

export type ParametricSelector<P, R> = ReParametricSelector<State, P, R>

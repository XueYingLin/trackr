
// Generic mutable state
export interface MutableState<T> {
  get(): T,
  set(value: T): void
}

export function makeMutable<T>(state: [T, (t: T) => void]) {
  return new MutableStateImpl<T>(state);
}

class MutableStateImpl<T> implements MutableState<T> {
  state: [T, (t: T) => void]

  constructor(state: [T, (t: T) => void]) {
    this.state = state;
  }

  get(): T {
    return this.state[0]
  }

  set(value: T) {
    this.state[1](value)
  }
}
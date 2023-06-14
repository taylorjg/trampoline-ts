// https://en.wikipedia.org/wiki/Tail_call#Through_trampolining

// const RECURSE = Symbol('RECURSE')
// const DONE = Symbol('DONE')
const RECURSE = "RECURSE"
const DONE = "DONE"

type Recurse<T> = {
  type: string,
  thunk: () => Result<T>
}

type Done<T> = {
  type: string,
  result: T
}

export type Result<T> = Recurse<T> | Done<T>

export function recurse<T>(thunk: () => Result<T>) {
  return {
    type: RECURSE,
    thunk
  }
}

export function done<T>(result: T) {
  return {
    type: DONE,
    result
  }
}

export function trampoline<T>(fn: (...args: any[]) => Result<T>) {
  return function (...args: any[]): T {
    let returnValue = fn(...args)
    for (; ;) {
      switch (returnValue.type) {
        case RECURSE:
          returnValue = (returnValue as Recurse<T>).thunk()
          break
        case DONE:
          return (returnValue as Done<T>).result
      }
    }
  }
}

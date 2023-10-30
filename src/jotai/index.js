import {useEffect} from 'react'
import {useReducer} from 'react'

const store = {
  atomListenersMap: new WeakMap(),
  getAtomValue(atom) {
    return atom.get()
  },
  setAtomValue(atom, args) {
    let value = args
    if (typeof args === 'function') {
      value = args(atom.get())
    }
    atom.set(value)
    const listeners = this.atomListenersMap.get(atom)
    if (listeners) listeners.forEach((l) => l())
  },
  sub(atom, listener) {
    let listeners = this.atomListenersMap.get(atom)
    if (!listeners) {
      listeners = new Set()
      this.atomListenersMap.set(atom, listeners)
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export const atom = (value) => {
  const _atom = {
    value,
    get() {
      return this.value
    },
    set(val) {
      this.value = val
    },
  }

  return _atom
}

const useAtomValue = (atom) => {
  const [value, rerender] = useReducer(
    () => {
      return store.getAtomValue(atom)
    },
    undefined,
    () => store.getAtomValue(atom)
  )

  useEffect(() => {
    const unsub = store.sub(atom, () => {
      rerender()
    })
    return unsub
  }, [])

  return value
}

const useSetAtom = (atom) => {
  return (args) => {
    store.setAtomValue(atom, args)
  }
}

export const useAtom = (atom) => {
  return [useAtomValue(atom), useSetAtom(atom)]
}

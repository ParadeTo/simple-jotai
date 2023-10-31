import {useEffect} from 'react'
import {useReducer} from 'react'

const store = {
  atomListenersMap: new WeakMap(),
  atomDependencies: new WeakMap(),
  getAtomValue(atom) {
    const getter = (a) => {
      if (a !== atom) {
        // atom 依赖 a
        // 把 atom 添加到 a 的依赖集合中
        let dependencies = this.atomDependencies.get(a)
        if (!dependencies) {
          dependencies = new Set()
          this.atomDependencies.set(a, dependencies)
        }
        if (!dependencies.has(atom)) dependencies.add(atom)
        return this.getAtomValue(a)
      } else {
        return a.value
      }
    }
    console.log(this.atomDependencies)
    return atom.read(getter)
  },
  setAtomValue(atom, args) {
    let value = args
    if (typeof args === 'function') {
      value = args(this.getAtomValue(atom))
    }
    atom.write(value)
    this.notify(atom)
  },
  notify(atom) {
    const listeners = this.atomListenersMap.get(atom)
    if (listeners) listeners.forEach((l) => l())
    const dependencies = this.atomDependencies.get(atom)
    if (dependencies) {
      dependencies.forEach((dependency) => {
        // 还需要通知依赖自己的其他原子
        this.notify(dependency)
      })
    }
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
    write(val) {
      this.value = val
    },
  }

  if (typeof value === 'function') {
    _atom.read = value
  } else {
    _atom.value = value
    _atom.read = function (getter) {
      return getter(this)
    }
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

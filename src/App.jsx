import './App.css'
import {atom, useAtom} from './jotai'
const countAtom = atom(0)

const Counter = () => {
  const [_, setCount] = useAtom(countAtom)
  return <button onClick={() => setCount((prev) => prev + 1)}>Click Me</button>
}

const Text = () => {
  const [count] = useAtom(countAtom)
  return <div>Times: {count}</div>
}

const App = () => (
  <div>
    <Counter />
    <Text />
  </div>
)

export default App

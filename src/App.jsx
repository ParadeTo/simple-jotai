import './App.css'
import {atom, useAtom} from './jotai'

const countAtom = atom(0)
const multipleAtom = atom((get) => get(countAtom) * 100)
const prefixAtom = atom('')
const textAtom = atom((get) => get(prefixAtom) + get(multipleAtom))

const Counter = () => {
  const [_, setCount] = useAtom(countAtom)
  return <button onClick={() => setCount((prev) => prev + 1)}>Click Me</button>
}

const Input = () => {
  const [_, setPrefix] = useAtom(prefixAtom)
  return <input onChange={(e) => setPrefix(e.target.value)} />
}

const Text = () => {
  const [text] = useAtom(textAtom)
  return <div>{text}</div>
}

const App = () => {
  return (
    <div>
      <Counter />
      <Input />
      <Text />
    </div>
  )
}

export default App

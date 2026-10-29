import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Todo = {
  id: string
  title: string
  done: boolean
}

type Filter = 'all' | 'open' | 'done'

const STORAGE_KEY = 'dummy-runtime.todos'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'done', label: 'Done' },
]

function starterTodos(): Todo[] {
  return [
    {
      id: crypto.randomUUID(),
      title: 'Confirm Aiven detected the Dockerfile',
      done: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Open this app on the deployed URL',
      done: false,
    },
  ]
}

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false
  const todo = value as Record<string, unknown>
  return (
    typeof todo.id === 'string' &&
    typeof todo.title === 'string' &&
    typeof todo.done === 'boolean'
  )
}

function readTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return starterTodos()
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isTodo)
  } catch {
    return []
  }
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(readTodos)
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const visible = useMemo(() => {
    if (filter === 'open') return todos.filter((todo) => !todo.done)
    if (filter === 'done') return todos.filter((todo) => todo.done)
    return todos
  }, [filter, todos])

  const openCount = todos.filter((todo) => !todo.done).length
  const doneCount = todos.length - openCount

  function addTodo() {
    const title = draft.trim()
    if (!title) return
    setTodos((current) => [
      { id: crypto.randomUUID(), title, done: false },
      ...current,
    ])
    setDraft('')
  }

  function toggleTodo(id: string) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    )
  }

  function deleteTodo(id: string) {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  function clearDone() {
    setTodos((current) => current.filter((todo) => !todo.done))
  }

  return (
    <main className="shell">
      <header className="masthead">
        <p className="eyebrow">Aiven runtime</p>
        <h1>Tasks</h1>
        <p className="lede">
          A small list kept in this browser. Useful for checking that the
          container came up.
        </p>
      </header>

      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault()
          addTodo()
        }}
      >
        <label className="sr-only" htmlFor="new-task">
          New task
        </label>
        <input
          id="new-task"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a task"
          autoComplete="off"
        />
        <button type="submit">Add</button>
      </form>

      <div className="toolbar">
        <div className="filters" role="group" aria-label="Filter tasks">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="count">
          {openCount} open
          {doneCount > 0 ? ` · ${doneCount} done` : ''}
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="empty">
          {todos.length === 0
            ? 'Nothing here yet. Add the first task above.'
            : 'No tasks in this view.'}
        </p>
      ) : (
        <ul className="list">
          {visible.map((todo) => (
            <li key={todo.id} className={todo.done ? 'done' : undefined}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.title}</span>
              </label>
              <button
                type="button"
                className="delete"
                aria-label={`Delete ${todo.title}`}
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {doneCount > 0 ? (
        <div className="footer">
          <button type="button" className="text" onClick={clearDone}>
            Clear completed
          </button>
        </div>
      ) : null}
    </main>
  )
}

export default App

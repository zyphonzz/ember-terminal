"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { JSX } from "react/jsx-runtime"

interface Application {
  id: number
  name: string
  description: string
  rating: number
  price: string
  link?: string
  tags: string[]
}

interface CommandOutput {
  command: string
  output: string | JSX.Element
  timestamp: Date
}

const BIN_ID = "6832d5068561e97a501b3c2b"
const API_KEY = "$2a$10$hqlbz8FagW8YWBkeXVLhouovoqwqV4alPw/1i2Ty7Pf8YD..HJtlK"
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`

const DEV_CREDENTIALS = { username: "zyphonz", password: "Cookie113!" }

export default function EmberTerminal() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<CommandOutput[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [applications, setApplications] = useState<Application[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isDevLoggedIn, setIsDevLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [addingApp, setAddingApp] = useState(false)
  const [newAppData, setNewAppData] = useState<Partial<Application>>({})
  const [addingStep, setAddingStep] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Fetch data from JSONBin
  const fetchData = async () => {
    try {
      const response = await fetch(JSONBIN_URL, {
        headers: {
          "X-Master-Key": API_KEY,
        },
      })
      const data = await response.json()
      setApplications(data.record.applications || [])
      setCategories(data.record.categories || [])
      setIsLoading(false)
    } catch (err) {
      console.error("Failed to fetch data:", err)
      addOutput("", <div className="text-red-400">Error loading data from server</div>)
      setIsLoading(false)
    }
  }

  // Save data to JSONBin
  const saveData = async () => {
    const data = { applications, categories }
    try {
      await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify(data),
      })
      return true
    } catch (err) {
      console.error("Failed to save data:", err)
      return false
    }
  }

  const addOutput = (command: string, output: string | JSX.Element) => {
    const newEntry: CommandOutput = {
      command,
      output,
      timestamp: new Date(),
    }
    setHistory((prev) => [...prev, newEntry])
  }

  const commands = {
    help: () => (
      <div className="space-y-2">
        <div className="text-green-400">EMBER v0.1 indev - Available Commands:</div>
        <div className="ml-4 space-y-1 text-sm">
          <div>
            <span className="text-blue-400">list</span> or <span className="text-blue-400">ls</span> - Show all
            applications
          </div>
          <div>
            <span className="text-blue-400">filter {"<category>"}</span> - Filter apps by category
          </div>
          <div>
            <span className="text-blue-400">search {"<query>"}</span> - Search applications
          </div>
          <div>
            <span className="text-blue-400">show {"<app_name>"}</span> - Show detailed app info
          </div>
          <div>
            <span className="text-blue-400">open {"<app_name>"}</span> - Open application link
          </div>
          <div>
            <span className="text-blue-400">categories</span> - List all categories
          </div>
          <div>
            <span className="text-blue-400">stats</span> - Show database statistics
          </div>
          <div>
            <span className="text-blue-400">download</span> - Download EMBER local files
          </div>
          <div className="text-yellow-400 mt-2">Developer Commands:</div>
          <div>
            <span className="text-blue-400">dev login</span> - Access developer panel
          </div>
          <div>
            <span className="text-blue-400">dev add</span> - Add new application (requires login)
          </div>
          <div>
            <span className="text-blue-400">dev export</span> - Export all data (requires login)
          </div>
          <div>
            <span className="text-blue-400">dev clear</span> - Clear all data (requires login)
          </div>
          <div>
            <span className="text-blue-400">dev logout</span> - Logout from developer panel
          </div>
          <div className="text-gray-400 mt-2">System Commands:</div>
          <div>
            <span className="text-blue-400">clear</span> - Clear terminal
          </div>
          <div>
            <span className="text-blue-400">neofetch</span> - Show system info
          </div>
        </div>
      </div>
    ),

    list: () => renderApplicationList(applications),
    ls: () => renderApplicationList(applications),

    categories: () => (
      <div className="space-y-2">
        <div className="text-green-400">Available Categories ({categories.length}):</div>
        <div className="ml-4 grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <div key={cat} className="text-blue-400">
              {cat}
            </div>
          ))}
        </div>
      </div>
    ),

    stats: () => (
      <div className="space-y-2">
        <div className="text-green-400">EMBER Database Statistics:</div>
        <div className="ml-4 space-y-1">
          <div>
            Total Applications: <span className="text-yellow-400">{applications.length}</span>
          </div>
          <div>
            Categories: <span className="text-yellow-400">{categories.length}</span>
          </div>
          <div>
            Free Apps:{" "}
            <span className="text-yellow-400">{applications.filter((app) => app.tags.includes("free")).length}</span>
          </div>
          <div>
            Premium Apps:{" "}
            <span className="text-yellow-400">{applications.filter((app) => app.tags.includes("premium")).length}</span>
          </div>
          <div>
            Average Rating:{" "}
            <span className="text-yellow-400">
              {applications.length > 0
                ? (applications.reduce((sum, app) => sum + app.rating, 0) / applications.length).toFixed(1)
                : 0}
              /10
            </span>
          </div>
        </div>
      </div>
    ),

    download: () => (
      <div className="space-y-2">
        <div className="text-green-400">EMBER Local Download:</div>
        <div className="ml-4 space-y-1">
          <div>Downloading ember_local.zip and ember_local.tar.gz...</div>
          <div
            className="text-blue-400 underline cursor-pointer"
            onClick={() => {
              window.open("https://github.com/zyphonzz/ember/raw/refs/heads/main/ember_local.tar.gz", "_blank")
              setTimeout(() => {
                window.open("https://github.com/zyphonzz/ember/raw/refs/heads/main/ember_local.zip", "_blank")
              }, 200)
            }}
          >
            📦 Click here if download doesn't start automatically
          </div>
          <div className="text-gray-400 text-sm">Supports: Linux, Windows (Mac coming soon)</div>
        </div>
      </div>
    ),

    neofetch: () => (
      <div className="space-y-1 font-mono text-sm">
        <div className="flex">
          <div className="text-green-400 mr-8">
            {`     ███████`}
            <br />
            {`   ███████████`}
            <br />
            {`  █████████████`}
            <br />
            {`  █████████████`}
            <br />
            {`  █████████████`}
            <br />
            {`   ███████████`}
            <br />
            {`     ███████`}
          </div>
          <div className="space-y-1">
            <div>
              <span className="text-blue-400">OS:</span> EMBER Terminal
            </div>
            <div>
              <span className="text-blue-400">Version:</span> v0.1 indev
            </div>
            <div>
              <span className="text-blue-400">Shell:</span> ember-cli
            </div>
            <div>
              <span className="text-blue-400">Apps:</span> {applications.length} installed
            </div>
            <div>
              <span className="text-blue-400">Categories:</span> {categories.length} available
            </div>
            <div>
              <span className="text-blue-400">Status:</span> {isDevLoggedIn ? "Developer Mode" : "User Mode"}
            </div>
            <div>
              <span className="text-blue-400">Memory:</span> Coffee/Coffee
            </div>
          </div>
        </div>
      </div>
    ),

    clear: () => null,
  }

  const renderApplicationList = (apps: Application[]) => (
    <div className="space-y-3">
      <div className="text-green-400">Applications ({apps.length} found):</div>
      {apps.length === 0 ? (
        <div className="text-gray-400 ml-4">No applications found</div>
      ) : (
        <div className="space-y-2">
          {apps.map((app) => (
            <div key={app.id} className="ml-4 border-l-2 border-blue-400 pl-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">{app.name}</span>
                <span className="text-yellow-400">★{app.rating}/10</span>
                <span className="text-green-400">{app.price}</span>
              </div>
              <div className="text-gray-300 text-sm">{app.description}</div>
              <div className="flex gap-1 mt-1">
                {app.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const executeCommand = async (cmd: string) => {
    const parts = cmd.trim().split(" ")
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    if (command === "clear") {
      setHistory([])
      return
    }

    // Handle adding app flow
    if (addingApp) {
      handleAddAppInput(cmd.trim())
      return
    }

    // Basic commands
    if (commands[command as keyof typeof commands]) {
      const output = commands[command as keyof typeof commands]()
      if (output !== null) {
        addOutput(cmd, output)
      }
      return
    }

    // Filter command
    if (command === "filter" && args.length > 0) {
      const category = args[0].toLowerCase()
      const filtered = applications.filter(
        (app) => app.tags.includes(category) || app.name.toLowerCase().includes(category),
      )
      addOutput(cmd, renderApplicationList(filtered))
      return
    }

    // Search command
    if (command === "search" && args.length > 0) {
      const query = args.join(" ").toLowerCase()
      const filtered = applications.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
      addOutput(cmd, renderApplicationList(filtered))
      return
    }

    // Show command
    if (command === "show" && args.length > 0) {
      const appName = args.join(" ").toLowerCase()
      const app = applications.find((a) => a.name.toLowerCase().includes(appName))
      if (app) {
        const output = (
          <div className="space-y-2">
            <div className="text-green-400">Application Details:</div>
            <div className="ml-4 space-y-1">
              <div>
                <span className="text-blue-400">Name:</span> {app.name}
              </div>
              <div>
                <span className="text-blue-400">Description:</span> {app.description}
              </div>
              <div>
                <span className="text-blue-400">Rating:</span> ★{app.rating}/10
              </div>
              <div>
                <span className="text-blue-400">Price:</span> {app.price}
              </div>
              <div>
                <span className="text-blue-400">Link:</span> {app.link || "No link available"}
              </div>
              <div>
                <span className="text-blue-400">Tags:</span> {app.tags.join(", ")}
              </div>
            </div>
          </div>
        )
        addOutput(cmd, output)
      } else {
        addOutput(cmd, <div className="text-red-400">Application not found: {args.join(" ")}</div>)
      }
      return
    }

    // Open command
    if (command === "open" && args.length > 0) {
      const appName = args.join(" ").toLowerCase()
      const app = applications.find((a) => a.name.toLowerCase().includes(appName))
      if (app && app.link) {
        window.open(app.link, "_blank", "noopener,noreferrer")
        addOutput(cmd, <div className="text-green-400">Opening {app.name}...</div>)
      } else if (app) {
        addOutput(cmd, <div className="text-red-400">No link available for {app.name}</div>)
      } else {
        addOutput(cmd, <div className="text-red-400">Application not found: {args.join(" ")}</div>)
      }
      return
    }

    // Dev commands
    if (command === "dev") {
      if (args[0] === "login") {
        addOutput(
          cmd,
          <div className="space-y-2">
            <div className="text-yellow-400">Developer Authentication Required</div>
            <div className="text-gray-300">Enter credentials (username password):</div>
          </div>,
        )
        // Set up login state
        setAddingApp(true)
        setAddingStep(-1) // Special step for login
        return
      }

      if (!isDevLoggedIn) {
        addOutput(cmd, <div className="text-red-400">Access denied. Use 'dev login' first.</div>)
        return
      }

      if (args[0] === "add") {
        addOutput(cmd, <div className="text-green-400">Starting application creation wizard...</div>)
        setAddingApp(true)
        setAddingStep(0)
        setNewAppData({})
        addOutput("", <div className="text-blue-400">Enter application name:</div>)
        return
      }

      if (args[0] === "logout") {
        setIsDevLoggedIn(false)
        addOutput(cmd, <div className="text-green-400">Logged out from developer panel</div>)
        return
      }

      if (args[0] === "export") {
        const dataStr = JSON.stringify({ applications, categories }, null, 2)
        const blob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "ember-data.json"
        a.click()
        addOutput(cmd, <div className="text-green-400">Data exported to ember-data.json</div>)
        return
      }

      if (args[0] === "clear") {
        setApplications([])
        setCategories([])
        await saveData()
        addOutput(cmd, <div className="text-yellow-400">All data cleared from database</div>)
        return
      }
    }

    // Unknown command
    addOutput(cmd, <div className="text-red-400">Command not found: {cmd}. Type 'help' for available commands.</div>)
  }

  const handleAddAppInput = async (input: string) => {
    // Handle login
    if (addingStep === -1) {
      const [username, password] = input.split(" ")
      if (username === DEV_CREDENTIALS.username && password === DEV_CREDENTIALS.password) {
        setIsDevLoggedIn(true)
        setAddingApp(false)
        addOutput("", <div className="text-green-400">Developer login successful!</div>)
      } else {
        setAddingApp(false)
        addOutput("", <div className="text-red-400">Invalid credentials</div>)
      }
      return
    }

    // Handle app creation steps
    const steps = [
      { field: "name", prompt: "Enter application description:" },
      { field: "description", prompt: "Enter rating (0-10):" },
      { field: "rating", prompt: "Enter price (e.g., $0.00):" },
      { field: "price", prompt: "Enter link URL (optional, press enter to skip):" },
      { field: "link", prompt: "Enter tags (comma-separated):" },
      { field: "tags", prompt: null },
    ]

    const currentStep = steps[addingStep]

    if (currentStep.field === "rating") {
      const rating = Number.parseFloat(input)
      if (isNaN(rating) || rating < 0 || rating > 10) {
        addOutput("", <div className="text-red-400">Invalid rating. Please enter a number between 0 and 10:</div>)
        return
      }
      setNewAppData((prev) => ({ ...prev, [currentStep.field]: rating }))
    } else if (currentStep.field === "tags") {
      const tags = input
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag)
      setNewAppData((prev) => ({ ...prev, [currentStep.field]: tags }))
    } else {
      setNewAppData((prev) => ({ ...prev, [currentStep.field]: input || undefined }))
    }

    setAddingStep((prev) => prev + 1)

    if (addingStep + 1 < steps.length) {
      const nextStep = steps[addingStep + 1]
      if (nextStep.prompt) {
        addOutput("", <div className="text-blue-400">{nextStep.prompt}</div>)
      }
    } else {
      // Create the app
      const newApp: Application = {
        id: Date.now(),
        name: newAppData.name || "",
        description: newAppData.description || "",
        rating: newAppData.rating || 0,
        price: newAppData.price || "$0.00",
        link: newAppData.link,
        tags: newAppData.tags || [],
      }

      setApplications((prev) => [...prev, newApp])
      const saved = await saveData()

      setAddingApp(false)
      setNewAppData({})
      setAddingStep(0)

      if (saved) {
        addOutput("", <div className="text-green-400">Application '{newApp.name}' added successfully!</div>)
      } else {
        addOutput("", <div className="text-red-400">Failed to save application to database</div>)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setCommandHistory((prev) => [...prev, input])
      setHistoryIndex(-1)
      executeCommand(input)
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        }
      }
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    fetchData()

    // Welcome message
    const welcomeOutput: CommandOutput = {
      command: "",
      output: (
        <div className="space-y-2">
          <div className="text-green-400 font-bold text-lg">EMBER v0.1 indev - Application Store Terminal</div>
          <div className="text-blue-400">Loading applications from database...</div>
          <div className="text-gray-300">Type 'help' to see available commands.</div>
          <div className="text-gray-400 text-sm">Use arrow keys to navigate command history.</div>
        </div>
      ),
      timestamp: new Date(),
    }
    setHistory([welcomeOutput])
  }, [])

  useEffect(() => {
    if (!isLoading && applications.length > 0) {
      addOutput(
        "",
        <div className="text-green-400">
          Database loaded: {applications.length} applications, {categories.length} categories
        </div>,
      )
    }
  }, [isLoading, applications.length])

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="container mx-auto p-4 max-w-6xl">
        <div ref={terminalRef} className="min-h-screen overflow-y-auto" onClick={() => inputRef.current?.focus()}>
          {/* Loading indicator */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="text-green-400 text-xl animate-pulse">
                EMBER LOADING<span className="animate-ping">...</span>
              </div>
            </div>
          )}

          {/* Command history */}
          {history.map((entry, index) => (
            <div key={index} className="mb-4">
              {entry.command && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-400">[ember@terminal]</span>
                  <span className="text-blue-400">~/store</span>
                  <span className="text-white">$</span>
                  <span className="text-gray-300">{entry.command}</span>
                </div>
              )}
              <div className="text-gray-100 ml-0">{entry.output}</div>
            </div>
          ))}

          {/* Current input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-green-400">[ember@terminal]</span>
            <span className="text-blue-400">~/store</span>
            <span className="text-white">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
              autoFocus
              spellCheck={false}
              placeholder={addingApp ? "Enter response..." : "Type command..."}
            />
          </form>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Terminal, Mail, Github, Linkedin, ExternalLink, type XIcon as JSX } from "lucide-react"

interface CommandOutput {
  command: string
  output: string | JSX.Element
  timestamp: Date
}

export default function Component() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<CommandOutput[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const commands = {
    help: () => (
      <div className="space-y-2">
        <div className="text-green-400">Available commands:</div>
        <div className="ml-4 space-y-1">
          <div>
            <span className="text-blue-400">about</span> - Learn about me
          </div>
          <div>
            <span className="text-blue-400">skills</span> - View my technical skills
          </div>
          <div>
            <span className="text-blue-400">projects</span> - See my projects
          </div>
          <div>
            <span className="text-blue-400">experience</span> - View work experience
          </div>
          <div>
            <span className="text-blue-400">contact</span> - Get my contact information
          </div>
          <div>
            <span className="text-blue-400">social</span> - View social links
          </div>
          <div>
            <span className="text-blue-400">resume</span> - Download my resume
          </div>
          <div>
            <span className="text-blue-400">clear</span> - Clear the terminal
          </div>
          <div>
            <span className="text-blue-400">neofetch</span> - Display system info
          </div>
        </div>
      </div>
    ),
    about: () => (
      <div className="space-y-2">
        <div className="text-green-400">About Me</div>
        <div className="ml-4 space-y-1">
          <div>👋 Hi! I'm a passionate full-stack developer</div>
          <div>🎓 Computer Science graduate with 3+ years of experience</div>
          <div>💻 I love building web applications and solving complex problems</div>
          <div>🌱 Always learning new technologies and best practices</div>
          <div>🎯 Currently focused on React, Node.js, and cloud technologies</div>
        </div>
      </div>
    ),
    skills: () => (
      <div className="space-y-2">
        <div className="text-green-400">Technical Skills</div>
        <div className="ml-4 space-y-2">
          <div>
            <span className="text-yellow-400">Languages:</span> JavaScript, TypeScript, Python, Java, Go
          </div>
          <div>
            <span className="text-yellow-400">Frontend:</span> React, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS
          </div>
          <div>
            <span className="text-yellow-400">Backend:</span> Node.js, Express, FastAPI, PostgreSQL, MongoDB
          </div>
          <div>
            <span className="text-yellow-400">Tools:</span> Git, Docker, AWS, Vercel, Linux, VS Code
          </div>
          <div>
            <span className="text-yellow-400">Other:</span> REST APIs, GraphQL, CI/CD, Agile, Testing
          </div>
        </div>
      </div>
    ),
    projects: () => (
      <div className="space-y-2">
        <div className="text-green-400">Featured Projects</div>
        <div className="ml-4 space-y-3">
          <div className="border-l-2 border-blue-400 pl-3">
            <div className="text-blue-400 font-bold">E-Commerce Platform</div>
            <div className="text-sm text-gray-300">Full-stack web application with React, Node.js, and PostgreSQL</div>
            <div className="text-xs text-gray-400">Features: User auth, payment processing, admin dashboard</div>
          </div>
          <div className="border-l-2 border-blue-400 pl-3">
            <div className="text-blue-400 font-bold">Task Management API</div>
            <div className="text-sm text-gray-300">RESTful API built with Express.js and MongoDB</div>
            <div className="text-xs text-gray-400">
              Features: CRUD operations, user authentication, real-time updates
            </div>
          </div>
          <div className="border-l-2 border-blue-400 pl-3">
            <div className="text-blue-400 font-bold">Weather Dashboard</div>
            <div className="text-sm text-gray-300">React app with weather API integration and data visualization</div>
            <div className="text-xs text-gray-400">Features: Location-based weather, forecasts, responsive design</div>
          </div>
        </div>
      </div>
    ),
    experience: () => (
      <div className="space-y-2">
        <div className="text-green-400">Work Experience</div>
        <div className="ml-4 space-y-3">
          <div className="border-l-2 border-yellow-400 pl-3">
            <div className="text-yellow-400 font-bold">Senior Frontend Developer</div>
            <div className="text-sm text-gray-300">TechCorp Inc. • 2022 - Present</div>
            <div className="text-xs text-gray-400">
              Led development of customer-facing web applications using React and TypeScript
            </div>
          </div>
          <div className="border-l-2 border-yellow-400 pl-3">
            <div className="text-yellow-400 font-bold">Full Stack Developer</div>
            <div className="text-sm text-gray-300">StartupXYZ • 2021 - 2022</div>
            <div className="text-xs text-gray-400">Built and maintained web applications using MERN stack</div>
          </div>
          <div className="border-l-2 border-yellow-400 pl-3">
            <div className="text-yellow-400 font-bold">Junior Developer</div>
            <div className="text-sm text-gray-300">WebSolutions Ltd. • 2020 - 2021</div>
            <div className="text-xs text-gray-400">
              Developed responsive websites and learned modern web technologies
            </div>
          </div>
        </div>
      </div>
    ),
    contact: () => (
      <div className="space-y-2">
        <div className="text-green-400">Contact Information</div>
        <div className="ml-4 space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>john.doe@email.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">📱</span>
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">📍</span>
            <span>San Francisco, CA</span>
          </div>
        </div>
      </div>
    ),
    social: () => (
      <div className="space-y-2">
        <div className="text-green-400">Social Links</div>
        <div className="ml-4 space-y-1">
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-blue-400" />
            <span>github.com/johndoe</span>
          </div>
          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-blue-400" />
            <span>linkedin.com/in/johndoe</span>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <span>johndoe.dev</span>
          </div>
        </div>
      </div>
    ),
    resume: () => (
      <div className="space-y-2">
        <div className="text-green-400">Resume</div>
        <div className="ml-4">
          <div className="text-blue-400 underline cursor-pointer">📄 Download Resume (PDF)</div>
          <div className="text-xs text-gray-400 mt-1">Last updated: December 2024</div>
        </div>
      </div>
    ),
    neofetch: () => (
      <div className="space-y-1 font-mono text-sm">
        <div className="flex">
          <div className="text-blue-400 mr-8">
            {`     /\\     `}
            <br />
            {`    /  \\    `}
            <br />
            {`   /    \\   `}
            <br />
            {`  /______\\  `}
            <br />
            {`  \\      /  `}
            <br />
            {`   \\    /   `}
            <br />
            {`    \\  /    `}
            <br />
            {`     \\/     `}
          </div>
          <div className="space-y-1">
            <div>
              <span className="text-blue-400">OS:</span> Arch Linux x86_64
            </div>
            <div>
              <span className="text-blue-400">Host:</span> Portfolio Terminal
            </div>
            <div>
              <span className="text-blue-400">Kernel:</span> 6.6.8-arch1-1
            </div>
            <div>
              <span className="text-blue-400">Shell:</span> portfolio-cli
            </div>
            <div>
              <span className="text-blue-400">Terminal:</span> web-terminal
            </div>
            <div>
              <span className="text-blue-400">CPU:</span> Developer Brain (8) @ 3.2GHz
            </div>
            <div>
              <span className="text-blue-400">Memory:</span> Coffee/Coffee
            </div>
          </div>
        </div>
      </div>
    ),
    clear: () => null,
    ls: () => (
      <div className="space-y-1">
        <div className="flex gap-4">
          <span className="text-blue-400">drwxr-xr-x</span>
          <span className="text-blue-400">projects/</span>
        </div>
        <div className="flex gap-4">
          <span className="text-blue-400">drwxr-xr-x</span>
          <span className="text-blue-400">skills/</span>
        </div>
        <div className="flex gap-4">
          <span className="text-green-400">-rw-r--r--</span>
          <span className="text-white">resume.pdf</span>
        </div>
        <div className="flex gap-4">
          <span className="text-green-400">-rw-r--r--</span>
          <span className="text-white">about.txt</span>
        </div>
      </div>
    ),
    whoami: () => <div>john-doe</div>,
    pwd: () => <div>/home/john-doe/portfolio</div>,
  }

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()

    if (trimmedCmd === "clear") {
      setHistory([])
      return
    }

    let output: string | JSX.Element = `Command not found: ${cmd}. Type 'help' for available commands.`

    if (commands[trimmedCmd as keyof typeof commands]) {
      output = commands[trimmedCmd as keyof typeof commands]()
    }

    const newEntry: CommandOutput = {
      command: cmd,
      output,
      timestamp: new Date(),
    }

    setHistory((prev) => [...prev, newEntry])
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
    // Welcome message
    const welcomeOutput: CommandOutput = {
      command: "",
      output: (
        <div className="space-y-2">
          <div className="text-blue-400 font-bold text-lg">Welcome to John Doe's Portfolio Terminal</div>
          <div className="text-green-400">Arch Linux 6.6.8-arch1-1 (tty1)</div>
          <div className="text-gray-300">Type 'help' to see available commands.</div>
          <div className="text-gray-400 text-sm">Use arrow keys to navigate command history.</div>
        </div>
      ),
      timestamp: new Date(),
    }
    setHistory([welcomeOutput])
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="bg-black rounded-lg border border-gray-700 shadow-2xl">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Terminal className="w-4 h-4" />
              <span className="text-sm">john-doe@arch-portfolio: ~/portfolio</span>
            </div>
          </div>

          <div
            ref={terminalRef}
            className="p-4 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((entry, index) => (
              <div key={index} className="mb-4">
                {entry.command && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">[john-doe@arch-portfolio]</span>
                    <span className="text-blue-400">~/portfolio</span>
                    <span className="text-white">$</span>
                    <span className="text-gray-300">{entry.command}</span>
                  </div>
                )}
                <div className="text-gray-100 ml-0">{entry.output}</div>
              </div>
            ))}

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-green-400">[john-doe@arch-portfolio]</span>
              <span className="text-blue-400">~/portfolio</span>
              <span className="text-white">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-white caret-green-400"
                autoFocus
                spellCheck={false}
              />
            </form>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-500 text-sm">
          <p>This portfolio is best viewed in full screen. Press F11 for the authentic terminal experience.</p>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

export default function SlowKeyboard() {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [delay, setDelay] = useState([200])
  const [keyQueue, setKeyQueue] = useState<string[]>([])
  const [currentKey, setCurrentKey] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const processingRef = useRef(false)

  // Process the key queue with delay
  useEffect(() => {
    if (keyQueue.length > 0 && !processingRef.current) {
      processingRef.current = true
      setIsTyping(true)
      
      const nextKey = keyQueue[0]
      setCurrentKey(nextKey)
      
      const timer = setTimeout(() => {
        setKeyQueue(prev => prev.slice(1))
        
        if (nextKey === 'Backspace') {
          setText(prev => prev.slice(0, -1))
        } else if (nextKey === 'Enter') {
          setText(prev => prev + '\n')
        } else if (nextKey === 'Space') {
          setText(prev => prev + ' ')
        } else if (nextKey.length === 1) {
          setText(prev => prev + nextKey)
        }
        
        setCurrentKey(null)
        processingRef.current = false
        
        if (keyQueue.length <= 1) {
          setIsTyping(false)
        }
      }, delay[0])

      return () => clearTimeout(timer)
    }
  }, [keyQueue, delay])

  const handleKeyPress = (key: string) => {
    setKeyQueue(prev => [...prev, key])
  }

  const clearText = () => {
    setText("")
    setKeyQueue([])
    setCurrentKey(null)
    setIsTyping(false)
    processingRef.current = false
  }

  const keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">Slow Keyboard Simulator</h1>
          <p className="text-slate-600">Experience typing with artificial delay - each key press is processed slowly</p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Settings
              {isTyping && <Badge variant="secondary" className="animate-pulse">Processing...</Badge>}
            </CardTitle>
            <CardDescription>
              Adjust the typing delay and clear the text area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Typing Delay: {delay[0]}ms
              </label>
              <Slider
                value={delay}
                onValueChange={setDelay}
                max={1000}
                min={50}
                step={50}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={clearText} variant="outline">
                Clear Text
              </Button>
              <Button 
                onClick={() => handleKeyPress('Hello World!')} 
                variant="outline"
                disabled={isTyping}
              >
                Type "Hello World!"
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Text Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Output
              {currentKey && (
                <Badge variant="destructive" className="animate-bounce">
                  Processing: {currentKey === 'Space' ? '␣' : currentKey}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Text appears here with delay after each key press
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              ref={textareaRef}
              value={text}
              readOnly
              className="w-full h-32 p-3 border rounded-md bg-slate-50 font-mono text-sm resize-none focus:outline-none"
              placeholder="Start typing on the virtual keyboard below..."
            />
            <div className="mt-2 text-xs text-slate-500">
              Characters: {text.length} | Queue: {keyQueue.length} pending
            </div>
          </CardContent>
        </Card>

        {/* Virtual Keyboard */}
        <Card>
          <CardHeader>
            <CardTitle>Virtual Keyboard</CardTitle>
            <CardDescription>
              Click keys to experience slow typing simulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {keys.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1">
                  {row.map((key) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      className={`w-10 h-10 font-mono ${
                        currentKey === key ? 'bg-red-100 border-red-300' : ''
                      } ${
                        keyQueue.includes(key) ? 'bg-yellow-50 border-yellow-300' : ''
                      }`}
                      onClick={() => handleKeyPress(key)}
                      disabled={isTyping && currentKey === key}
                    >
                      {key}
                    </Button>
                  ))}
                </div>
              ))}
              
              {/* Special Keys */}
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  className={`px-6 ${
                    currentKey === 'Space' ? 'bg-red-100 border-red-300' : ''
                  } ${
                    keyQueue.includes('Space') ? 'bg-yellow-50 border-yellow-300' : ''
                  }`}
                  onClick={() => handleKeyPress('Space')}
                  disabled={isTyping && currentKey === 'Space'}
                >
                  Space
                </Button>
                <Button
                  variant="outline"
                  className={`px-4 ${
                    currentKey === 'Enter' ? 'bg-red-100 border-red-300' : ''
                  } ${
                    keyQueue.includes('Enter') ? 'bg-yellow-50 border-yellow-300' : ''
                  }`}
                  onClick={() => handleKeyPress('Enter')}
                  disabled={isTyping && currentKey === 'Enter'}
                >
                  Enter
                </Button>
                <Button
                  variant="outline"
                  className={`px-4 ${
                    currentKey === 'Backspace' ? 'bg-red-100 border-red-300' : ''
                  } ${
                    keyQueue.includes('Backspace') ? 'bg-yellow-50 border-yellow-300' : ''
                  }`}
                  onClick={() => handleKeyPress('Backspace')}
                  disabled={isTyping && currentKey === 'Backspace'}
                >
                  ⌫
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-700">{delay[0]}ms</div>
                <div className="text-sm text-slate-500">Current Delay</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-700">{keyQueue.length}</div>
                <div className="text-sm text-slate-500">Keys in Queue</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${isTyping ? 'text-red-600' : 'text-green-600'}`}>
                  {isTyping ? 'BUSY' : 'READY'}
                </div>
                <div className="text-sm text-slate-500">Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

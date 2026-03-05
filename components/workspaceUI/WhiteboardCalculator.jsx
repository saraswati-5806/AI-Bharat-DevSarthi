// components/panels/WhiteboardCalculator.jsx
'use client'
import { useState } from 'react'
import { Calculator, Trash2, Copy } from 'lucide-react'

export default function WhiteboardCalculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState([])

  const calculate = () => {
    try {
      // Safe evaluation (replace with proper math library for production)
      const evalResult = eval(expression)
      setResult(evalResult.toString())
      setHistory(prev => [...prev, { expression, result: evalResult }].slice(-5))
    } catch (error) {
      setResult('Error')
    }
  }

  const clear = () => {
    setExpression('')
    setResult('')
  }

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ]

  const handleButtonClick = (btn) => {
    if (btn === '=') {
      calculate()
    } else {
      setExpression(prev => prev + btn)
    }
  }

  return (
    <div className="h-full flex flex-col card overflow-hidden">
      {/* Header */}
      <div className="p-4 flex-shrink-0" style={{borderBottom: '1px solid var(--border-light)'}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold" style={{color: 'var(--text-dark)'}}>Calculator</h3>
              <div className="text-xs" style={{color: 'var(--text-secondary)'}}>Quick calculations</div>
            </div>
          </div>
          <button
            onClick={clear}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" style={{color: 'var(--text-secondary)'}} />
          </button>
        </div>
      </div>

      {/* Display */}
      <div className="p-4 flex-shrink-0" style={{background: 'var(--bg-canvas)'}}>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Enter expression..."
          className="w-full px-4 py-3 text-right text-lg font-mono rounded-lg mb-2"
          style={{
            background: 'white',
            border: '2px solid var(--border-light)',
            color: 'var(--text-primary)'
          }}
        />
        <div className="text-right text-2xl font-bold" style={{color: 'var(--brand-blue)'}}>
          {result || '0'}
        </div>
      </div>

      {/* Calculator Buttons */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => handleButtonClick(btn)}
              className="p-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
              style={{
                background: btn === '=' ? 'var(--brand-gradient)' : 'white',
                color: btn === '=' ? 'white' : 'var(--text-primary)',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Scientific Functions */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {['sin', 'cos', 'tan', 'sqrt', 'pow', 'log'].map((fn, idx) => (
            <button
              key={idx}
              onClick={() => setExpression(prev => prev + `Math.${fn}(`)}
              className="p-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-50"
              style={{
                background: 'white',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-light)'
              }}
            >
              {fn}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="p-4 flex-shrink-0" style={{borderTop: '1px solid var(--border-light)'}}>
          <div className="text-xs font-bold mb-2" style={{color: 'var(--text-secondary)'}}>
            History
          </div>
          <div className="space-y-1">
            {history.map((item, idx) => (
              <div 
                key={idx}
                className="flex justify-between text-xs p-2 rounded"
                style={{background: 'var(--bg-canvas)'}}
              >
                <span style={{color: 'var(--text-secondary)'}}>{item.expression}</span>
                <span style={{color: 'var(--text-primary)'}} className="font-bold">= {item.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
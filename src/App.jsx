import { useState, useEffect } from 'react'
import {
  Typography,
  Container,
  TextField,
  Box,
  Paper
} from '@mui/material'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')
  const [boxes, setBoxes] = useState([])
  const [clickedBoxes, setClickedBoxes] = useState(new Set())
  const [clickOrder, setClickOrder] = useState([])
  const [isReverting, setIsReverting] = useState(false)

  const validateAndGenerate = () => {
    // Clear previous error
    setError('')
    
    // Check if input is empty
    if (!inputValue.trim()) {
      setError('Please enter a number')
      return
    }

    // Check if input is a valid integer
    const num = parseInt(inputValue)
    if (isNaN(num) || !Number.isInteger(parseFloat(inputValue))) {
      setError('Please enter a valid integer')
      return
    }

    // Check if number is in range 5-25
    if (num < 5 || num > 25) {
      setError('Number must be between 5 and 25')
      return
    }

    // Generate C shape boxes
    generateCShape(num)
  }

  const generateCShape = (num) => {
    const boxSize = 50
    const gap = 5
    
    // Determine number of rows based on input
    let rows
    if (num <= 8) {
      rows = 3 // Small numbers: 3 rows
    } else if (num <= 15) {
      rows = 4 // Medium numbers: 4 rows
    } else {
      rows = 5 // Large numbers: 5 rows
    }
    
    const newBoxes = []
    let boxesUsed = 0
    
    // Improved distribution for better C shape
    let topRowBoxes, bottomRowBoxes, middleBoxes
    
    if (num <= 6) {
      // Special case for small numbers to ensure C shape
      topRowBoxes = Math.ceil(num / 2)
      bottomRowBoxes = Math.floor(num / 2)
      middleBoxes = 1 // Always ensure at least 1 box in middle
      
      // Adjust to ensure we don't exceed the total number
      const total = topRowBoxes + bottomRowBoxes + middleBoxes
      if (total > num) {
        // Reduce from top row first, then bottom
        const excess = total - num
        if (excess <= topRowBoxes) {
          topRowBoxes -= excess
        } else {
          topRowBoxes = 0
          bottomRowBoxes -= (excess - topRowBoxes)
        }
      }
    } else {
      // For larger numbers, use percentage-based distribution
      topRowBoxes = Math.ceil(num * 0.4)
      bottomRowBoxes = Math.ceil(num * 0.4)
      middleBoxes = num - topRowBoxes - bottomRowBoxes
      
      // Ensure we have at least 1 box in middle for C shape
      if (middleBoxes < 1) {
        middleBoxes = 1
        // Adjust top and bottom to accommodate
        const remaining = num - middleBoxes
        topRowBoxes = Math.ceil(remaining / 2)
        bottomRowBoxes = remaining - topRowBoxes
      }
    }
    
    // Top row
    for (let col = 0; col < topRowBoxes && boxesUsed < num; col++) {
      newBoxes.push({
        id: `0-${col}`,
        x: col * (boxSize + gap),
        y: 0
      })
      boxesUsed++
    }
    
    // Middle rows - ensure C shape by placing boxes on the left
    const middleRows = rows - 2
    if (middleRows > 0 && middleBoxes > 0) {
      const boxesPerMiddleRow = Math.ceil(middleBoxes / middleRows)
      
      for (let row = 1; row < rows - 1 && boxesUsed < num; row++) {
        const boxesInThisRow = Math.min(boxesPerMiddleRow, num - boxesUsed)
        
        // For middle rows, place boxes on the left to form C shape
        for (let col = 0; col < boxesInThisRow; col++) {
          newBoxes.push({
            id: `${row}-${col}`,
            x: col * (boxSize + gap),
            y: row * (boxSize + gap)
          })
          boxesUsed++
        }
      }
    }
    
    // Bottom row
    const remainingBoxes = num - boxesUsed
    for (let col = 0; col < remainingBoxes; col++) {
      newBoxes.push({
        id: `${rows - 1}-${col}`,
        x: col * (boxSize + gap),
        y: (rows - 1) * (boxSize + gap)
      })
      boxesUsed++
    }
    
    setBoxes(newBoxes)
  }

  // Check if all boxes are green and trigger revert
  useEffect(() => {
    if (boxes.length > 0 && clickedBoxes.size === boxes.length && !isReverting) {
      // Add a small delay so user can see the last box turn green
      setTimeout(() => {
        revertBoxes()
      }, 1000) // 1000ms delay
    }
  }, [clickedBoxes.size, boxes.length, isReverting])

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateAndGenerate()
    }
  }

  const handleBoxClick = (boxId) => {
    // Don't allow clicking while reverting
    if (isReverting) return
    // Don't allow clicking on already green boxes
    if (clickedBoxes.has(boxId)) return

    setClickedBoxes(prev => {
      const newSet = new Set(prev)
      newSet.add(boxId)
      // Add to click order
      setClickOrder(prevOrder => [...prevOrder, boxId])
      return newSet
    })
  }

  const revertBoxes = () => {
    if (clickOrder.length === 0) return
    
    setIsReverting(true)
    const reversedOrder = [...clickOrder].reverse()
    
    reversedOrder.forEach((boxId, index) => {
      setTimeout(() => {
        setClickedBoxes(prev => {
          const newSet = new Set(prev)
          newSet.delete(boxId)
          return newSet
        })
        
        // If this is the last box to revert, allow clicking again
        if (index === reversedOrder.length - 1) {
          setTimeout(() => {
            setIsReverting(false)
            setClickOrder([])
          }, 1000)
        }
      }, index * 1000) // 1 second delay between each revert
    })
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Input Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <TextField
          label="Enter number (5-25)"
          variant="outlined"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          error={!!error}
          helperText={error}
          sx={{ width: 300 }}
        />
      </Box>

      {/* C Shape Display */}
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        {boxes.length > 0 && (
            <Box
              sx={{
                position: 'relative',
                display: 'inline-block',
                height: '100%',
                width: '100%'
              }}
            >
              {boxes.map((box) => (
                <Box
                  key={box.id}
                  onClick={() => handleBoxClick(box.id)}
                  sx={{
                    position: 'absolute',
                    left: box.x,
                    top: box.y,
                    width: 50,
                    height: 50,
                    backgroundColor: clickedBoxes.has(box.id) ? '#4caf50' : '#d32f2f',
                    border: `2px solid ${clickedBoxes.has(box.id) ? '#2e7d32' : '#b71c1c'}`,
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                    }
                  }}
                />
              ))}
            </Box>
        )}
      </Box>
    </Container>
  )
}

export default App

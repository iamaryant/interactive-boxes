import { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Box,
  Button,
  Stack,
} from '@mui/material';
import { generateSymmetricalCShapePattern } from './utils';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]); // 2D array for C shape
  const [clickedBoxes, setClickedBoxes] = useState(new Set());
  const [clickOrder, setClickOrder] = useState([]);
  const [isReverting, setIsReverting] = useState(false);

  const validateAndGenerate = () => {
    setError('');
    if (!inputValue.trim()) {
      setError('Please enter a number');
      return;
    }
    const num = parseInt(inputValue);
    if (isNaN(num) || !Number.isInteger(parseFloat(inputValue))) {
      setError('Please enter a valid integer');
      return;
    }
    if (num < 5 || num > 25) {
      setError('Number must be between 5 and 25');
      return;
    }
    generateCShape(num);
  };

  const generateCShape = (n) => {
    const pattern = generateSymmetricalCShapePattern(n);
    const result = pattern.map((row, rowIdx) =>
      row.map((_, colIdx) => ({ id: `${rowIdx}-${colIdx}` }))
    );
    setRows(result);
    setClickedBoxes(new Set());
    setClickOrder([]);
    setIsReverting(false);
  };

  useEffect(() => {
    const totalBoxes = rows.flat().length;
    if (
      totalBoxes > 0 &&
      clickedBoxes.size === totalBoxes &&
      !isReverting
    ) {
      setTimeout(() => {
        revertBoxes();
      }, 1000);
    }
  }, [clickedBoxes.size, rows, isReverting]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (error) setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateAndGenerate();
    }
  };

  const handleBoxClick = (boxId) => {
    if (isReverting) return;
    if (clickedBoxes.has(boxId)) return;
    setClickedBoxes((prev) => {
      const newSet = new Set(prev);
      newSet.add(boxId);
      setClickOrder((prevOrder) => [...prevOrder, boxId]);
      return newSet;
    });
  };

  const revertBoxes = () => {
    if (clickOrder.length === 0) return;
    setIsReverting(true);
    const reversedOrder = [...clickOrder].reverse();
    reversedOrder.forEach((boxId, index) => {
      setTimeout(() => {
        setClickedBoxes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(boxId);
          return newSet;
        });
        if (index === reversedOrder.length - 1) {
          setIsReverting(false);
          setClickOrder([]);
        }
      }, index * 1000);
    });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Input Section */}
      <Stack
        sx={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
          gap: 2,
        }}
        direction="column"
      >
        <TextField
          label="Enter number (5-25)"
          variant="outlined"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          error={!!error}
          helperText={error}
          sx={{
            width: { xs: '100%', sm: 300 },
          }}
        />
        <Button
          variant="contained"
          onClick={() => validateAndGenerate()}
          sx={{ width: { xs: '100%', sm: 300 } }}
        >
          Generate
        </Button>
      </Stack>

      {/* C Shape Display */}
      <Stack
        sx={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        direction="row"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: { xs: '2px', sm: '5px' },
          }}
        >
          {rows.length > 0 &&
            rows.map((row, rowIndex) => (
              <Box
                key={rowIndex}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: { xs: '2px', sm: '5px' },
                  flexWrap: 'no-wrap',
                }}
              >
                {row.map((box) => (
                  <Box
                    key={box.id}
                    onClick={() => handleBoxClick(box.id)}
                    sx={{
                      width: { xs: 25, sm: 50 },
                      height: { xs: 25, sm: 50 },
                      backgroundColor: clickedBoxes.has(box.id)
                        ? '#4caf50'
                        : '#d32f2f',
                      border: `2px solid ${
                        clickedBoxes.has(box.id) ? '#2e7d32' : '#b71c1c'
                      }`,
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      },
                    }}
                  />
                ))}
              </Box>
            ))}
        </Box>
      </Stack>
    </Container>
  );
}

export default App;

import { useCallback, useRef, useState } from 'react';
import produce from 'immer';
import './App.css';

const numRows = 30;
const numCols = 30;

const operations = [
	[-1,-1],
	[-1,0],
	[-1,1],
	[0,-1],
	[0,1],
	[1,-1],
	[1,0],
	[1,1],
]

const App = () => {
	const newGrid = () => {
		const rows = [];
		for (let i = 0; i < numRows; i++) {
			rows.push(Array.from(Array(numCols), () => 0));
		}
		return rows;
	}

	const [running, setRunning] = useState(false);
	const [grid, setGrid] = useState(() => newGrid());

	const runningRef = useRef(running);
	runningRef.current = running;

	const switchCell = (rowIdx, colIdx, state = null) => {
		const newGrid = produce(grid, gridCopy => {
			if(state != null)
				gridCopy[rowIdx][colIdx] = state;
			else
				gridCopy[rowIdx][colIdx] = !gridCopy[rowIdx][colIdx];
		})
		setGrid(newGrid);
	};
	
	const hoverCell = (evt, rowIdx, colIdx) => {
		if (evt.buttons === 1) {
			switchCell(rowIdx, colIdx, 1)
		} else if (evt.buttons === 2) {
			switchCell(rowIdx, colIdx, 0)
		}
		// console.log(evt);
	}

	const runSimulation = useCallback(() => {
		if (!runningRef.current) {
			return;
		}
		setGrid((grid) => {
			return produce(grid, gridCopy => {
				for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
					for (let colIdx = 0; colIdx < numCols; colIdx++) {
						let neighbors = 0;
						operations.forEach(([x,y]) => {
							const xIdx = rowIdx + x;
							const yIdx = colIdx + y;
							if (xIdx >= 0 && xIdx < numRows && yIdx >= 0 && yIdx < numCols) {
								neighbors += grid[xIdx][yIdx];
							}
						});

						if (neighbors < 2 || neighbors > 3) {
							gridCopy[rowIdx][colIdx] = 0;
						} else if (neighbors === 3 && grid[rowIdx][colIdx] === 0) {
							gridCopy[rowIdx][colIdx] = 1;
						}
					}
				};
			});
		});
		setTimeout(runSimulation, 100);
	}, []);

  	return (
		<div className='App'>
			<button onClick={() => {
				setRunning(!running);
				runningRef.current = !running;
				runSimulation();
			}}>{running ? 'Stop' : 'Start'}</button>
			{/* <button onClick={}>Random Board</button> */}
			<button onClick={() => setGrid(newGrid())}>Reset Board</button>
			<div onContextMenu={(evt) => evt.preventDefault()} 
			style={{
				display: 'grid',
				gridTemplateColumns: `repeat(${numCols}, 20px)`
			}}>
				{
					grid.map((rows, rowIdx) => 
						rows.map((col, colIdx) => {
							return (
								<div key={`${rowIdx}-${colIdx}`}
									onMouseDown={() => switchCell(rowIdx, colIdx)}
									onMouseOver={(evt) => hoverCell(evt, rowIdx, colIdx)}
									className='cell' 
									style={{ width: 20,
										height: 20,
										border: 'solid 1px black',
										backgroundColor: grid[rowIdx][colIdx] ? '#454545' : 'white'
									}}
								/>
							)
						})
					)
				}
			</div>
		</div>
	);
}

export default App;

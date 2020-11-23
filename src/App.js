import { Avatar, Button, Col, Row } from 'antd';
import produce from 'immer';
import { useCallback, useRef, useState } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import logo from './logo.svg';

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
];

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

	const switchCell = (evt, rowIdx, colIdx, state = null) => {
		const newGrid = produce(grid, gridCopy => {
			if(state != null)
				gridCopy[rowIdx][colIdx] = state;
			else {
				if (evt.buttons === 1) {
					gridCopy[rowIdx][colIdx] = 1;
				} else if (evt.buttons === 2) {
					gridCopy[rowIdx][colIdx] = 0;
				} else {
					gridCopy[rowIdx][colIdx] = !grid[rowIdx][colIdx];
				}
			}
		})
		setGrid(newGrid);
	};
	
	const hoverCell = (evt, rowIdx, colIdx) => {
		if (evt.buttons === 1) {
			switchCell(evt, rowIdx, colIdx, 1);
		} else if (evt.buttons === 2) {
			switchCell(evt, rowIdx, colIdx, 0);
		}
	}

	const randomGrid = () => {
		const rows = [];
		for (let i = 0; i < numRows; i++) {
			rows.push(Array.from(Array(numCols), () => {
				const val = Math.random();
				if (val > 0.75)
					return 1;
				else
					return 0;
			}));
		}
		return rows;
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
			<Avatar src={logo} alt='logo' size={100} />
			<h1>Conway's Game of Life</h1>
			<Row justify='center' gutter={[16,16]} align='middle'>
				<Col><Button type='primary' shape='round' danger={running} onClick={() => {
						setRunning(!running);
						runningRef.current = !running;
						runSimulation();
					}}>{running ? 'Stop' : 'Start'}</Button></Col>
				<Col><Button type='primary' shape='round' onClick={() => setGrid(randomGrid())}>Random Board</Button></Col>
				<Col><Button type='primary' shape='round' onClick={() => {
					setGrid(newGrid());
					setRunning(false);
					runningRef.current = false;
				}}>Reset Board</Button></Col>
				<Col>Left Click to Draw</Col>
				<Col>Right Click to Erase</Col>
			</Row>
			<div onContextMenu={(evt) => evt.preventDefault()} className='grid'>
				{
					grid.map((rows, rowIdx) => 
						rows.map((col, colIdx) => {
							return (
								<div key={`${rowIdx}-${colIdx}`}
									onMouseDown={(evt) => switchCell(evt, rowIdx, colIdx)}
									onMouseOver={(evt) => hoverCell(evt, rowIdx, colIdx)}
									className='cell' 
									style={{
										backgroundColor: grid[rowIdx][colIdx] ? '#454545' : 'white'
									}}
								/>
							)
						})
					)
				}
			</div>
			<Row><a href='https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life' target='_blank' rel='noreferrer noopener'>Learn more about Conway's Game of Life</a></Row>
		</div>
	);
}

export default App;

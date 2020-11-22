import { useState } from 'react';
import produce from 'immer';
import './App.css';

const numRows = 50;
const numCols = 50;

const App = () => {
	const [grid, setGrid] = useState(() => {
		const rows = [];
		for (let i = 0; i < numRows; i++) {
			rows.push(Array.from(Array(numCols), () => false));
		}
		return rows;
	});

  	return (
		<div className='App'>
			<div style={{
				display: 'grid',
				gridTemplateColumns: `repeat(${numCols}, 20px)`
			}}>
				{
					grid.map((rows, rowIdx) => 
						rows.map((col, colIdx) => {
							return (
								<div key={`${rowIdx}-${colIdx}`}
									onClick={() => {
										console.log('clicked - ' + rowIdx + '-' + colIdx);
										const newGrid = produce(grid, gridCopy => {
											gridCopy[rowIdx][colIdx] = !gridCopy[rowIdx][colIdx];
										})
										// grid[rowIdx][colIdx] = true;
										setGrid(newGrid);
									}}
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

import Board, { canvas } from "../Board/Board";
import Control from "../Control/Control";
import "./app.css";

const App = () => {
	return (
		<div className="pixel-container">
			<Control />
			<Board />
		</div>
	);
};

export default App;

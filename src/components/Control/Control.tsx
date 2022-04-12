import "./control.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useRef, useState } from "react";
import {
	canvas,
	clearDrawnArray,
	context,
	createCanvas,
	drawnArray,
	restoreCanvas,
	setDrawnArray,
} from "../Board/Board";

export let color = "#000000";
export let width = 10;
export let isEraser = false;
export let isEraserWidth = 50;

const Control = () => {
	let currentColor = useRef(color);

	const [bucketColor, setBucketColor] = useState("#ffffff");
	const [brushColor, setBrushColor] = useState(color);
	const [currentSize, setCurrentSize] = useState(width);
	const [currentTool, setCurrentTool] = useState("Brush");

	const cleanCanvas = () => {
		if (context) {
			context.fillStyle = bucketColor;
			context.fillRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);
		}
	};

	return (
		<div className="control">
			<div className="panel">
				<div className="tool info">
					<i className={currentTool === "Eraser" ? "fas fa-eraser" : "fas fa-brush"} id="brush" title="Brush">
						{" " + currentTool}
					</i>
				</div>
			</div>
			<div className="divider" />
			<div className="panel">
				<i
					className="fas fa-brush tool"
					id="brush"
					title="Brush"
					onClick={(e) => {
						isEraser = false;
						setCurrentTool("Brush");
						color = brushColor;
						width = currentSize;
					}}
				/>
				<input
					type="color"
					className="tool"
					value={brushColor}
					onChange={(e) => {
						isEraser = false;
						setBrushColor(e.currentTarget.value);
						currentColor.current = e.currentTarget.value;
						color = currentColor.current;
						width = currentSize;
					}}
				/>
				<div className="size" id="brush-size" title="Brush Size">
					{currentSize < 10 ? `0${currentSize}` : currentSize}
				</div>
				<input
					type="range"
					min="1"
					max="50"
					defaultValue={currentSize}
					className="slider"
					id="brush-slider"
					onChange={(e) => {
						setCurrentSize(e.currentTarget.valueAsNumber);
						width = currentSize;
					}}
				/>
			</div>
			<div className="panel">
				<i className="fas fa-fill-drip tool" title="Background Color"></i>
				<input
					type="color"
					className="tool"
					id="bucket-color"
					value={bucketColor}
					onChange={(e) => {
						setBucketColor(e.currentTarget.value);
						cleanCanvas();
						restoreCanvas();
					}}
				/>
			</div>
			<div className="panel">
				<div
					className="tool"
					onClick={(e) => {
						isEraser = true;
						setCurrentTool("Eraser");
						currentColor.current = bucketColor;
						color = currentColor.current;
						width = isEraserWidth;
					}}
				>
					<i className="fas fa-eraser" id="eraser" title="Eraser"></i>
				</div>
			</div>
			<div className="panel">
				<div
					className="tool"
					onClick={(e) => {
						if (canvas && context) {
							cleanCanvas();
							clearDrawnArray();
							setCurrentTool("Canvas Cleared");
							setTimeout(() => {
								setCurrentTool("Brush");
							}, 1500);
						}
					}}
				>
					<i className="fas fa-undo-alt" id="clear-canvas" title="Clear"></i>
				</div>
				<div
					className="tool"
					onClick={() => {
						localStorage.setItem("savedCanvas", JSON.stringify(drawnArray));
						setCurrentTool("Canvas Saved");
						setTimeout(() => setCurrentTool("Brush"), 1500);
					}}
				>
					<i className="fas fa-download" id="save-storage" title="Save Local Storage"></i>
				</div>
				<div
					className="tool"
					onClick={() => {
						if (localStorage.getItem("savedCanvas")) {
							setDrawnArray(JSON.parse(localStorage.savedCanvas));
							cleanCanvas();
							restoreCanvas();
							setCurrentTool("Canvas Loaded");
							setTimeout(() => setCurrentTool("Brush"), 1500);
						} else {
							setCurrentTool("No Canvas Found");
							setTimeout(() => setCurrentTool("Brush"), 1500);
						}
					}}
				>
					<i className="fas fa-upload" id="load-storage" title="Load Local Storage"></i>
				</div>
				<div
					className="tool"
					onClick={() => {
						localStorage.removeItem("savedCanvas");
						setCurrentTool("Storage Cleared");
						setTimeout(() => setCurrentTool("Brush"), 1500);
					}}
				>
					<i className="fas fa-trash-alt" id="clear-storage" title="Clear Local Storage"></i>
				</div>
				<div className="tool">
					<a
						id="download"
						onClick={(e) => {
							if (!canvas) return;
							e.currentTarget.href = canvas.toDataURL("image/jpeg", 1.0);
							e.currentTarget.download = "image.jpeg";
							setCurrentTool("Image Saved");
							setTimeout(() => setCurrentTool("Brush"), 1500);
						}}
					>
						<i className="far fa-save" title="Save Image File"></i>
					</a>
				</div>
			</div>
			<div className="divider" />
		</div>
	);
};
export default Control;

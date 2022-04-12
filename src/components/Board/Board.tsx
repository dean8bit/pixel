import React, { useRef } from "react";
import { useEffect } from "react";
import { color, isEraser, width } from "../Control/Control";
import "./board.css";

export let canvas: HTMLCanvasElement | undefined = undefined;
export let context: CanvasRenderingContext2D | null | undefined = undefined;

const getMousePosition = (event: any) => {
	const bounds = canvas?.getBoundingClientRect();
	return { x: event.clientX - (bounds?.left ?? 0), y: event.clientY - (bounds?.top ?? 0) };
};

const storeDrawn = (x: number, y: number, size: number, color: string, eraser: boolean) => {
	const line = {
		x,
		y,
		size,
		color,
		eraser,
	};
	console.log(line);
	drawnArray.push(line);
};

export const clearDrawnArray = () => {
	drawnArray = [];
};

export const setDrawnArray = (array: []) => {
	drawnArray = array;
};

export let drawnArray: { x: number; y: number; size: number; color: string; eraser: boolean }[] = [];

export const restoreCanvas = () => {
	if (!context) return;
	for (let i = 1; i < drawnArray.length; i++) {
		context.beginPath();
		context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
		context.lineWidth = drawnArray[i].size;
		context.lineCap = "round";
		if (drawnArray[i].eraser) {
			context.strokeStyle = color;
		} else {
			context.strokeStyle = drawnArray[i].color;
		}
		context.lineTo(drawnArray[i].x, drawnArray[i].y);
		context.stroke();
	}
};

export const createCanvas = (
	canvas: HTMLCanvasElement,
	context: CanvasRenderingContext2D,
	color: string = "#ffffff"
) => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 50;
	context.fillStyle = color;
	context.fillRect(0, 0, canvas.width, canvas.height);
};

const Board = () => {
	let isMouseDown = useRef(false);
	let drawnArray = useRef([]);

	useEffect(() => {
		canvas = document.getElementById("canvas") as HTMLCanvasElement;
		context = canvas.getContext("2d");

		if (canvas && context) {
			createCanvas(canvas, context);

			canvas.addEventListener("mousedown", (e) => {
				if (!context) return;
				isMouseDown.current = true;
				const pos = getMousePosition(e);
				context.moveTo(pos.x, pos.y);
				context.beginPath();
				context.lineWidth = width;
				context.lineCap = "round";
				context.strokeStyle = color;
			});

			canvas.addEventListener("mousemove", (e) => {
				if (context && isMouseDown.current) {
					const pos = getMousePosition(e);
					context.lineTo(pos.x, pos.y);
					context.stroke();
					storeDrawn(pos.x, pos.y, width, color, isEraser);
				}
			});

			canvas.addEventListener("mouseup", (e) => {
				isMouseDown.current = false;
			});
		}
	}, []);

	return (
		<div className="board">
			<canvas id="canvas" />
		</div>
	);
};

export default Board;

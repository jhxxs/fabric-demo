import {
	Canvas,
	FabricObject,
	FabricText,
	InteractiveFabricObject,
	Rect,
	util
} from "fabric"
import { useEffect, useMemo, useRef, useState } from "react"
const multiply = util.multiplyTransformMatrices
const invert = util.invertTransform

const id = () => window.crypto.randomUUID()

InteractiveFabricObject.customProperties = ["id", "name"]
InteractiveFabricObject.ownDefaults = {
	...InteractiveFabricObject.ownDefaults,
	noScaleCache: false,
	cornerStyle: "circle",
	transparentCorners: false,
	lockScalingFlip: true,
	lockSkewingX: true,
	lockSkewingY: true,
	centeredRotation: true,
	hasBorders: true,
	cornerSize: 10,
	centeredScaling: true,
	_controlsVisibility: {
		ml: false,
		mt: false,
		mr: false,
		mb: false
	}
}

export default function () {
	const canvasElRef = useRef<HTMLCanvasElement>(null)
	const canvasRef = useRef<Canvas>(null)

	const [shapes, setShapes] = useState<FabricObject[]>([])
	const [ids, setIds] = useState<string[]>([])

	const selectedShapes = useMemo(
		() => shapes.filter((v) => ids.includes(v.id!)),
		[shapes, ids]
	)

	useEffect(() => {
		if (!canvasRef.current && canvasElRef.current) {
			canvasRef.current = new Canvas(canvasElRef.current, {
				backgroundColor: "transparent",
				width: 600,
				height: 600
			})
			setTimeout(init, 0)
		}
	}, [])

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		canvas.on("object:added", (opt) =>
			setShapes((state) => [...state, opt.target])
		)
		canvas.on("object:scaling", (opt) => {
			const id = opt.target.id
			if (id) {
				setShapes((state) => state.map((v) => (v.id === id ? opt.target : v)))
			} else {
				// !TODO how to update shapes
				console.log("opt", opt.target)
			}
		})

		canvas.on("selection:created", (opt) =>
			setIds(() => opt.selected.map((v) => v.id!))
		)
		canvas.on("selection:updated", (opt) =>
			setIds(() => opt.selected.map((v) => v.id!))
		)
		canvas.on("selection:cleared", () => setIds([]))

		return () => {
			canvas.off("object:added")
			canvas.off("object:scaling")
			canvas.off("selection:created")
			canvas.off("selection:updated")
			canvas.off("selection:cleared")
		}
	})

	function init() {
		const canvas = canvasRef.current
		if (!canvas) return
		const text = new FabricText("Hello, Fabric", {
			id: id(),
			fontSize: 32,
			fontWeight: "bold"
		})
		text.left = (canvas.width - text.width) / 2
		text.top = (canvas.height - text.height) / 2

		const rect = new Rect({
			id: id(),
			height: 60,
			width: 60,
			left: (canvas.width - 60) / 2,
			top: (canvas.height - 60) / 2 + text.height * 2,
			fill: "rgba(248, 180, 26, .6)"
		})
		canvas.add(text, rect)
		canvas.renderAll()
	}

	return (
		<div className="flex">
			<div className="size-[600px] border border-gray-200 rounded-[4px]">
				<canvas ref={canvasElRef} />
			</div>
			<div className="pl-[24px]">
				<div>
					<h2 className="text-xl">Current shapes:</h2>
					<ul>
						{shapes.map((v, index) => (
							<li key={v.id}>
								<div>
									{index + 1}.{v.type}
								</div>
								<p>width: {v.getScaledWidth()}</p>
								<p>height: {v.getScaledHeight()}</p>
							</li>
						))}
					</ul>
				</div>
				<hr className="my-[12px]" />
				<div>
					<h2 className="text-xl">Selected shapes:</h2>
					<ul>
						{selectedShapes.map((v, index) => (
							<li key={v.id}>
								<div>
									{index + 1}.{v.type}
								</div>
								<p>width: {v.getScaledWidth()}</p>
								<p>height: {v.getScaledHeight()}</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}

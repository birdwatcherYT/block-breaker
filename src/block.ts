import Ball from "./ball";

class Block {
	x: number;
	y: number;
	width: number;
	height: number;
	isBroken: boolean;
	constructor(x: number, y: number, width: number, height: number, isBloken: boolean = false) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.isBroken = isBloken;
	}
	copy(): Block {
		return new Block(this.x, this.y, this.width, this.height, this.isBroken);
	}

	inside(x: number, y: number): boolean {
		return (this.x <= x && x <= this.x + this.width && this.y <= y && y <= this.y + this.height);
	}
	horizontalTouch(x: number, y: number, dx: number): boolean {
		if (!this.inside(x, y))
			return false;
		return ((this.x <= x && x <= this.x + dx) || (this.x + this.width - dx <= x && x <= this.x + this.width));
	}
	verticalTouch(x: number, y: number, dy: number): boolean {
		if (!this.inside(x, y))
			return false;
		return ((this.y <= y && y <= this.y + dy) || (this.y + this.height - dy <= y && y <= this.y + this.height));
	}

	// 初期ブロック生成
	static initialBlocks(canvasWidth: number, canvasHeight: number, width: number, height: number,
		borderMargin: number, blockMargin: number) {
		const blocks: Block[] = [];

		const colNums = Math.floor((canvasWidth - 2 * borderMargin + blockMargin) / (width + blockMargin));
		const rowNums = Math.floor((0.4 * canvasHeight - borderMargin) / height);

		const totalWidth = width * colNums + blockMargin * (colNums - 1);
		const borderWidthMargin = Math.floor((canvasWidth - totalWidth) / 2);
		for (let i = 0; i < rowNums; ++i)
			for (let j = 0; j < colNums; ++j)
				blocks.push(new Block(borderWidthMargin + (width + blockMargin) * j, borderMargin + (height + blockMargin) * i, width, height));
		return blocks;
	}

	static copyAll(blocks: Block[]): Block[] {
		return blocks.map(b => b.copy());
	}

	static updateAll(blocks: Block[], ball: Ball) {
		blocks.forEach(
			b => {
				if (b.inside(ball.x, ball.y))
					b.isBroken = true;
			}
		);
	}

	static isBrokenAll(blocks: Block[]) {
		for (let b of blocks)
			if (!b.isBroken)
				return false;
		return true;
	}
};


export default Block;

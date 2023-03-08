class Bar {
	x: number;
	y: number;
	width: number;
	height: number;
	// 速度
	vx: number;
	constructor(x: number, y: number, width: number, height: number, vx = 0) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.vx = vx;
	}
	copy(): Bar {
		return new Bar(this.x, this.y, this.width, this.height, this.vx);
	}
	inside(x: number, y: number): boolean {
		return (this.x <= x && x <= this.x + this.width && this.y <= y && y <= this.y + this.height);
	}
	update(canvasWidth: number) {
		this.x += this.vx;
		if (this.vx > 0)
			this.vx--;
		else if (this.vx < 0)
			this.vx++;
		if (this.x < 0)
			this.x = 0;
		if (this.x + this.width > canvasWidth)
			this.x = canvasWidth - this.width;
	}
}
export default Bar;

import Block from './block';
import Bar from './bar';

class Ball {
	x: number;
	y: number;
	r: number;
	// 速度
	vx: number;
	vy: number;
	constructor(x: number, y: number, r: number, vx = 0, vy = 0) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.vx = vx;
		this.vy = vy;
	}
	copy(): Ball {
		return new Ball(this.x, this.y, this.r, this.vx, this.vy);
	}
	setVelocity(vx: number, vy: number) {
		this.vx = vx;
		this.vy = vy;
	}
	updatePosition(canvasWidth: number, canvasHeight: number, bar: Bar, blocks: Block[]) {
		// 位置を更新
		this.x += this.vx;
		this.y += this.vy;
		// 画面枠の反発
		if (this.x < 0)
			this.vx = Math.abs(this.vx);
		if (this.x > canvasWidth)
			this.vx = -Math.abs(this.vx);
		if (this.y < 0)
			this.vy = Math.abs(this.vy);
		// バーの反発
		if (bar.inside(this.x, this.y)) {
			this.vy = -Math.abs(this.vy);
			// バーの速度によるボール速度の変化
			if (bar.vx > 0)
				this.vx++;
			else if (bar.vx < 0)
				this.vx--;
		}
		// ブロックの判定
		blocks.forEach(block => {
			if (!block.isBroken && block.inside(this.x, this.y)) {
				const horizontal = block.horizontalTouch(this.x, this.y, Math.abs(this.vx) + 1);
				const vertical = block.verticalTouch(this.x, this.y, Math.abs(this.vy) + 1);
				if (horizontal && vertical) {
					this.vx *= -1;
					this.vy *= -1;
				} else if (horizontal) {
					this.vx *= -1;
				} else if (vertical) {
					this.vy *= -1;
				}
			}
		});
	}

}
export default Ball;

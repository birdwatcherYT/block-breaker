import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Block from './block';
import Ball from './ball';
import Bar from './bar';

const canvasWidth = 500;
const canvasHeight = 500;
const width = 45;
const height = 30;
const borderMargin = 30;
const blockMargin = 8;
const ballRadius = 9;
const barWidth = Math.floor(canvasWidth / 5);
const barHeight = ballRadius;
const statusX = Math.floor(canvasWidth / 2);
const statusY = Math.floor(canvasHeight * 2 / 3);

const barSpeed = 12;
const ballSpeed = 3;

enum Status {
  Pause,
  Playing,
  Clear,
  GameOver,
};

function App() {
  const initBall = () => {
    return new Ball(Math.floor(canvasWidth / 2), canvasHeight - borderMargin, ballRadius, -ballSpeed, -ballSpeed);
  };
  const initBar = () => {
    return new Bar(Math.floor((canvasWidth - barWidth) / 2), canvasHeight - borderMargin, barWidth, barHeight)
  };
  const initBlocks = () => {
    return Block.initialBlocks(canvasWidth, canvasHeight, width, height, borderMargin, blockMargin);
  };
  const [status, setStatus] = useState<Status>(Status.Pause);
  const [blocks, setBlocks] = useState<Block[]>(initBlocks());
  const [ball, setBall] = useState<Ball>(initBall());
  const [bar, setBar] = useState<Bar>(initBar());

  const moveBar = useCallback((sign: 1 | -1) => {
    if (status === Status.Playing) {
      const nextBar = bar.copy();
      nextBar.vx = sign * barSpeed;
      setBar(nextBar);
    }
  }, [status, bar]);

  const reset = useCallback(() => {
    if (status !== Status.Playing) {
      setStatus(Status.Playing);
      setBall(initBall());
      setBar(initBar());
      setBlocks(initBlocks());
    }
  }, [status]);

  const keyDown = useCallback((event: KeyboardEvent) => {
    // console.log(event);
    // console.log(status);
    switch (event.key) {
      case "Enter":
        reset();
        break;
      case "ArrowLeft":
        moveBar(-1);
        break;
      case "ArrowRight":
        moveBar(+1);
        break;
    }
  }, [moveBar, reset]);
  const update = useCallback(() => {
    if (status !== Status.Playing)
      return;
    // ボール更新
    const nextBall = ball.copy();
    nextBall.updatePosition(canvasWidth, canvasHeight, bar, blocks);
    setBall(nextBall);
    // バー更新
    const nextBar = bar.copy();
    nextBar.update(canvasWidth);
    setBar(nextBar);
    // ブロック更新
    const nextBlocks = Block.copyAll(blocks);
    Block.updateAll(nextBlocks, ball);
    setBlocks(nextBlocks);
    // ステータス更新
    if (Block.isBrokenAll(blocks)) {
      setStatus(Status.Clear);
    } else if (ball.y > canvasHeight) {
      setStatus(Status.GameOver);
    }
  }, [status, bar, ball, blocks]);
  useEffect(() => {
    const timeId = setInterval(update, 10);
    return () => clearInterval(timeId);
  }, [status, bar, ball, blocks, update]);
  useEffect(() => {
    document.addEventListener("keydown", keyDown);
    // ライフサイクル終了時に削除されるように
    return () => document.removeEventListener("keydown", keyDown);
  }, [status, bar, ball, blocks, keyDown]);

  const statusToMessages = () => {
    switch (status) {
      case Status.Pause:
        return ["Press Enter or Touch to Start"];
      case Status.Playing:
        return [];
      case Status.Clear:
        return ["Clear", "Press Enter or Touch to Restart"];
      case Status.GameOver:
        return ["Game Over", "Press Enter or Touch to Restart"];
    }
    return [];
  }

  return (
    <div className="App">
      <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}>
        <rect x={0} y={Math.floor(canvasHeight / 2)} width={Math.floor(canvasWidth / 2)} height={Math.floor(canvasHeight / 2)} onClick={() => { reset(); moveBar(-1); }} />
        <rect x={Math.floor(canvasWidth / 2)} y={Math.floor(canvasHeight / 2)} width={Math.floor(canvasWidth / 2)} height={Math.floor(canvasHeight / 2)} onClick={() => { reset(); moveBar(+1) }} />
        {blocks.map(
          (b: Block, i: number) =>
            <rect key={"block" + i} x={b.x} y={b.y} width={b.width} height={b.height} fill="cyan" visibility={b.isBroken ? "hidden" : "visible"} />
        )}
        <rect x={bar.x} y={bar.y} width={bar.width} height={bar.height} fill="yellow" />
        <circle cx={ball.x} cy={ball.y} r={ball.r} fill="magenta" />
        {
          statusToMessages().map((msg, i) =>
            <text key={"text" + i} x={statusX} y={statusY + i * 40} fill="white" textAnchor="middle">{msg}</text>
          )
        }
      </svg>
    </div>
  );
}


export default App;

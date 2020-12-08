import {
  AfterContentInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  //canvas details
  canvas: any;
  ctx: any;
  canvasHeight = 600;
  canvasWidth = 800;

  //Mouse

  MouseX: number = 0;
  MouseY: number = 0;

  //Bricks

  BricksRowSize: number;
  BricksColSize: number;
  BricksRow = 5;
  BricksCols = 5;
  BrickWIdth: number;
  Brickthickness: number;
  BricksGap: number = 10;

  Bricks:Array<Array<boolean>>


  //paddle details
  paddleX: number;
  paddleY: number;
  paddleWidth: number;
  PaddleThickness: number;

  //ball details
  BallX;
  BallY;
  BallSpeedX;
  BallSpeedY;
  BallRadius;

  //bricks


  constructor() {
    this.paddleX = 550;
    this.paddleY = 550;
    this.paddleWidth = 100;
    this.PaddleThickness = 10;

    this.BricksColSize = this.canvasHeight * 0.4;
    this.BricksRowSize = this.canvasWidth;

    this.BrickWIdth = this.BricksRowSize / this.BricksCols;
    this.Brickthickness = this.BricksColSize / this.BricksRow;

    this.Bricks=new Array(this.BricksRow)
    for(let row=0;row<this.Bricks.length;row++){
      this.Bricks[row]=new Array(this.BricksCols)
    }
    for(let row=0;row<this.Bricks.length;row++){
    for(let col=0;col<this.Bricks[row].length;col++){

      this.Bricks[row][col]=true
    }
    }




    this.BallX = this.canvasWidth / 2;
    this.BallY = this.canvasHeight / 2;
    this.BallSpeedX = 5;
    this.BallSpeedY = 5;
    this.BallRadius = 10;

      this.Bricks[3][2]=false
  }

  ngOnInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.canvas.height = 600;
    this.ctx.canvas.width = 800;
    this.ctx.canvas.style.imageRendering = 'auto';
    this.ctx.translate(0.5, 0.5);
    this.ctx.imageSmoothingEnabled = false;

    // this.ctx.fillStyle = 'red';
    // this.ctx.fillRect(10, 10, 10, 10);

    // this.ctx.fill();

    setInterval(() => {
      this.DrawAll();
    }, 1000 / 30);
  }
  DrawAll(): void {
    this.DrawRect(0, 0, this.canvas.width, this.canvas.height, 'black');
    this.DrawRect(
      this.paddleX,
      this.paddleY,
      this.paddleWidth,
      this.PaddleThickness,
      'red'
    );
    this.DrawCircle(
      this.BallX,
      this.BallY,
      this.BallRadius,
      0,
      Math.PI * 2,
      'Green'
    );
    this.DrawBricks();
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(
      Math.floor(this.MouseY / this.Brickthickness) +
        ' ' +
        Math.floor(this.MouseX / this.BrickWIdth),
      this.MouseX + 10,
      this.MouseY + 10
    );
    fromEvent<MouseEvent>(this.canvas, 'mousemove').subscribe((eve) => {
      this.paddle(eve);
      this.MouseX = eve.clientX;
      this.MouseY = eve.clientY;

    });
  }

  paddle(eve: any): void {
    const rect = this.canvas.getBoundingClientRect();
    const root = document.documentElement;
    this.paddleX =
      eve.clientX - rect.left - root.scrollLeft - this.paddleWidth / 2;
  }

  DrawCircle(
    PositionX: number,
    PositionY: number,
    radius: number,
    StartingPoint: number,
    Ending: number,
    Color: string
  ): void {
    this.BallX += this.BallSpeedX;
    this.BallY += this.BallSpeedY;

    if (this.BallX >= this.canvas.width) {
      this.BallSpeedX *= -1;
    }
    if (this.BallX < 0) {
      this.BallSpeedX *= -1;
    }
    if (this.BallY >= this.canvas.height) {
      this.BallSpeedY *= -1;
    }
    if (this.BallY < 0) {
      this.BallSpeedY *= -1;
    }

    let BallXpos=Math.floor(this.BallY / this.Brickthickness)
    let BallYpos=Math.floor(this.BallX / this.BrickWIdth)
    if (
      BallXpos >= 0 &&
      BallXpos <= this.BricksRow - 1 &&
      BallYpos >= 0 &&
      BallYpos <= this.BricksCols - 1
    ) {

      if (
      this.Bricks[BallXpos][
        BallYpos
      ]
      ){
        this.Bricks[BallXpos][BallYpos]=false
        this.BallSpeedY *= -1;

      }
    }

    const paddleTopLeft = this.paddleX;
    const paddleBottomLeft = this.paddleX;
    const paddleTopRight = this.paddleX + this.paddleWidth;
    const paddleBottomRight = this.paddleX + this.paddleWidth;

    if (
      paddleTopLeft < this.BallX &&
      paddleBottomLeft < this.BallX &&
      paddleTopRight > this.BallX &&
      paddleBottomRight > this.BallX &&
      this.BallY > this.paddleY
    ) {
      this.BallSpeedY *= -1;
      const center = this.paddleX + this.paddleWidth / 2;
      this.BallSpeedX = (this.BallX - center) * 0.35;
      if (this.BallSpeedX < 5) {
        this.BallSpeedX=5
      }
    }
    this.ctx.fillStyle = Color;
    this.ctx.beginPath();
    this.ctx.arc(PositionX, PositionY, radius, StartingPoint, Ending, true);
    this.ctx.fill();
  }

  DrawBricks() {
    for (var i = 0; i < this.Bricks.length; i++) {
      for (var j = 0; j < this.Bricks[i].length; j++) {
        // this.DrawRect((this.Brickthickness* j)+20, (10 * i)+20, this.BrickWIdth, this.Brickthickness ,'red');
        if(this.Bricks[i][j]){
        this.DrawRect(
          this.BrickWIdth * j,
          this.Brickthickness * i,
          this.BrickWIdth - this.BricksGap,
          this.Brickthickness - this.BricksGap,
          'red'
        );
        }
        // console.log(this.BrickWIdth, this.Brickthickness);
      }
    }
  }
  DrawRect(
    PositionX: number,
    PositionY: number,
    DimensionX: number,
    DimensionY: number,
    Color: string
  ): void {
    this.ctx.fillStyle = Color;
    this.ctx.fillRect(PositionX, PositionY, DimensionX, DimensionY);
  }
}

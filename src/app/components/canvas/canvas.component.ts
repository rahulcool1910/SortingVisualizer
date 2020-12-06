import {
  AfterContentInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  // startNodeColor;
  // endNodeColor;
  // shapedimension;
  // lineWidth;

  // shapes;

  canvas: any;

  ctx: any;
  constructor() {}

  ngOnInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.canvas.height = 520;
    this.ctx.canvas.width = 1235;
    this.ctx.canvas.style.imageRendering = 'auto';
    this.ctx.translate(0.5, 0.5);
    this.ctx.imageSmoothingEnabled = false;

    // this.ctx.fillStyle = 'red';
    // this.ctx.fillRect(10, 10, 10, 10);

    // this.ctx.arc(100, 100, 20, 0, Math.PI * 2, true);
    // this.ctx.fill();

    setInterval(() => {
      this.resetall();
    }, 500);
  }

  resetall() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    fromEvent(this.canvas, 'mousemove').subscribe((x) => {
      this.paddle(x);
    });
  }

  paddle(eve: any) {
    let rect = this.canvas.getBoundingClientRect();
    let root = document.documentElement;
    this.ctx.fillStyle = 'red';

    this.ctx.fillRect(eve.clientX - rect.left - root.scrollLeft, 10, 100, 500);
  }
}

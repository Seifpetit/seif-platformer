export const Camera = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,

  init(viewW, viewH) {
    this.width = viewW;
    this.height = viewH;
  },

  move(dx, dy) {
    this.x += dx;
    this.y += dy; 
  }
  
};
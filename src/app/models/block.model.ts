export class Block {
  public blockId: string;
  public position: number;
  public line: number;
  public opacity: number;
  public type: string;
  public movable: boolean;
  public name: string;

  constructor(
    blockId: string,
    line: number,
    position: number,
    type: string,
    opacity: number
  ) {
    this.blockId = blockId;
    this.position = position;
    this.line = line;
    this.opacity = opacity;
    this.type = type;
    switch (type) {
      case 'a':
        this.movable = true;
        this.name = 'heart';
        break;
      case 'b':
        this.movable = true;
        this.name = 'umbrella';
        break;
      case 'c':
        this.movable = true;
        this.name = 'dice';
        break;
      case 'd':
        this.movable = true;
        this.name = 'diamond';
        break;
      case 'e':
        this.movable = true;
        this.name = 'leaf';
        break;
      case 'f':
        this.movable = true;
        this.name = 'nutrition';
        break;
      case 'g':
        this.movable = true;
        this.name = 'bowling-ball';
        break;
      case 'h':
        this.movable = true;
        this.name = 'balloon';
        break;
      case 'X':
        this.movable = false;
        this.name = '';
        break;
      case 'Y':
        this.movable = false;
        this.name = '';
        break;
    }
  }
}

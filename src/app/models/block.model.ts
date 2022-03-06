
export class Block {

  public blockId: string;
  public position: number;
  public line: number;
  public opacity: number;
  public type: string;

  constructor(blockId: string, line: number, position: number, type: string, opacity: number) {
    this.blockId = blockId;
    this.position = position;
    this.line = line;
    this.opacity = opacity;
    this.type= type;
  }

}

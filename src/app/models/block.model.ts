
export class Block {

  public blockId: string;
  public position: number;
  public line: number;
  public opacity: number;
  public type: string;

  constructor(blockId: string, line: number, position: number, type: string) {
    this.blockId = blockId;
    this.position = position;
    this.line = line;
    this.opacity = 1;
    this.type= type;
  }

}

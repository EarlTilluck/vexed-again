export class Level {

  public order: number;
  public name: string;
  public board: string;
  public par: number;

  constructor(order: number, name: string, board: string, par: number, ) {
    this.order = order;
    this.name = name;
    this.board = board;
    this.par = par;
  }

}

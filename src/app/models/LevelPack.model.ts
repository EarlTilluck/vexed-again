import { Level } from './level.model';


export class LevelPack {

  public name: string;
  public totalLevels: number;
  public by: string;
  public difficulty: string;
  public link: string;

  public levels: Level[];

  constructor(name: string, totalLevels: number,
    by: string, difficulty: string,
    link: string, levels: Level[]) {

    this.name = name;
    this.totalLevels = totalLevels;
    this.by = by;
    this.difficulty = difficulty;
    this.link = link;
    this.levels = levels;
  }

}

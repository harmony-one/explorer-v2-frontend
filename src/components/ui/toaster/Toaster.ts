export interface IToasterProps {}
export interface IToasterOption {
  message: string | (() => JSX.Element);
  /**
   * time life in ms.
   * if 0 - forever
   * @default 3000
   */
  time?: number;
}

export class Toaster {
  public currentSelected: IToasterOption[] = [];

  public updateComponent!: Function;

  show(options: IToasterOption) {
    const { time = 3000 } = options;
    this.currentSelected.push(options);
    this.updateComponent();

    if (time) {
      setTimeout(() => this.hide(options), time);
    }
  }

  hide(options: IToasterOption) {
    this.currentSelected.splice(this.currentSelected.indexOf(options), 1);
    this.updateComponent();
  }
}

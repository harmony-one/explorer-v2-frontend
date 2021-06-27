import { SettingsService } from "src/utils/settingsService/SettingsService";

export interface IClientCacheProps {
  timer?: number; // ms
  key?: string;
}

export class ClientCache {
  public readonly key;
  private lastCacheTime = new Date().getTime();

  private keysMap: { [key: string]: number } = {};

  private settigsService;

  constructor(props: IClientCacheProps) {
    this.key = props.key || "ClientCache";
    this.settigsService = new SettingsService(this.key);

    this.lastCacheTime = this.getTime();

    if (props.timer) {
      setInterval(() => {
        Object.keys(this.keysMap).forEach((key) => {
          const currentDate = new Date().getTime();
          if (
            currentDate - (props.timer as number) > this.lastCacheTime &&
            key !== `${this.key}_time_${this.key}`
          ) {
            this.remove(key);
            console.log("remove" + key);
          }
        });

        this.lastCacheTime = new Date().getTime();
        this.regTime();
      }, props.timer);
    }
  }

  private regTime() {
    this.settigsService.set(`time_${this.key}`, {
      lastCacheTime: this.lastCacheTime,
    });
  }

  private getTime() {
    return this.settigsService.get(`time_${this.key}`, {
      lastCacheTime: new Date().getTime(),
    });
  }

  get<T = any>(
    key: string,
    defaultValue?: any
  ): T | string | typeof defaultValue {
    const item = this.settigsService.get(`${key}`, defaultValue);
    return item;
  }

  set(key: string, value: string | object) {
    this.settigsService.set(key, value);
  }

  remove(key: string) {
    try {
      localStorage.removeItem(key);
      delete this.keysMap[key];
    } catch {
      return;
    }
  }
}

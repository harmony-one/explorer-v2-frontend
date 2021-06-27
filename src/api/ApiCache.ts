export class ApiCache {
  public key: string = "apiCache";

  constructor(props: { key: string }) {
    this.key = props.key;
    const objStr = localStorage.getItem(this.key);
    if (!objStr) {
      localStorage.setItem(this.key, "{}");
    }
  }

  get<T = any>(name: string) {
    const obj = JSON.parse(localStorage.getItem(this.key) as string);
    return obj[name] as T | undefined;
  }

  set(name: string, value: any) {
    const obj = JSON.parse(localStorage.getItem(this.key) as string);

    localStorage.setItem(this.key, JSON.stringify({ ...obj, [name]: value }));
  }
}

export class SettingsService {
  private postfix: string | undefined;
  private settingsField: string;

  constructor(postfix?: string, settingsField?: string) {
    this.postfix = postfix;
    this.settingsField =
      settingsField === void 0 ? "ONE_SETTINGS_" : settingsField;
  }
  // tslint:disable-next-line:no-any
  get<T = any>(
    key: string,
    initValue: {} = {},
    returnClearValue?: boolean
  ): T | undefined {
    const nameSettingsField = this.getCurrentSettingsName();
    const currentItem = localStorage.getItem(nameSettingsField)
      ? JSON.parse(localStorage.getItem(nameSettingsField) as string)
      : {};

    if (key in currentItem) {
      try {
        return currentItem[key];
      } catch {
        if (returnClearValue) {
          return undefined;
        } else {
          return initValue as T;
        }
      }
    }

    if (returnClearValue) {
      return undefined;
    } else {
      return initValue as T;
    }
  }

  set(key: string, value: any) {
    const nameSettingsField = this.getCurrentSettingsName();
    const currentItem = localStorage.getItem(nameSettingsField)
      ? JSON.parse(localStorage.getItem(nameSettingsField) as string)
      : {};

    const newValue = { [key]: value };

    localStorage.setItem(
      nameSettingsField,
      JSON.stringify({ ...currentItem, ...newValue })
    );
  }

  remove(name?: string) {
    const nameSettingsField = this.getCurrentSettingsName();

    if (name) {
      const currentItem = localStorage.getItem(nameSettingsField);
      const parsedItems = JSON.parse(currentItem as string);
      if (parsedItems && parsedItems[name]) {
        delete parsedItems[name];
        localStorage.setItem(
          nameSettingsField,
          JSON.stringify({ ...parsedItems })
        );
      }
    } else {
      localStorage.removeItem(nameSettingsField);
    }
  }

  public setPostFix(postFix: string) {
    this.postfix = postFix;
  }

  public getCurrentSettingsName() {
    return this.settingsField + this.postfix;
  }
}

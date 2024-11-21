const storage = {
  set(key: string, value: any) {
    if (value === undefined) {
      return;
    }
    if (typeof key !== "string") {
      value = JSON.stringify(key);
    }
    localStorage.setItem;
  },
  get(key: string) {
    const value = localStorage.getItem(key);
    try {
      if (value && value.indexOf("{") > -1) {
        return JSON.parse(value);
      }
    } catch {
      return value;
    }
  },
  remove(key: string) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
};

export default storage;

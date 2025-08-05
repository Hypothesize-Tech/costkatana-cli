declare module 'gradient-string' {
  const gradient: {
    pastel: {
      multiline: (lines: string[]) => string;
    };
  };
  export default gradient;
}

declare module 'conf' {
  interface Conf<T> {
    get(key: string): T[keyof T];
    set(key: string, value: any): void;
    has(key: string): boolean;
    delete(key: string): void;
    clear(): void;
    store: T;
    path: string;
  }

  interface ConfOptions<T> {
    projectName?: string;
    schema?: any;
  }

  class Conf<T> {
    constructor(options?: ConfOptions<T>);
    get(key: string): T[keyof T];
    set(key: string, value: any): void;
    has(key: string): boolean;
    delete(key: string): void;
    clear(): void;
    store: T;
    path: string;
  }

  export = Conf;
} 
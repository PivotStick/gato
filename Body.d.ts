export default class Body<T = {}> {
  $require<K extends keyof T>(key: K, defaultValue: T[K]): T[K]

  $parseDataURL<K extends keyof T>(key: K): { buffer: Buffer; mimetype: string }

  /**
   * @param keys The keys of the properties to get. Defaults to `"dataURL"`
   *
   * @returns The generated names of the uploaded files.
   */
  $dataURLsToFiles<K extends keyof T>(...keys: K[]): Promise<string[]>
}

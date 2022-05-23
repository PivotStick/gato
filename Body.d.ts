class Body<T = {}> {
  $require<K extends keyof T>(key: K, defaultValue: T[K]): T[K]

  /**
   * @param keys The keys of the properties to get. Defaults to `"dataURL"`
   *
   * @returns The generated names of the uploaded files.
   */
  $dataURLToFile<K extends keyof T>(...keys: K[]): Promise<string[]>
}

export default Body

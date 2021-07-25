import { Options } from "./Options"

export class App {
    constructor(architecture: any, options?: Options)

    listen(port?: number, callback?: () => void): Promise<void>
}

type Profile = (keyof typeof rights)[]
type Profiles = { [k: string]: Profile }

declare module globalThis {
    export const $$: import("./@types").ControllerFile
    export const profiles: Profiles
}

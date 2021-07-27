type Profile = (keyof typeof rights)[]
type Profiles = { [k: string]: Profile }

type $$ = import("./@types").ControllerFile

declare module globalThis {
    export const $$: $$
    export const profiles: Profiles
}

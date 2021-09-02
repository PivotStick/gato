type All = "*"

type Rights =
    | All
    | {
          "*"?: boolean
          [K: string]: boolean
      }

type Actions = {
    "*"?: Rights
    [K: string]: Rights
}

type Controllers = All | Actions
export type Roles = Record<string, Controllers>

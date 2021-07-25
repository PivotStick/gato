import { Method } from "./Method"
import { Methods } from "./Methods"

export type ControllerFile = {
    [Key in Methods]: Method
}

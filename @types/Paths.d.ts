import { FullPath } from "./FullPath"
import { DirName } from "./DirName"

export type Paths = {
    [K in `_${DirName}`]: FullPath
}
;``

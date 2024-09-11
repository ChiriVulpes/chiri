import path from "path"
import type { ChiriPosition } from "./chc/ChiriAST"

export const PACKAGE_ROOT = path.dirname(__dirname)
export const LIB_ROOT = path.join(PACKAGE_ROOT, "lib")
export const CHC_ROOT = path.join(__dirname, "chc")

export const INTERNAL_POSITION: ChiriPosition = { file: "internal", line: 0, column: 0 }
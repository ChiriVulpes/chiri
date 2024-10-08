import type { ChiriPosition, ChiriStatement } from "../../ChiriReader"
import consumeWhiteSpace from "../consumeWhiteSpace"
import consumeWordInterpolated from "../consumeWordInterpolated"
import type { ChiriWordInterpolated } from "../consumeWordInterpolatedOptional"
import MacroConstruct from "./MacroConstruct"

export interface ChiriAlias {
	type: "alias"
	property: ChiriWordInterpolated
	body: ChiriStatement[]
	position: ChiriPosition
}

export default MacroConstruct("alias")
	.consumeParameters(reader => consumeWhiteSpace(reader) && consumeWordInterpolated(reader))
	.body("property-name")
	.consume(({ reader, body, position, extra }): ChiriAlias => ({
		type: "alias",
		property: extra,
		body,
		position,
	}))

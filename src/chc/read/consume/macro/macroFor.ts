import type { ChiriPosition, ChiriStatement } from "../../ChiriReader"
import consumeBody from "../consumeBody"
import type { ChiriCompilerVariable } from "../consumeCompilerVariableOptional"
import consumeCompilerVariableOptional from "../consumeCompilerVariableOptional"
import type { ChiriExpressionOperand } from "../consumeExpression"
import consumeExpression from "../consumeExpression"
import consumeInlineMacroUseOptional from "../consumeInlineMacroUseOptional"
import consumeWhiteSpace from "../consumeWhiteSpace"
import consumeWhiteSpaceOptional from "../consumeWhiteSpaceOptional"
import MacroFunction from "./MacroFunction"

export interface ChiriFor {
	type: "for"
	variable: ChiriCompilerVariable
	condition: ChiriExpressionOperand
	update?: ChiriStatement
	content: ChiriStatement[]
	position: ChiriPosition
}

export default MacroFunction("for")
	.consumeParameters(reader => {
		consumeWhiteSpace(reader)

		const variable = consumeCompilerVariableOptional(reader, false)
		if (!variable)
			throw reader.error("Expected variable declaration")

		reader.consume(",")
		consumeWhiteSpaceOptional(reader)

		const [condition, update] = reader
			.with(variable)
			.do(() => {
				const condition = consumeExpression(reader)

				reader.consume(",")
				consumeWhiteSpaceOptional(reader)

				const update = consumeInlineMacroUseOptional(reader)
				return [condition, update]
			})

		return {
			variable,
			condition,
			update,
		}
	})
	.consume(async ({ reader, extra: { variable, condition, update }, position }): Promise<ChiriFor> => {
		reader.consume(":")
		const body = await consumeBody(reader, "inherit", sub => sub.addOuterStatement(variable))
		return {
			type: "for",
			variable,
			condition,
			update,
			...body,
			position,
		}
	})
import { LITERAL_FALSE, LITERAL_STRING_ROOT } from "../../../../constants"
import { ChiriType } from "../../ChiriType"
import isLiteral from "../../guard/isLiteral"
import MacroFunction from "./MacroFunction"

export default MacroFunction("export")
	.parameter("once", ChiriType.of("bool"), LITERAL_FALSE)
	.parameter("in", ChiriType.of("string"), LITERAL_STRING_ROOT)
	.consume(({ reader, assignments }) => {
		if (reader.hasStatements())
			throw reader.error("#export must be the first statement in a file")

		if (assignments.once) {
			if (!isLiteral(assignments.once))
				throw reader.error("\"once\" parameter of #export must be a literal boolean")

			reader.setOnce()
		}

		const contextAssignment = assignments.in
		if (contextAssignment && (!isLiteral(contextAssignment, "string") || contextAssignment.segments.length !== 1 || typeof contextAssignment.segments[0] !== "string"))
			throw reader.error("\"in\" parameter of #export must be a literal, raw string")

		const context = contextAssignment?.segments[0] as string ?? "root"

		if (reader.context !== context)
			throw reader.error(`${reader.basename} is exported for use in ${context} context, but was imported into a ${reader.context} context`)

		return true
	})

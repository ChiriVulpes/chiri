import { LITERAL_FALSE, LITERAL_STRING_ROOT } from "../../../../constants"
import { ChiriType } from "../../../type/ChiriType"
import isLiteral from "../../guard/isLiteral"
import MacroConstruct from "./MacroConstruct"

export default MacroConstruct("export")
	.parameter("reusable", ChiriType.of("bool"), LITERAL_FALSE)
	.parameter("in", ChiriType.of("string"), LITERAL_STRING_ROOT)
	.consume(({ reader, assignments }) => {
		if (reader.isSubReader || reader.getStatements(true).length)
			throw reader.error("#export must be the first statement in a file")

		if (assignments.reusable) {
			if (!isLiteral(assignments.reusable))
				throw reader.error("\"reusable\" parameter of #export must be a literal boolean")

			reader.setReusable()
		}

		const contextAssignment = assignments.in
		if (contextAssignment && (!isLiteral(contextAssignment, "string") || contextAssignment.segments.length !== 1 || typeof contextAssignment.segments[0] !== "string"))
			throw reader.error("\"in\" parameter of #export must be a literal, raw string")

		const context = contextAssignment?.segments[0] as string ?? "root"

		if (reader.context.type !== context)
			throw reader.error(`${reader.importName} is exported for use in ${context} context, but was imported into a ${reader.context.type} context`)

		return true
	})

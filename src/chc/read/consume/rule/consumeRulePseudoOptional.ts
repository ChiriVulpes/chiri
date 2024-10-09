import type ChiriReader from "../../ChiriReader"
import consumeBody from "../consumeBody"
import consumeWhiteSpaceOptional from "../consumeWhiteSpaceOptional"
import type { ChiriWord } from "../consumeWord"
import consumeWordOptional from "../consumeWordOptional"
import type { ChiriComponentPseudo, ChiriComponentViewTransition } from "./Rule"

export default async (reader: ChiriReader): Promise<ChiriComponentPseudo | ChiriComponentViewTransition | undefined> => {
	const position = reader.getPosition()
	const e = reader.i

	const result = undefined
		?? consumePseudoType(reader, "pseudo", "before", "after")
		?? consumePseudoType(reader, "view-transition", "view-transition!old", "view-transition!new")
	if (!result)
		return undefined

	const duplicates = new Set(result.pseudos.map(e => e.value))
	if (result.pseudos.length > 2 || duplicates.size !== result.pseudos.length)
		throw reader.error(e, "Duplicate pseudoelement selector")

	reader.consume(":")

	return {
		type: "component",
		subType: result.type,
		pseudos: result.pseudos as ChiriWord<any>[],
		...await consumeBody(reader, "pseudo"),
		position,
	}
}

function consumePseudoType<TYPE extends string, PSEUDOS extends string[]> (reader: ChiriReader, type: TYPE, ...pseudos: PSEUDOS): { type: TYPE, pseudos: ChiriWord<PSEUDOS[number]>[] } | undefined {
	const restore = reader.savePosition()

	const results: ChiriWord<PSEUDOS[number]>[] = []
	do {
		const prefix = reader.consumeOptional("@")
		if (!prefix)
			break

		const word = consumeWordOptional(reader, ...pseudos)
		if (!word) {
			reader.restorePosition(restore)
			return undefined
		}

		results.push(word)
	} while (reader.consumeOptional(",") && (consumeWhiteSpaceOptional(reader) || true))

	if (!results.length) {
		reader.restorePosition(restore)
		return undefined
	}

	return {
		type,
		pseudos: results,
	}
}

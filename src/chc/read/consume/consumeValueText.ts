import { ChiriType } from "../../type/ChiriType"
import type ChiriReader from "../ChiriReader"
import type { ChiriPosition } from "../ChiriReader"
import type { ChiriInterpolationProperty, ChiriInterpolationPropertyName } from "./consumeCustomPropertyInterpolation"
import consumeCustomPropertyInterpolation from "./consumeCustomPropertyInterpolation"
import consumeNewBlockLineOptional from "./consumeNewBlockLineOptional"
import type { ChiriWord } from "./consumeWord"
import consumeExpression, { type ChiriExpressionOperand } from "./expression/consumeExpression"

export interface ChiriInterpolationVariable {
	type: "interpolation-variable"
	name: ChiriWord
	position: ChiriPosition
}

export interface ChiriTextRaw {
	type: "text-raw"
	text: string
	position: ChiriPosition
}

export interface ChiriValueText {
	type: "text"
	valueType: ChiriType
	content: (ChiriTextRaw | ChiriInterpolationVariable | ChiriInterpolationProperty | ChiriInterpolationPropertyName | ChiriExpressionOperand | string)[]
	position: ChiriPosition
}

export default function consumeValueText (reader: ChiriReader, multiline: boolean, until?: () => boolean): ChiriValueText {
	const start = reader.getPosition()

	const content: ChiriValueText["content"] = []

	let stringChar: string | undefined
	let paren = 0

	let textStart = start
	let text = ""
	for (; reader.i < reader.input.length;) {
		if (reader.peek("\r\n", "\n")) {
			if (!multiline || !consumeNewBlockLineOptional(reader))
				break

			text += " "
			continue
		}

		const varType = reader.consumeOptional("#{", "$$", "$")
		if (!varType) {
			const char = reader.input[reader.i]
			if (char === stringChar) {
				stringChar = undefined
			} else if (!stringChar && (char === "\"" || char === "'")) {
				stringChar = char
			} else if (!stringChar && char === "(") {
				paren++
			} else if (!stringChar && paren && char === ")") {
				paren--
			}

			if (!stringChar && !paren && until?.())
				break

			text += char
			reader.i++
			continue
		}

		if (text) {
			content.push({
				type: "text-raw",
				position: textStart,
				text,
			})
		}

		if (varType === "$" || varType === "$$") {
			content.push(consumeCustomPropertyInterpolation(reader, varType))

		} else {
			content.push(consumeExpression.inline(reader))
			reader.consume("}")
		}

		text = ""
		textStart = reader.getPosition()
	}

	if (text)
		content.push({
			type: "text-raw",
			position: textStart,
			text,
		})

	return {
		type: "text",
		valueType: ChiriType.of("string"),
		content,
		position: start,
	}
}

consumeCustomPropertyInterpolation.consumeValueText = consumeValueText

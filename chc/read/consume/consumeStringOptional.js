const assertNotWhiteSpaceAndNewLine = require("../assert/assertNotWhiteSpaceAndNewLine");
const consumeBlockEnd = require("./consumeBlockEnd");
const consumeBlockStartOptional = require("./consumeBlockStartOptional");
const consumeIndentOptional = require("./consumeIndentOptional");
const consumeNewBlockLineOptional = require("./consumeNewBlockLineOptional");
const consumeWordOptional = require("./consumeWordOptional");

/** @returns {ChiriLiteralString | undefined} */
module.exports = reader => {
	const s = reader.i;
	if (!reader.consumeOptional('"'))
		return undefined;

	assertNotWhiteSpaceAndNewLine(reader);

	const block = consumeBlockStartOptional(reader);

	/** @type {ChiriLiteralString["segments"]} */
	const segments = [""];
	let pendingNewlines = "";
	String: for (; reader.i < reader.input.length; reader.i++) {
		if (block)
			pendingNewlines += "\\n".repeat(consumeNewBlockLineOptional(reader, true));

		const char = reader.input[reader.i];
		switch (char) {
			case "\\":
				reader.i++;
				if (consumeNewBlockLineOptional(reader, true)) {
					consumeIndentOptional(reader);
					reader.i--;
					break;
				}

				const escapeChar = reader.input[reader.i];
				switch (escapeChar) {
					case "r":
					case "n":
					case "t":
					case "\\":
					case "$":
						segments[segments.length - 1] += pendingNewlines + char + escapeChar;
						pendingNewlines = "";
						break;
					case '"':
						segments[segments.length - 1] += pendingNewlines + escapeChar;
						pendingNewlines = "";
						break;
					default:
						throw reader.error("Unexpected escape character");
				}
				break;
			case "$":
			case "`":
				segments[segments.length - 1] += pendingNewlines + `\\${char}`;
				pendingNewlines = "";
				break;
			case "*":
				const e = reader.i;
				reader.i++;
				const word = consumeWordOptional(reader);
				if (!word) {
					reader.i--;
					segments[segments.length - 1] += pendingNewlines + "*";
					pendingNewlines = "";
					break;
				}

				reader.i--;
				const type = reader.getVariable(word.value).valueType;
				if (!reader.getType(type).stringable)
					throw reader.error(e, `Type '${type}' is not stringable`);

				segments[segments.length - 1] += pendingNewlines;
				pendingNewlines = "";

				segments.push({
					type: "get",
					valueType: type,
					name: word,
				}, "");
				break;
			case "\r":
				break;
			case "\n":
				break String;
			case "\t":
				pendingNewlines += pendingNewlines + "\\t";
				break;
			case `"`:
				if (!block) {
					reader.i++;
					break String;
				}
			default:
				segments[segments.length - 1] += pendingNewlines + char;
				pendingNewlines = "";
		}
	}

	if (block)
		consumeBlockEnd(reader);

	return {
		type: "literal",
		subType: "string",
		segments,
	};
};

import type { ChiriAST, ChiriPosition } from "../read/ChiriReader";
import type { ChiriKeyframe } from "../read/consume/consumeKeyframe";
import type { ChiriMixin } from "../read/consume/consumeMixinOptional";
import type { ChiriProperty } from "../read/consume/consumePropertyOptional";
import type { ChiriWord } from "../read/consume/consumeWord";
import type { ChiriAnimation } from "../read/consume/macro/macroAnimation";
import type { ComponentState } from "../util/componentStates";
import type ChiriCompiler from "./ChiriCompiler";
import type { ChiriWriteConfig } from "./Writer";
import Writer, { QueuedWrite } from "./Writer";
export interface ResolvedProperty extends Omit<ChiriProperty, "property" | "value"> {
    property: ChiriWord;
    value: string;
    merge?: true;
}
export interface ResolvedMixin extends Omit<ChiriMixin, "content" | "name"> {
    states: (ComponentState | undefined)[];
    pseudos: ("before" | "after" | undefined)[];
    name: ChiriWord;
    content: ResolvedProperty[];
    affects: string[];
    index: number;
}
export interface ResolvedAnimation extends Omit<ChiriAnimation, "content" | "name"> {
    name: ChiriWord;
    content: ResolvedAnimationKeyframe[];
}
export interface ResolvedAnimationKeyframe extends Omit<ChiriKeyframe, "at" | "content"> {
    at: number;
    content: ResolvedProperty[];
}
export interface ResolvedViewTransition {
    type: "view-transition";
    subTypes: ("old" | "new")[];
    name: ChiriWord;
    content: ResolvedProperty[];
    position: ChiriPosition;
}
export interface ResolvedFontFace {
    family: ChiriWord;
    content: ResolvedProperty[];
}
export type CSSDocumentSection = "imports" | "property-definitions" | "font-faces" | "root-properties" | "root-styles" | "default" | "view-transitions" | "animations";
export default class CSSWriter extends Writer {
    private currentSection;
    private queues;
    protected get queue(): QueuedWrite[];
    constructor(ast: ChiriAST, dest: string, config?: ChiriWriteConfig);
    createDestPath(outFile: string): string;
    writingTo(section: CSSDocumentSection, dowhile: () => any): void;
    writeProperty(compiler: ChiriCompiler, property: ResolvedProperty): void;
    writeMixin(compiler: ChiriCompiler, mixin: ResolvedMixin): void;
    writeAnimation(compiler: ChiriCompiler, animation: ResolvedAnimation): void;
    writeViewTransition(compiler: ChiriCompiler, viewTransition: ResolvedViewTransition): void;
    writeFontFace(compiler: ChiriCompiler, fontFace: ResolvedFontFace): void;
    onCompileEnd(compiler: ChiriCompiler): void;
}

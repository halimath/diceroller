import { DieKind, Pool } from "src/models";

export function poolToUrlHash(p: Pool): string {
    return p.dice.map(d => dieKindToChar(d.kind)).join("")
}

export function dieKindToChar(k: DieKind): string {
    switch (k) {
        case DieKind.Ability: return "A"
        case DieKind.Proficiency: return "P"
        case DieKind.Difficulty: return "D"
        case DieKind.Challange: return "C"
        case DieKind.Boost: return "B"
        case DieKind.Setback: return "S"
        case DieKind.Force: return "F"
    }
}

export function charToDieKind(c: string): DieKind {
    switch (c) {
        case "A": return DieKind.Ability
        case "P": return DieKind.Proficiency
        case "D": return DieKind.Difficulty
        case "C": return DieKind.Challange
        case "B": return DieKind.Boost
        case "S": return DieKind.Setback
        case "F": return DieKind.Force
        default:
            throw `invalid die kind character: ${c}`
    }
}
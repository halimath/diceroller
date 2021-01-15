import { DieKind, NormalizedPoolResult, Pool, Symbol } from "../models"
import { m, mpl } from "./i18n"

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

export function formatPoolResult (r: NormalizedPoolResult): string {
    let s = ""
    
    if ((r[Symbol.Success] ?? 0) > 0) {
        s += mpl("result.success.t", r[Symbol.Success])
    }

    if ((r[Symbol.Advantage] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.advantage.t", r[Symbol.Advantage])
    }

    if ((r[Symbol.Triumph] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.triumph.t", r[Symbol.Triumph])
    }

    if ((r[Symbol.Failure] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.failure.t", r[Symbol.Failure])
    }

    if ((r[Symbol.Threat] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.threat.t", r[Symbol.Threat])
    }

    if ((r[Symbol.Despair] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.despair.t", r[Symbol.Despair])
    }

    if ((r[Symbol.LightSide] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.lightside.t", r[Symbol.LightSide])
    }

    if ((r[Symbol.DarkSide] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.darkside.t", r[Symbol.DarkSide])
    }

    if (s.length === 0) {
        s = m("result.blank.t")
    }

    return s
}
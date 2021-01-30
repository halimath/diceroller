import { DieKind, AggregatedPoolResult, Pool, DieSymbol } from "../models"
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

export function formatPoolResult (r: AggregatedPoolResult): string {
    let s = ""
    
    if ((r[DieSymbol.Success] ?? 0) > 0) {
        s += mpl("result.success.t", r[DieSymbol.Success])
    }

    if ((r[DieSymbol.Advantage] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.advantage.t", r[DieSymbol.Advantage])
    }

    if ((r[DieSymbol.Triumph] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.triumph.t", r[DieSymbol.Triumph])
    }

    if ((r[DieSymbol.Failure] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.failure.t", r[DieSymbol.Failure])
    }

    if ((r[DieSymbol.Threat] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.threat.t", r[DieSymbol.Threat])
    }

    if ((r[DieSymbol.Despair] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.despair.t", r[DieSymbol.Despair])
    }

    if ((r[DieSymbol.LightSide] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.lightside.t", r[DieSymbol.LightSide])
    }

    if ((r[DieSymbol.DarkSide] ?? 0) > 0) {
        if (s.length > 0) {
            s += ", "
        }
        s += mpl("result.darkside.t", r[DieSymbol.DarkSide])
    }

    if (s.length === 0) {
        s = m("result.blank.t")
    }

    return s
}

export function randomNumber(max: number, startsWithOne = false): number {
    return Math.floor(Math.random() * Math.floor(max)) + (startsWithOne ? 1:0)
}
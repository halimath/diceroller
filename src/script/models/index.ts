import { randomNumber as randomInteger } from "../utils"

export enum DieSymbol {
    Success = "success",
    Advantage = "advantage",
    Failure = "failure",
    Threat = "threat",
    Triumph = "triumph",
    Despair = "despair",
    LightSide = "lightside",
    DarkSide = "darkside",
}

export type Side = null | DieSymbol | [DieSymbol, DieSymbol]

export enum DieKind {
    Ability = "ability",
    Proficiency = "proficiency",
    Difficulty = "difficulty",
    Challange = "challange",
    Boost = "boost",
    Setback = "setback",
    Force = "force",
}

export const DieKindOrder = [
    DieKind.Proficiency,
    DieKind.Ability,
    DieKind.Boost,
    DieKind.Challange,
    DieKind.Difficulty,
    DieKind.Setback,
    DieKind.Force
]

export enum NumericDieKind {
    D10 = "ten",
    D100 = "hundred"
}

export enum DifficultyLevel {
    Easy = "easy",
    Average = "average",
    Hard = "hard",
    Daunting = "daunting",
    Formidable = "formidable",
}



export const difficultyDiceCount = new Map([
    [DifficultyLevel.Easy, 1],
    [DifficultyLevel.Average, 2],
    [DifficultyLevel.Hard, 3],
    [DifficultyLevel.Daunting, 4],
    [DifficultyLevel.Formidable, 5]
])

export class Difficulty {

    static get Easy(): Difficulty {
        return new Difficulty(DifficultyLevel.Easy, 1)
    }

    static get Average(): Difficulty {
        return new Difficulty(DifficultyLevel.Average, 2)
    }
    static get Hard(): Difficulty {
        return new Difficulty(DifficultyLevel.Hard, 3)
    }
    static get Daunting(): Difficulty {
        return new Difficulty(DifficultyLevel.Daunting, 4)
    }
    static get Formidable(): Difficulty {
        return new Difficulty(DifficultyLevel.Formidable, 5)
    }

    private constructor(public readonly level: DifficultyLevel, public readonly diceCount: number) { }
}


export enum PoolModification {
    Ability,
    Difficulty
}

export class Die {
    static get Ability(): Die {
        return new Die(DieKind.Ability,
            [
                null,
                DieSymbol.Success,
                [DieSymbol.Success, DieSymbol.Success],
                DieSymbol.Advantage,
                [DieSymbol.Advantage, DieSymbol.Advantage],
                DieSymbol.Success,
                [DieSymbol.Advantage, DieSymbol.Success],
                DieSymbol.Advantage,
            ])
    }

    static get Proficiency(): Die {
        return new Die(DieKind.Proficiency,
            [
                null,
                DieSymbol.Success,
                DieSymbol.Success,
                DieSymbol.Triumph,
                [DieSymbol.Success, DieSymbol.Success],
                [DieSymbol.Success, DieSymbol.Success],
                [DieSymbol.Advantage, DieSymbol.Advantage],
                [DieSymbol.Advantage, DieSymbol.Advantage],
                DieSymbol.Advantage,
                [DieSymbol.Success, DieSymbol.Advantage],
                [DieSymbol.Success, DieSymbol.Advantage],
                [DieSymbol.Success, DieSymbol.Advantage],
            ])
    }

    static get Difficulty(): Die {
        return new Die(DieKind.Difficulty,
            [
                null,
                [DieSymbol.Failure, DieSymbol.Failure],
                DieSymbol.Threat,
                [DieSymbol.Failure, DieSymbol.Threat],
                [DieSymbol.Threat, DieSymbol.Threat],
                DieSymbol.Threat,
                DieSymbol.Failure,
                DieSymbol.Threat,
            ])
    }

    static get Challange(): Die {
        return new Die(DieKind.Challange,
            [

                null,
                DieSymbol.Failure,
                DieSymbol.Failure,
                DieSymbol.Threat,
                DieSymbol.Threat,
                DieSymbol.Despair,
                [DieSymbol.Threat, DieSymbol.Threat],
                [DieSymbol.Threat, DieSymbol.Threat],
                [DieSymbol.Failure, DieSymbol.Failure],
                [DieSymbol.Failure, DieSymbol.Failure],
                [DieSymbol.Failure, DieSymbol.Threat],
                [DieSymbol.Failure, DieSymbol.Threat],
            ])
    }

    static get Boost(): Die {
        return new Die(DieKind.Boost,
            [
                null,
                null,
                DieSymbol.Success,
                DieSymbol.Advantage,
                [DieSymbol.Success, DieSymbol.Advantage],
                [DieSymbol.Advantage, DieSymbol.Advantage],
            ])
    }

    static get Setback(): Die {
        return new Die(DieKind.Setback,
            [
                null,
                null,
                DieSymbol.Failure,
                DieSymbol.Failure,
                DieSymbol.Threat,
                DieSymbol.Threat,
            ])
    }

    static get Force(): Die {
        return new Die(DieKind.Force,
            [
                DieSymbol.LightSide,
                DieSymbol.LightSide,
                DieSymbol.DarkSide,
                DieSymbol.DarkSide,
                DieSymbol.DarkSide,
                DieSymbol.DarkSide,
                DieSymbol.DarkSide,
                DieSymbol.DarkSide,
                [DieSymbol.LightSide, DieSymbol.LightSide],
                [DieSymbol.LightSide, DieSymbol.LightSide],
                [DieSymbol.LightSide, DieSymbol.LightSide],
                [DieSymbol.DarkSide, DieSymbol.DarkSide],
            ])
    }

    static ByKind(kind: DieKind): Die {
        switch (kind) {
            case DieKind.Ability: return Die.Ability
            case DieKind.Boost: return Die.Boost
            case DieKind.Challange: return Die.Challange
            case DieKind.Difficulty: return Die.Difficulty
            case DieKind.Proficiency: return Die.Proficiency
            case DieKind.Setback: return Die.Setback
            case DieKind.Force: return Die.Force
        }
    }

    private constructor(public readonly kind: DieKind, public readonly sides: Array<Side>) { }

    roll(): DieResult {
        const side = this.sides[randomInteger(this.sides.length)]
        if (side === null) {
            return DieResult.blank(this.kind)
        }

        if (Array.isArray(side)) {
            return new DieResult(this.kind, side)
        }

        return new DieResult(this.kind, [side])
    }
}

export class DieResult {
    static blank(kind: DieKind): DieResult {
        return new DieResult(kind, [])
    }

    constructor(public readonly kind: DieKind, public readonly symbols: Array<DieSymbol>) { }
}

export class Pool {

    static empty(): Pool {
        return new Pool([])
    }

    constructor(public readonly dice: Array<Die>) { }

    get empty(): boolean {
        return this.dice.length === 0
    }

    addDie(die: Die): Pool {
        const dice = [...(this.dice)]
        dice.push(die)
        return new Pool(dice).sort()
    }

    removeDie(die: Die): Pool {
        const dice = [...(this.dice)]
        dice.splice(dice.indexOf(die), 1)
        return new Pool(dice)
    }

    sort(order = DieKindOrder): Pool {
        const sortedDice = this.dice.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))
        return new Pool(sortedDice)
    }

    clear(kind: DieKind) {
        const dice = [...(this.dice)].filter(die => die.kind !== kind)

        return new Pool(dice)
    }

    roll(): PoolResult {
        return new PoolResult(this.dice.map(d => d.roll()))
    }

    upgrade(modification: PoolModification): Pool {

        const { baseKind, strongerKind } = determineModificationLevel(modification)

        const die = this.dice.find(die => die.kind === baseKind)
        if (die !== undefined) {
            return this.replaceDie(die, Die.ByKind(strongerKind))
        }

        return this.addDie(Die.ByKind(baseKind))
    }

    downgrade(modification: PoolModification): Pool {

        const { baseKind, strongerKind } = determineModificationLevel(modification)

        const die = this.dice.find(die => die.kind === baseKind)
        if (die !== undefined) {
            return this.removeDie(die)
        }

        const dieToReplace = this.dice.find(die => die.kind === strongerKind)
        if (dieToReplace !== undefined) {
            return this.replaceDie(dieToReplace, Die.ByKind(baseKind))
        }

        return new Pool(this.dice)
    }

    private replaceDie(die: Die, newDie: Die): Pool {
        const pool = this.removeDie(die)
        return pool.addDie(newDie)
    }
}

function determineModificationLevel(modification: PoolModification): { baseKind: DieKind, strongerKind: DieKind } {
    switch (modification) {
        case PoolModification.Ability:
            return { baseKind: DieKind.Ability, strongerKind: DieKind.Proficiency }
        case PoolModification.Difficulty:
            return { baseKind: DieKind.Difficulty, strongerKind: DieKind.Challange }
    }
}


export type AggregatedPoolResult = Record<DieSymbol, number>

export class PoolResult {
    constructor(public readonly dieResults: Array<DieResult>) { }

    normalize(): AggregatedPoolResult {
        const aggregates = this.aggregate()

        const tmp: { [key in DieSymbol]?: number } = {}
        tmp[DieSymbol.Success] = 0
        tmp[DieSymbol.Advantage] = 0
        tmp[DieSymbol.Triumph] = 0
        tmp[DieSymbol.Failure] = 0
        tmp[DieSymbol.Threat] = 0
        tmp[DieSymbol.Despair] = 0
        tmp[DieSymbol.LightSide] = 0
        tmp[DieSymbol.DarkSide] = 0

        const result = tmp as AggregatedPoolResult

        const applyDelta = (left: DieSymbol, right: DieSymbol) => {
            if (aggregates[left] > aggregates[right]) {
                result[left] = aggregates[left] - aggregates[right]
            } else if (aggregates[left] < aggregates[right]) {
                result[right] = aggregates[right] - aggregates[left]
            }
        }

        const copyPositive = (s: DieSymbol) => {
            if (aggregates[s] > 0) {
                result[s] = aggregates[s]
            }
        }

        applyDelta(DieSymbol.Success, DieSymbol.Failure)
        applyDelta(DieSymbol.Advantage, DieSymbol.Threat)

        copyPositive(DieSymbol.Triumph)
        copyPositive(DieSymbol.Despair)
        copyPositive(DieSymbol.LightSide)
        copyPositive(DieSymbol.DarkSide)

        return result
    }

    aggregate(): AggregatedPoolResult {
        const result = {
            success: 0,
            advantage: 0,
            triumph: 0,
            failure: 0,
            threat: 0,
            despair: 0,
            lightside: 0,
            darkside: 0,
        }

        this.dieResults
            .flatMap(r => r.symbols)
            .map(s => {
                result[s]++
                if (s === DieSymbol.Triumph) {
                    result[DieSymbol.Success]++
                } else if (s === DieSymbol.Despair) {
                    result[DieSymbol.Failure]++
                }
            })

        return result
    }
}

export class NumericDieResult {
    constructor(public readonly value: number) { }
}

export class Model {
    constructor(public readonly pool: Pool, public readonly poolResult?: PoolResult, public readonly numericDieResult?: NumericDieResult) { }
}
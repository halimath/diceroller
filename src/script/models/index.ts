
export enum Symbol {
    Success = "success",
    Advantage = "advantage",
    Failure = "failure",
    Threat = "threat",
    Triumph = "triumph",
    Despair = "despair",
    LightSide = "lightside",
    DarkSide = "darkside",
}

export type Side = null | Symbol | [Symbol, Symbol]

export enum DieKind {
    Ability = "ability",
    Proficiency = "proficiency",
    Difficulty = "difficulty",
    Challange = "challange",
    Boost = "boost",
    Setback = "setback",
    Force = "force",
}

export class Die {
    static get Ability(): Die {
        return new Die(DieKind.Ability,
            [
                null,
                Symbol.Success,
                [Symbol.Success, Symbol.Success],
                Symbol.Advantage,
                [Symbol.Advantage, Symbol.Advantage],
                Symbol.Success,
                [Symbol.Advantage, Symbol.Success],
                Symbol.Advantage,
            ])
    }

    static get Proficiency(): Die {
        return new Die(DieKind.Proficiency,
            [
                null,
                Symbol.Success,
                Symbol.Success,
                Symbol.Triumph,
                [Symbol.Success, Symbol.Success],
                [Symbol.Success, Symbol.Success],
                [Symbol.Advantage, Symbol.Advantage],
                [Symbol.Advantage, Symbol.Advantage],
                Symbol.Advantage,
                [Symbol.Success, Symbol.Advantage],
                [Symbol.Success, Symbol.Advantage],
                [Symbol.Success, Symbol.Advantage],
            ])
    }

    static get Difficulty(): Die {
        return new Die(DieKind.Difficulty,
            [
                null,
                [Symbol.Failure, Symbol.Failure],
                Symbol.Threat,
                [Symbol.Failure, Symbol.Threat],
                [Symbol.Threat, Symbol.Threat],
                Symbol.Threat,
                Symbol.Failure,
                Symbol.Threat,
            ])
    }

    static get Challange(): Die {
        return new Die(DieKind.Challange,
            [

                null,
                Symbol.Failure,
                Symbol.Failure,
                Symbol.Threat,
                Symbol.Threat,
                Symbol.Despair,
                [Symbol.Threat, Symbol.Threat],
                [Symbol.Threat, Symbol.Threat],
                [Symbol.Failure, Symbol.Failure],
                [Symbol.Failure, Symbol.Failure],
                [Symbol.Failure, Symbol.Threat],
                [Symbol.Failure, Symbol.Threat],
            ])
    }

    static get Boost(): Die {
        return new Die(DieKind.Boost,
            [
                null,
                null,
                Symbol.Success,
                Symbol.Advantage,
                [Symbol.Success, Symbol.Advantage],
                [Symbol.Advantage, Symbol.Advantage],
            ])
    }

    static get Setback(): Die {
        return new Die(DieKind.Setback,
            [
                null,
                null,
                Symbol.Failure,
                Symbol.Failure,
                Symbol.Threat,
                Symbol.Threat,
            ])
    }

    static get Force(): Die {
        return new Die(DieKind.Force,
            [
                Symbol.LightSide,
                Symbol.LightSide,
                Symbol.DarkSide,
                Symbol.DarkSide,
                Symbol.DarkSide,
                Symbol.DarkSide,
                Symbol.DarkSide,
                Symbol.DarkSide,
                [Symbol.LightSide, Symbol.LightSide],
                [Symbol.LightSide, Symbol.LightSide],
                [Symbol.LightSide, Symbol.LightSide],
                [Symbol.DarkSide, Symbol.DarkSide],
            ])
    }

    private constructor(public readonly kind: DieKind, public readonly sides: Array<Side>) { }

    roll(): DieResult {
        const side = this.sides[Math.floor(Math.random() * Math.floor(this.sides.length))]
        if (side === null) {
            return DieResult.blank()
        }

        if (Array.isArray(side)) {
            return new DieResult(side)
        }

        return new DieResult([side])
    }
}

export class DieResult {
    static blank(): DieResult {
        return new DieResult([])
    }

    constructor(public readonly symbols: Array<Symbol>) { }
}

export class Pool {
    static empty(): Pool {
        return new Pool([])
    }

    constructor (public readonly dice: Array<Die>){}

    get empty(): boolean {
        return this.dice.length === 0
    }

    addDie (die: Die): Pool {
        const dice = [...(this.dice)]
        dice.push(die)
        // TODO: Sort pool
        return new Pool(dice)
    }

    removeDie (die: Die): Pool {
        const dice = [...(this.dice)]
        dice.splice(dice.indexOf(die), 1)
        return new Pool(dice)
    }

    roll(): PoolResult {
        return new PoolResult(this.dice.map(d => d.roll()))
    }
}

export interface NormalizedPoolResult extends Record<Symbol, number> {
}

export class PoolResult {
    constructor(public readonly dieResults: Array<DieResult>) {}

    normalize(): NormalizedPoolResult {
        const aggregates = this.aggregate()
        
        const tmp: {[key in Symbol]?: number} = {}
        tmp[Symbol.Success] = 0
        tmp[Symbol.Advantage] = 0
        tmp[Symbol.Triumph] = 0
        tmp[Symbol.Failure] = 0
        tmp[Symbol.Threat] = 0
        tmp[Symbol.Despair] = 0
        tmp[Symbol.LightSide] = 0
        tmp[Symbol.DarkSide] = 0

        const result = tmp as NormalizedPoolResult

        const applyDelta = (left: Symbol, right: Symbol) => {
            if (aggregates[left] > aggregates[right]) {
                result[left] = aggregates[left] - aggregates[right]
            } else if (aggregates[left] < aggregates[right]) {
                result[right] = aggregates[right] - aggregates[left]
            }            
        }

        const copyPositive = (s: Symbol) => {
            if (aggregates[s] > 0) {
                result[s]  = aggregates[s]
            }
        }

        applyDelta(Symbol.Success, Symbol.Failure)
        applyDelta(Symbol.Advantage, Symbol.Threat)

        copyPositive(Symbol.Triumph)
        copyPositive(Symbol.Despair)
        copyPositive(Symbol.LightSide)
        copyPositive(Symbol.DarkSide)

        return result
    }

    private aggregate(): {[key in Symbol]: number} {
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
                if (s === Symbol.Triumph) {
                    result[Symbol.Success]++
                } else if (s === Symbol.Despair) {
                    result[Symbol.Failure]++
                }
            })

        return result
    }
}

export class Model { 
    constructor (public readonly pool: Pool, public readonly poolResult?: PoolResult) {}
}

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

    constructor(public readonly symbols: Array<DieSymbol>) { }
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

export type NormalizedPoolResult = Record<DieSymbol, number>

export class PoolResult {
    constructor(public readonly dieResults: Array<DieResult>) {}

    normalize(): NormalizedPoolResult {
        const aggregates = this.aggregate()
        
        const tmp: {[key in DieSymbol]?: number} = {}
        tmp[DieSymbol.Success] = 0
        tmp[DieSymbol.Advantage] = 0
        tmp[DieSymbol.Triumph] = 0
        tmp[DieSymbol.Failure] = 0
        tmp[DieSymbol.Threat] = 0
        tmp[DieSymbol.Despair] = 0
        tmp[DieSymbol.LightSide] = 0
        tmp[DieSymbol.DarkSide] = 0

        const result = tmp as NormalizedPoolResult

        const applyDelta = (left: DieSymbol, right: DieSymbol) => {
            if (aggregates[left] > aggregates[right]) {
                result[left] = aggregates[left] - aggregates[right]
            } else if (aggregates[left] < aggregates[right]) {
                result[right] = aggregates[right] - aggregates[left]
            }            
        }

        const copyPositive = (s: DieSymbol) => {
            if (aggregates[s] > 0) {
                result[s]  = aggregates[s]
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

    private aggregate(): {[key in DieSymbol]: number} {
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

export class Model { 
    constructor (public readonly pool: Pool, public readonly poolResult?: PoolResult) {}
}
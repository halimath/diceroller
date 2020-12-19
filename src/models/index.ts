
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
    format(): string
}

class NormalizedPoolResultImpl implements NormalizedPoolResult {
    get success(): number {
        return this.data[Symbol.Success] ?? 0
    }

    get advantage(): number {
        return this.data[Symbol.Advantage] ?? 0
    }

    get triumph(): number {
        return this.data[Symbol.Triumph] ?? 0
    }

    get failure(): number {
        return this.data[Symbol.Failure] ?? 0
    }

    get threat(): number {
        return this.data[Symbol.Threat] ?? 0
    }

    get despair(): number {
        return this.data[Symbol.Despair] ?? 0
    }

    get lightside(): number {
        return this.data[Symbol.LightSide] ?? 0
    }

    get darkside(): number {
        return this.data[Symbol.DarkSide] ?? 0
    }

    constructor (private readonly data: {[key in Symbol]?: number }) {}

    format(): string {
        let s = ""
    
        if ((this.data[Symbol.Success] ?? 0) > 0) {
            s += `${this.data[Symbol.Success]} Success${(this.data[Symbol.Success] ?? 0) > 1 ? "es" : ""}`
        }
    
        if ((this.data[Symbol.Advantage] ?? 0) > 0) {
            if (s.length > 0) {
                s += ", "
            }
            s += `${this.data[Symbol.Advantage]} Advantage${(this.data[Symbol.Advantage] ?? 0) > 1 ? "s" : ""}`
        }
    
        if ((this.data[Symbol.Triumph] ?? 0) > 0) {
            if (s.length > 0) {
                s += ", "
            }
            s += `${this.data[Symbol.Triumph]} Triumph${(this.data[Symbol.Triumph] ?? 0) > 1 ? "s" : ""}`
        }
    
        if ((this.data[Symbol.Failure] ?? 0) > 0) {
            if (s.length > 0) {
                s += ", "
            }
            s += `${this.data[Symbol.Failure]} Failure${(this.data[Symbol.Failure] ?? 0) > 1 ? "s" : ""}`
        }
    
        if ((this.data[Symbol.Threat] ?? 0) > 0) {
            if (s.length > 0) {
                s += ", "
            }
            s += `${this.data[Symbol.Threat]} Threat${(this.data[Symbol.Threat] ?? 0) > 1 ? "s" : ""}`
        }
    
        if ((this.data[Symbol.Despair] ?? 0) > 0) {
            if (s.length > 0) {
                s += ", "
            }
            s += `${this.data[Symbol.Despair]} Despair${(this.data[Symbol.Despair] ?? 0) > 1 ? "s" : ""}`
        }
    
        if ((this.data[Symbol.LightSide] ?? 0) > 0) {
            if (s.length > 0) {
                s += ", "
            }
            s += `${this.data[Symbol.LightSide]} Light Side${(this.data[Symbol.LightSide] ?? 0) > 1 ? "s" : ""}`
        }
    
        if ((this.data[Symbol.DarkSide] ?? 0) > 0) {
            if (s.length > 0) {
                s += ", "
            }
            s += `${this.data[Symbol.DarkSide]} Dark Side${(this.data[Symbol.DarkSide] ?? 0) > 1 ? "s" : ""}`
        }
    
        return s
    }
}

export class PoolResult {
    constructor(public readonly dieResults: Array<DieResult>) {}

    normalize(): NormalizedPoolResult {
        const aggregates = this.aggregate()
        
        const result: {[key in Symbol]?: number} = {}

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

        return new NormalizedPoolResultImpl(result)
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
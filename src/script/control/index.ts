import { copyTextToClipboard, isClipboardSupported, isSharingSupported, notify, shareText } from "../browser"
import { Die, DieKind, Model, NumericDieResult, NumericDieKind, Pool, DifficultyLevel, PoolModification } from "../models"

import { formatPoolResult, poolToUrlHash, randomNumber } from "../utils"
import { m } from "../utils/i18n"

export class AddDie {
    public readonly command = "add-die"
    constructor(public readonly kind: DieKind) { }
}

export class RemoveDie {
    public readonly command = "remove-die"
    constructor(public readonly die: Die) { }
}

export class RollPool {
    public readonly command = "roll-pool"
}

export class EmptyPool {
    public readonly command = "empty-pool"
}

export class PoolUpgrade {
    public readonly command = "pool-upgrade"
    constructor(public readonly modification: PoolModification) { }

}

export class PoolDowngrade {
    public readonly command = "pool-downgrade"
    constructor(public readonly modification: PoolModification) { }

}

export class RollNumeric {
    public readonly command = "roll-numeric"
    constructor(public readonly kind: NumericDieKind) { }
}

export class Copy {
    public readonly command = "copy"
}

export class Share {
    public readonly command = "share"
}

export class RemoveNumericResult {
    public readonly command = "remove-numeric-result"
}

export class AddDifficulty {
    public readonly command = "add-difficulty"
    constructor(public readonly difficulty: DifficultyLevel) { }
}

export type Message = AddDie | RemoveDie | RollPool | EmptyPool | Copy | Share | RollNumeric | RemoveNumericResult | AddDifficulty | PoolUpgrade | PoolDowngrade

export function update(model: Model, msg: Message): Model {
    let p: Pool

    switch (msg.command) {
        case "add-die":
            p = model.pool.addDie(selectDie(msg.kind))
            history.replaceState(null, "", `/#${poolToUrlHash(p)}`)
            return new Model(p, model.poolResult, model.numericDieResult)

        case "remove-die":
            p = model.pool.removeDie(msg.die)
            history.replaceState(null, "", `/#${poolToUrlHash(p)}`)
            return new Model(p, model.poolResult, model.numericDieResult)

        case "roll-pool":
            return new Model(model.pool, model.pool.roll(), model.numericDieResult)

        case "empty-pool":
            history.replaceState(null, "", `/#`)
            return new Model(Pool.empty(), undefined, model.numericDieResult)

        case "copy":
            if (typeof model.poolResult === "undefined") {
                console.error("inconsistency detected: can't copy while poolResult is undefined")
                return model
            }

            if (isClipboardSupported()) {
                copyTextToClipboard(formatPoolResult(model.poolResult.normalize()))
                notify(m("result.copied.t"))
            }

            return model

        case "share":
            if (typeof model.poolResult === "undefined") {
                console.error("inconsistency detected: can't share while poolResult is undefined")
                return model
            }

            if (isSharingSupported()) {
                shareText(formatPoolResult(model.poolResult.normalize()))
            }

            return model
        case "roll-numeric":
            return new Model(model.pool, model.poolResult, new NumericDieResult(randomNumber(selectNumericValue(msg.kind), true)))
        case "remove-numeric-result":
            return new Model(model.pool, model.poolResult)
        case "add-difficulty":

            p = model.pool.clear(DieKind.Difficulty)

            selectDifficultyDice(msg.difficulty).forEach(() => {
                p = p.addDie(Die.Difficulty)
            })
            history.replaceState(null, "", `/#${poolToUrlHash(p)}`)

            return new Model(p, model.poolResult, model.numericDieResult)

        case "pool-upgrade":
            p = model.pool.upgrade(msg.modification)
            return new Model(p, model.poolResult, model.numericDieResult)
        case "pool-downgrade":
            p = model.pool.downgrade(msg.modification)
            return new Model(p, model.poolResult, model.numericDieResult)
    }
}

function selectDie(k: DieKind): Die {
    switch (k) {
        case DieKind.Ability:
            return Die.Ability
        case DieKind.Proficiency:
            return Die.Proficiency
        case DieKind.Difficulty:
            return Die.Difficulty
        case DieKind.Challange:
            return Die.Challange
        case DieKind.Boost:
            return Die.Boost
        case DieKind.Setback:
            return Die.Setback
        case DieKind.Force:
            return Die.Force
    }
}

function selectNumericValue(kind: NumericDieKind): number {
    switch (kind) {
        case NumericDieKind.D10:
            return 10
        case NumericDieKind.D100:
            return 100
    }
}

function selectDifficultyDice(difficulty: DifficultyLevel): Array<Die> {
    switch (difficulty) {
        case DifficultyLevel.Easy: return [Die.Difficulty]
        case DifficultyLevel.Average: return [Die.Difficulty, Die.Difficulty]
        case DifficultyLevel.Hard: return [Die.Difficulty, Die.Difficulty, Die.Difficulty]
        case DifficultyLevel.Daunting: return [Die.Difficulty, Die.Difficulty, Die.Difficulty, Die.Difficulty]
        case DifficultyLevel.Formidable: return [Die.Difficulty, Die.Difficulty, Die.Difficulty, Die.Difficulty, Die.Difficulty]
    }
}
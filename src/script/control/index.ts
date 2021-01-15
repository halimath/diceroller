import { copyTextToClipboard, isClipboardSupported, isSharingSupported, notify, shareText } from "../browser"
import { Die, DieKind, Model, Pool } from "../models"
import { formatPoolResult, poolToUrlHash } from "../utils"
import { m } from "../utils/i18n"

export class AddDie {
    public readonly command = "add-die"
    constructor(public readonly kind: DieKind) { }
}

export class RemoveDie {
    public readonly command = "remove-die"
    constructor(public readonly die: Die) { }
}

export class Roll {
    public readonly command = "roll"
}

export class EmptyPool {
    public readonly command = "empty-pool"
}

export class Copy {
    public readonly command = "copy"
}

export class Share {
    public readonly command = "share"
}

export type Message = AddDie | RemoveDie | Roll | EmptyPool | Copy | Share

export function update(model: Model, msg: Message): Model {
    let p: Pool

    switch (msg.command) {
        case "add-die": 
            p = model.pool.addDie(selectDie(msg.kind))
            history.replaceState(null, "",  `/#${poolToUrlHash(p)}`)
            return new Model(p)

        case "remove-die":
            p = model.pool.removeDie(msg.die)
            history.replaceState(null, "",  `/#${poolToUrlHash(p)}`)
            return new Model(p)

        case "roll":
            return new Model(model.pool, model.pool.roll())

        case "empty-pool":
            history.replaceState(null, "",  `/#`)
            return new Model(Pool.empty())

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
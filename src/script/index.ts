import * as wecco from "@weccoframework/core"
import { AddDie, RollPool, update } from "./control"
import { Model, Pool } from "./models"
import { charToDieKind } from "./utils"
import { root } from "./views"

import "../styles/index.sass"


document.addEventListener("DOMContentLoaded", () => {
    const context = wecco.app(() => new Model(Pool.empty()), update, root, "#app")
    if (document.location.hash.length > 0) {
        document.location.hash.substr(1).split("").forEach(c => {
            try {
                context.emit(new AddDie(charToDieKind(c)))
            } catch (e) {
                // Nothing to do here; dispatching the AddDie message forces a rewrite of the url eliminating any misplaced chars.
            }
        })
        context.emit(new RollPool())
    }
})

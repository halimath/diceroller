import * as wecco from "@wecco/core"
import { version } from "../../../package.json"
import { isClipboardSupported, isSharingSupported } from "../browser"
import { AddDie, Copy, EmptyPool, Message, RemoveDie, RemoveNumericResult, RollNumeric, RollPool, Share } from "../control"
import { Die, DieKind, Model, AggregatedPoolResult, Pool, DieSymbol, PoolResult, NumericDieKind, NumericDieResult } from "../models"
import { formatPoolResult } from "../utils"
import { m } from "../utils/i18n"

export function root(model: Model, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return appShell(wecco.html`
    <div class="row">
        <div class="col s12 m12 l6">
            ${pool(model.pool, context)}
            <hr />
            ${toolbar(context)}
            <hr />
            <div class="row">

                <div class="col">
                    ${addNumericDie(NumericDieKind.D10, context)}
                    ${addNumericDie(NumericDieKind.D100, context)}
                </div>
                <div class="col center-align">
                    ${model.numericDieResult ? numericResult(model.numericDieResult, context) : ""}
                </div>
            </div>
        </div>
      
        ${model.poolResult ? result(model.poolResult, context) : ""}

        
    </div>
    `)
}

function toolbar(context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return wecco.html`
        <p class="center-align">
            ${addDie(DieKind.Proficiency, context)}
            ${addDie(DieKind.Ability, context)}
            ${addDie(DieKind.Boost, context)}
            ${addDie(DieKind.Difficulty, context)}
            ${addDie(DieKind.Challange, context)}
            ${addDie(DieKind.Setback, context)}
            ${addDie(DieKind.Force, context)}
        </p>
        <p>${m("pool.usage.t")}</p>

    `
}

function pool(pool: Pool, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    let body: wecco.ElementUpdate

    if (pool.empty) {
        body = wecco.html`<p class="center-align empty-pool-message"><em>${m("pool.empty.t")}</em></p>`
    } else {
        body = wecco.html`
            <p class="center-align">
                ${pool.dice.map(d => removeDie(d, context))}
            </p>
        ` 
    }

    return wecco.html`        
        ${body}
        <p class="right-align">
            <a class="btn-flat m-r2 light-blue-text text-darken-4" ?disabled=${pool.empty} @click=${() => context.emit(new EmptyPool())}><i class="material-icons left">delete</i>${m("pool.emptyPool.t")}</a>
            <a class="btn waves-effect waves-light m-r2 light-blue darken-4" ?disabled=${pool.empty} @click=${() => context.emit(new RollPool())}>${m("pool.roll.t")}</a>
        </p>
    `
}

function result(result: PoolResult, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    const normalizedResult = result.normalize()
    const aggregatedResult = result.aggregate()

    return wecco.html`
    <div class="col s12 m12 l6">
        <p class="center-align">
            ${resultIcons(normalizedResult)}
            ${resultText(normalizedResult)}
        </p>
        <div class="right-align">
            ${isClipboardSupported() ? wecco.html`<a class="btn waves-effect waves-light m-r2 light-blue darken-4" @click=${() => context.emit(new Copy())}><i class="material-icons">content_copy</i></a>` : ""}
            ${isSharingSupported() ? wecco.html`<a class="btn waves-effect waves-light m-r2 light-blue darken-4" @click=${() => context.emit(new Share())}><i class="material-icons">share</i></a>` : ""}
        </div>
        <p>${m("result.details")}</p>
        <p class="center-align aggregated-result">
            ${resultIcons(aggregatedResult)}
            <p>${formatPoolResult(aggregatedResult)}</p>
        </p>
    </div>
    `
}

function numericResult(result: NumericDieResult, context: wecco.AppContext<Message> ): wecco.ElementUpdate {
    return wecco.html`
    <div class="chip minw-2 center-align">
        ${result.value}
        <i class="remove-numeric-result material-icons" @click=${() => context.emit(new RemoveNumericResult())}>delete</i>
    </div>
    `
}

function resultText(result: AggregatedPoolResult): wecco.ElementUpdate {
    return wecco.html`<p class="flow-text">${formatPoolResult(result)}</p>`
}

function resultIcons(result: AggregatedPoolResult): wecco.ElementUpdate {
    const symbols: Array<wecco.ElementUpdate> = []

    const contributeIcons = (s: DieSymbol) => {
        for (let i = 0; i < (result[s] ?? 0); i++) {
            symbols.push(symbolIcon(s))
        }
    }

    contributeIcons(DieSymbol.Success)
    contributeIcons(DieSymbol.Advantage)
    contributeIcons(DieSymbol.Triumph)
    contributeIcons(DieSymbol.Failure)
    contributeIcons(DieSymbol.Threat)
    contributeIcons(DieSymbol.Despair)
    contributeIcons(DieSymbol.LightSide)
    contributeIcons(DieSymbol.DarkSide)

    return wecco.html`${symbols}`
}

function symbolIcon (s: DieSymbol): wecco.ElementUpdate {
    return wecco.html`<svg class="roll-icon" xmlns="http://www.w3.org/2000/svg"><use href="#icon-${s}" xmlns="http://www.w3.org/2000/svg"></use></svg>`
}


function removeDie(die: Die, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return dieButton(die.kind, "", new RemoveDie(die), context)
}

function addDie(die: DieKind, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return dieButton(die, "btn-small", new AddDie(die), context)
}

function dieButton(die: DieKind, additionalStyleClasses: string, msg: Message, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    const [styleClasses, labelKey] = determineButtonStyle(die)
    return wecco.html`<button class="btn waves-effect waves-light m-r2 ${styleClasses} ${additionalStyleClasses}" @click=${() => context.emit(msg)}>${m(labelKey)}</button>`

}

function addNumericDie(numericDieKind: NumericDieKind,context: wecco.AppContext<Message>): wecco.ElementUpdate {
    const [styleClasses, labelKey]= determineNumericStyle(numericDieKind)

    return wecco.html`<button class="btn waves-effect waves-light m-r2 ${styleClasses}" @click=${() => context.emit(new RollNumeric(numericDieKind))}>${m(labelKey)}</button>`
}

function determineNumericStyle(numericDieKind: NumericDieKind):[string,string] {
    switch(numericDieKind) {
        case NumericDieKind.D10:
            return ["indigo", "die.d10"]
        case NumericDieKind.D100:
            return ["deep-orange darken-4", "die.d100"]
    }
}


function determineButtonStyle(die: DieKind): [string, string] {
    switch (die) {
        case DieKind.Ability:
            return ["green", "die.ability.initial"]
        case DieKind.Proficiency:
            return ["yellow black-text", "die.proficiency.initial"]
        case DieKind.Difficulty:
            return ["purple darken-3", "die.difficulty.initial"]
        case DieKind.Challange:
            return ["red", "die.challange.initial"]
        case DieKind.Boost:
            return ["blue lighten-2 black-text", "die.boost.initial"]
        case DieKind.Setback:
            return ["black", "die.setback.initial"]
        case DieKind.Force:
            return ["white black-text", "die.force.initial"]
    }
}

function appShell(main: wecco.ElementUpdate): wecco.ElementUpdate {
    return wecco.html`
    <header>
        <nav>
            <div class="nav-wrapper blue-grey darken-4">
                <div class="container">
                    <a class="brand-logo left" href="/">Dice Roller</a>
                    <ul class="right">
                        <li><a href="https://github.com/halimath/diceroller/"><img src="/img/github.png" height="48" alt="github.com/halimath/diceroller"></a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <main>
        <div class="container">${main}</div>        
    </main>
    <footer class="page-footer blue-grey darken-2">
        <div class="container">
            <div class="row">
                <div class="col s12">
                    <p>DiceRoller v${version}</p>
                    <p>Copyright (c) 2020 Alexander Metzner.</p>
                </div>                
            </div>
        </div>
    </footer>
    `
}

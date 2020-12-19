import * as wecco from "@wecco/core"

import {AddDie, Copy, EmptyPool, Message, RemoveDie, Roll, Share} from "../control"
import {Die, DieKind, Model, NormalizedPoolResult, Pool, PoolResult, Symbol} from "../models"

import {version} from "../../package.json"
import { isClipboardSupported, isSharingSupported } from "src/browser"

export function root(model: Model, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return appShell(wecco.html`
    <div class="row">
        <div class="col s12 m12 l6">
            <h2>Pool</h2>
            <p class="center-align">
                ${addDie(DieKind.Ability, context)}
                ${addDie(DieKind.Proficiency, context)}
                ${addDie(DieKind.Difficulty, context)}
                ${addDie(DieKind.Challange, context)}
                ${addDie(DieKind.Boost, context)}
                ${addDie(DieKind.Setback, context)}
                ${addDie(DieKind.Force, context)}
            </p>
            <p>Tap a small die above to add it to the pool. Tap a die from the pool below to remove it.</p>
            ${pool(model.pool, context)}
        </div>
        ${model.poolResult ? result(model.poolResult.normalize(), context) : ""}
    </div>
    `)
}

function pool(pool: Pool, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    if (pool.empty) {
        return wecco.html`<p class="center-align flow-text"><em>Empty pool</em></p>`
    }

    return wecco.html`
        <p class="center-align">
            ${pool.dice.map(d => removeDie(d, context))}
        </p>
        <p class="right-align">
            <a class="btn waves-effect waves-light m-r2 blue-grey lighten-1" @click=${() => context.emit(new EmptyPool())}>Empty Pool</a>
            <a class="btn waves-effect waves-light m-r2 light-blue darken-4" @click=${() => context.emit(new Roll())}>Roll Dice</a>
        </p>
    `
}

function result(result: NormalizedPoolResult, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return wecco.html`
    <div class="col s12 m12 l6">
        <h2>Result</h2>
        <div class="center-align">
            ${resultIcons(result)}
            ${resultText(result)}
        </div>
        <div class="right-align">
            ${isClipboardSupported() ? wecco.html`<a class=""btn waves-effect waves-light m-r2 blue-grey lighten-1" @click=${() => context.emit(new Copy())}><i class="material-icons">content_copy</i></a>` : ""}
            ${isSharingSupported() ? wecco.html`<a class=""btn waves-effect waves-light m-r2 blue-grey lighten-1" @click=${() => context.emit(new Share())}><i class="material-icons">share</i></a>` : ""}
        </div>
    </div>
    `
}

function resultText(result: NormalizedPoolResult): wecco.ElementUpdate {
    return wecco.html`<p class="flow-text">${result.format()}</p>`
}

function resultIcons(result: NormalizedPoolResult): wecco.ElementUpdate {
    const symbols: Array<wecco.ElementUpdate> = []

    const contributeIcons = (s: Symbol) => {
        for (let i = 0; i < (result[s] ?? 0); i++) {
            symbols.push(symbolIcon(s))
        }
    }

    contributeIcons(Symbol.Success)
    contributeIcons(Symbol.Advantage)
    contributeIcons(Symbol.Triumph)
    contributeIcons(Symbol.Failure)
    contributeIcons(Symbol.Threat)
    contributeIcons(Symbol.Despair)
    contributeIcons(Symbol.LightSide)
    contributeIcons(Symbol.DarkSide)

    return wecco.html`${symbols}`
}

function symbolIcon (s: Symbol): wecco.ElementUpdate {
    return wecco.html`<svg class="roll-icon" xmlns="http://www.w3.org/2000/svg"><use href="#icon-${s}" xmlns="http://www.w3.org/2000/svg"></use></svg>`
}


function removeDie(die: Die, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return dieButton(die.kind, "", new RemoveDie(die), context)
}

function addDie(die: DieKind, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return dieButton(die, "btn-small", new AddDie(die), context)
}

function dieButton(die: DieKind, additionalStyleClasses: string, msg: Message, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    const [styleClasses, label] = determineButtonStyle(die)
    return wecco.html`<button class="btn waves-effect waves-light m-r2 ${styleClasses} ${additionalStyleClasses}" @click=${() => context.emit(msg)}>${label}</button>`

}

function determineButtonStyle(die: DieKind): [string, string] {
    switch (die) {
        case DieKind.Ability:
            return ["green", "A"]
        case DieKind.Proficiency:
            return ["yellow black-text", "P"]
        case DieKind.Difficulty:
            return ["purple darken-3", "D"]
        case DieKind.Challange:
            return ["red", "C"]
        case DieKind.Boost:
            return ["blue lighten-2 black-text", "B"]
        case DieKind.Setback:
            return ["black", "S"]
        case DieKind.Force:
            return ["white black-text", "F"]
    }
}

function appShell(main: wecco.ElementUpdate): wecco.ElementUpdate {
    return wecco.html`
    <header>
        <nav>
            <div class="nav-wrapper blue-grey darken-4">
                <a class="brand-logo left" href="/">Dice Roller</a>
            </div>
        </nav>
    </header>
    <main>
        <div class="container">${main}</div>        
    </main>
    <footer class="page-footer blue-grey darken-2">
        <div class="container">
            <div class="row">
                <div class="col s12 m6">
                    <p>DiceRoller v${version}</p>
                    <p>Copyright (c) 2020 Alexander Metzner.</p>
                </div>
                <div class="col s12 m6 right">
                    <a href="https://bitbucket.org/halimath/diceroller/src/master/">bitbucket.org/halimath/diceroller</a>
                </div>
            </div>
        </div>
    </footer>
    `
}

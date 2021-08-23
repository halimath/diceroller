import * as wecco from "@weccoframework/core"
import { versionLabel as version } from "../../../package.json"
import { isClipboardSupported, isSharingSupported } from "../browser"
import { AddDie, AddDifficulty, Copy, EmptyPool, Message, PoolDowngrade, PoolUpgrade, RemoveDie, RemoveNumericResult, RollNumeric, RollPool, Share } from "../control"
import { Die, DieKind, Model, AggregatedPoolResult, Pool, DieSymbol, PoolResult, NumericDieKind, NumericDieResult, PoolModification, Difficulty } from "../models"

import { formatPoolResult } from "../utils"
import { m } from "../utils/i18n"
import { die, dice } from "./dice"

export function root(model: Model, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return appShell(wecco.html`
    
    <div class="columns">
        <div class="column is-half-desktop">
            ${pool(model.pool, context)}
            <hr />
            ${toolbar(context)}
            ${options(model.pool, context)}
        </div>
    
        ${model.poolResult ? result(model.poolResult, context) : ""}
    </div>
    
    <div class="columns">
        <div class="column is-half-desktop">
            <hr />
    
            ${numericResult(model.numericDieResult, context)}
    
            <div class="buttons">
                ${addNumericDie(NumericDieKind.D10, context)}
                ${addNumericDie(NumericDieKind.D100, context)}
            </div>
    
        </div>
    </div>

    `)
}

function options(pool: Pool, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return wecco.html`
        <div class="columns is-mobile">
            <div class="column is-one-third">
                <div class="columns">
                    <div class="column  has-text-centered">
                        ${upgrade(pool, context)}
                        
                    </div>
                    <div class="column has-text-centered">
                        ${downgrade(pool, context)}
                    </div>
                </div>
            </div>
            <div class="column is-two-thirds has-text-centered">
                ${difficulty(pool, context)}
            </div>    
        </div>
    `
}

function upgrade(pool: Pool, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return wecco.html`
        <p class="heading">${m("die.ability")}</p>
        <p class="buttons are-small is-centered">
            <button class="button is-rounded is-circle" @click=${()=> context.emit(new PoolUpgrade(PoolModification.Ability))}>
                <i class="material-icons">arrow_upward</i>
            </button>
            <button class="button is-rounded is-circle" @click=${()=> context.emit(new PoolDowngrade(PoolModification.Ability))}>
                <i class="material-icons">arrow_downward</i>
            </button>
        </p>
    `
}

function downgrade(pool: Pool, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return wecco.html`
        <p class="heading">${m("die.difficulty")}</p>
        <p class="buttons are-small is-centered">
            <button class="button is-rounded is-circle" @click=${()=> context.emit(new PoolUpgrade(PoolModification.Difficulty))}>
                <i class="material-icons">arrow_upward</i>
            </button>
            <button class="button is-rounded is-circle" @click=${()=> context.emit(new PoolDowngrade(PoolModification.Difficulty))}>
                <i class="material-icons">arrow_downward</i>
            </button>
        </p>
    `
}

function toolbar(context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return wecco.html`
    
        <p class="buttons is-centered">
            ${addDie(DieKind.Proficiency, context)}
            ${addDie(DieKind.Ability, context)}
            ${addDie(DieKind.Boost, context)}
            ${addDie(DieKind.Difficulty, context)}
            ${addDie(DieKind.Challange, context)}
            ${addDie(DieKind.Setback, context)}
            ${addDie(DieKind.Force, context)}
        </p>
        
        
    `
}

function pool(pool: Pool, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    let body: wecco.ElementUpdate


    if (pool.empty) {
        body = wecco.html`<p class="has-text-centered empty-pool-message pt-2 mb-4"><em>${m("pool.empty.t")}</em></p>`
    } else {
        body = wecco.html`
            <p class="buttons is-centered">
                ${pool.dice.map(d => removeDie(d, context))}
            </p>
        `
    }

    return wecco.html`        
        ${body}
        <p class="buttons is-right">

            <button class="button is-outlined is-primary" ?disabled=${pool.empty} @click=${() =>
                    context.emit(new
                    EmptyPool())}><i class="material-icons left">delete</i>${m("pool.emptyPool.t")}</button>
            <button class="button is-primary" ?disabled=${pool.empty} @click=${() =>
                context.emit(new RollPool())}>${m("pool.roll.t")}</button>
        </p>
    `
}

function difficulty(pool: Pool, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return wecco.html`
        <p class="heading">Probe</p>
        <div class="buttons are-small is-centered">
            ${addDifficulty(Difficulty.Easy, context)}
            ${addDifficulty(Difficulty.Average, context)}
            ${addDifficulty(Difficulty.Hard, context)}
            ${addDifficulty(Difficulty.Daunting, context)}
            ${addDifficulty(Difficulty.Formidable, context)}
        </div>

    `
}

function addDifficulty(difficulty: Difficulty, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return wecco.html`       
        <button class="button is-rounded is-difficulty is-outlined" @click=${()=> context.emit(new
            AddDifficulty(difficulty.level))}>

                    ${m(`difficulty.${difficulty.level}`)}            

        </button>
    `
}

function result(result: PoolResult, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    const normalizedResult = result.normalize()
    const aggregatedResult = result.aggregate()

    return wecco.html`
    <div class="column is-half-desktop">
        <p class="has-text-centered">
            ${resultIcons(normalizedResult)}
        </p>
        <p class="is-size-5 has-text-centered">
            ${formatPoolResult(normalizedResult)}
        </p>

        <div class="buttons is-right">
            ${isClipboardSupported() ? wecco.html`<a class="button is-primary" @click=${() => context.emit(new Copy())}><i
                    class="material-icons">content_copy</i></a>` : ""}
            ${isSharingSupported() ? wecco.html`<a class="button is-primary" @click=${() => context.emit(new Share())}><i
                    class="material-icons">share</i></a>` : ""}
        </div>
        <p class="has-text-centered">${m("result.details")}</p>
    
        <p class="has-text-centered aggregated-result">
            ${dice(result.dieResults)}
        </p>
        <p class="has-text-centered">
            ${formatPoolResult(aggregatedResult)}
        </p>
    </div>
    `
}

function numericResult(result: NumericDieResult | undefined, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return wecco.html`
    <p>
        <div class="box">
            ${result ? wecco.html`${result.value} <i class="remove-numeric-result material-icons" @click=${() =>
                context.emit(new
                RemoveNumericResult())}>delete</i>` : m("result.numeric.empty")}
    
    
        </div>
    </p>
    `
}

function resultText(result: AggregatedPoolResult): wecco.ElementUpdate {
    return wecco.html`<p class="is-size-5 has-text-centered"> ${formatPoolResult(result)} </p>`
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

export function symbolIcon(s: DieSymbol): wecco.ElementUpdate {
    return wecco.html`<svg class="roll-icon" xmlns="http://www.w3.org/2000/svg">
    <use href="#icon-${s}" xmlns="http://www.w3.org/2000/svg"></use>
</svg>`
}


function removeDie(die: Die, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return dieButton(die.kind, "", new RemoveDie(die), context)
}

function addDie(die: DieKind, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return dieButton(die, "is-small has-text-centered", new AddDie(die), context)
}

function dieButton(kind: DieKind, additionalStyleClasses: string, msg: Message, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    return wecco.html`
        <div class="die-button ${additionalStyleClasses}" @click=${() => context.emit(msg)}>
            ${die(kind, m(determineLabelKey(kind)))}
        </div>
    `
}

function addNumericDie(numericDieKind: NumericDieKind, context: wecco.AppContext<Message>): wecco.ElementUpdate {
    const [styleClasses, labelKey] = determineNumericStyle(numericDieKind)

    return wecco.html`<button class="button ${styleClasses}" @click=${() => context.emit(new
        RollNumeric(numericDieKind))}>${m(labelKey)}</button>`
}

function determineNumericStyle(numericDieKind: NumericDieKind): [string, string] {
    switch (numericDieKind) {
        case NumericDieKind.D10:
            return ["is-d-10", "die.d10"]
        case NumericDieKind.D100:
            return ["is-d-100", "die.d100"]
    }
}


function determineLabelKey(die: DieKind): string {
    switch (die) {
        case DieKind.Ability:
            return "die.ability.initial"
        case DieKind.Proficiency:
            return "die.proficiency.initial"
        case DieKind.Difficulty:
            return "die.difficulty.initial"
        case DieKind.Challange:
            return "die.challange.initial"
        case DieKind.Boost:
            return "die.boost.initial"
        case DieKind.Setback:
            return "die.setback.initial"
        case DieKind.Force:
            return "die.force.initial"
    }
}

function appShell(main: wecco.ElementUpdate): wecco.ElementUpdate {
    return wecco.html`
    
    <header>
        <nav class="navbar is-blue-grey" role="navigation" aria-label="main navigation">
            <div class="container">
                <div class="navbar-brand is-justify-content-space-between">
                    <a class="navbar-item" href="/">
                        <h1 class="is-size-2 has-text-white">Dice Roller</h1>
                    </a>
                    <a class="navbar-item navbar-github-icon" href="https://github.com/halimath/diceroller/">
                        <img src="/img/github.png" height="48" alt="github.com/halimath/diceroller">
                    </a>
                </div>
            </div>
        </nav>
    </header>
    <main class="section">
        <div class="container">
            ${main}
        </div>
    </main>
    <footer class="footer is-dark">
        <div class="container">
            <p>DiceRoller v${version}</p>
            <p>Copyright (c) 2020, 2021 Alexander Metzner, Christoph Neumann.</p>
        </div>
    </footer>
    `
}

import * as wecco from "@wecco/core"
import { Die, DieKind, DieResult, DieSymbol } from "../models"


export function die(kind: DieKind, content: Array<DieSymbol> | string): wecco.ElementUpdate {
    return wecco.html`   
        <svg class="die die-${kind}" xmlns="http://www.w3.org/2000/svg">
            ${dieShape(kind)}
            <g>
                ${Array.isArray(content) ? content.map(symbol => faceSymbol(symbol)) : 
                    faceText(content)}
            </g>
        </svg>
    `
}

export function dice(diceResult: Array<DieResult>): wecco.ElementUpdate {
    return wecco.html`${diceResult.map(result => die(result.kind, result.symbols))}`
}

export function dieShape(kind: DieKind): wecco.ElementUpdate {
    return wecco.html`
        <svg class="shape shape-${kind}" xmlns="http://www.w3.org/2000/svg">
            <use href="#die-${kind}"></use>
        </svg>
    `
}

export function faceSymbol(s: DieSymbol): wecco.ElementUpdate {
    return wecco.html`
    <svg class="symbol" xmlns="http://www.w3.org/2000/svg">
        <use href="#icon-${s}" />
    </svg>
    `
}

export function faceText(text: string): wecco.ElementUpdate {
    return wecco.html`
        <svg class="text">
            <text x="50%" y="50%"  text-anchor="middle" dominant-baseline="middle" alignment-baseline="central">${text}</text>
        </svg>
    `
}

export function allDiceDemo(): wecco.ElementUpdate {
    return wecco.html`
        <div class="box">
            <p>
                ${Die.Proficiency.sides.map(s => die(DieKind.Proficiency, s === null ? [] : Array.isArray(s) ? s : [s]))}
            </p>
            <p>
                ${Die.Ability.sides.map(s => die(DieKind.Ability, s === null ? [] : Array.isArray(s) ? s : [s]))}
            </p>
            <p>
                ${Die.Boost.sides.map(s => die(DieKind.Boost, s === null ? [] : Array.isArray(s) ? s : [s]))}
            </p>
            <p>
                ${Die.Challange.sides.map(s => die(DieKind.Challange, s === null ? [] : Array.isArray(s) ? s : [s]))}
            </p>
            <p>
                ${Die.Difficulty.sides.map(s => die(DieKind.Difficulty, s === null ? [] : Array.isArray(s) ? s : [s]))}
            </p>
            <p>
                ${Die.Setback.sides.map(s => die(DieKind.Setback, s === null ? [] : Array.isArray(s) ? s : [s]))}
            </p>
        </div>
    `
}

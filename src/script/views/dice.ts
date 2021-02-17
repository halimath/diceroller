import * as wecco from "@wecco/core"
import { DieKind, DieResult, DieSymbol } from "../models"


export function die(kind: DieKind, symbols: Array<DieSymbol>): wecco.ElementUpdate {

    return wecco.html`   
        <svg class="die die-${kind}" xmlns="http://www.w3.org/2000/svg">
            ${dieShape(kind)}
            <g class="symbols">
                ${symbols.map(symbol => faceSymbol(symbol))}
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
    return wecco.html`<svg class="symbol" xmlns="http://www.w3.org/2000/svg">
    <use href="#icon-${s}" class="format" />
</svg>`
}



/// </// <reference path="./materialize.d.ts" />

import { toast } from "bulma-toast"


export function isSharingSupported(): boolean {
    return typeof (navigator.share) === "function"
}

export async function shareText(text: string): Promise<void> {
    if (!isSharingSupported) {
        return Promise.reject("sharing is not supported")
    }

    return navigator.share({
        text: text,
    })
}

export function isClipboardSupported(): boolean {
    return typeof (navigator.clipboard) !== "undefined"
}

export function copyTextToClipboard(text: string): Promise<void> {
    if (!isSharingSupported) {
        return Promise.reject("clipboard not supported")
    }
    return navigator.clipboard.writeText(text)
}

export function notify(message: string): void {
    toast({
        message, type: "is-dark",
        "duration": 4000,

    })
}

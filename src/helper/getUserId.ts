import { SessionStorageKey } from "./sessionStorageKey"

export const getUserId = () => {
    return window.sessionStorage.getItem(
        SessionStorageKey.USER_ID
    )
}

export const setUserId = (userId: string) => {
    window.sessionStorage.setItem(
        SessionStorageKey.USER_ID,
        userId
    )
}
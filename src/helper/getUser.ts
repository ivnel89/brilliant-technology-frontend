import { User } from "../api/contract"
import { SessionStorageKey } from "./sessionStorageKey"

export const getUser = (): User => {
    return JSON.parse(window.sessionStorage.getItem(
        SessionStorageKey.USER
    ))
}

export const setUser = (user: User) => {
    window.sessionStorage.setItem(
        SessionStorageKey.USER,
        JSON.stringify(user)
    )
}
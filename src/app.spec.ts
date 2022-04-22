import { add } from "./app"

describe('add', () => {
    it("should add", () => {
        expect(add(3,4)).toBe(7)
        console.log("Hello test")
    })
})
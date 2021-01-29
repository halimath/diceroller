import { expect } from "chai"

import { Die, DieResult, Pool, PoolResult, DieSymbol } from "../../src/script/models"

describe("Models", () => {
    describe("Die", () => {
        describe("roll", () => {
            it("should return DieResult", () => {
                const result = Die.Ability.roll()
                expect(result).to.be.instanceOf(DieResult)
            })
        })
    })

    describe("Pool", () => {
        describe("roll", () => {
            it("should roll all dice", () => {
                const pool = new Pool([Die.Ability, Die.Ability, Die.Difficulty])
                const result = pool.roll()
                expect(result.dieResults.length).to.equal(3)
            })
        })
    })

    describe("PoolResult", () => {
        describe("normalize", () => {
            it("should normalized success and failure", () => {
                const r = new PoolResult([
                    new DieResult([DieSymbol.Success, DieSymbol.Success]),
                    new DieResult([DieSymbol.Failure]),
                ])

                expect(r.normalize()).to.deep.equal({
                    "advantage": 0,
                    "darkside": 0,
                    "despair": 0,
                    "failure": 0,
                    "lightside": 0,
                    "success": 1,
                    "threat": 0,
                    "triumph": 0,
                })
            })

            it("should normalized failure and success", () => {
                const r = new PoolResult([
                    new DieResult([DieSymbol.Failure, DieSymbol.Failure]),
                    new DieResult([DieSymbol.Success]),
                ])

                expect(r.normalize()).to.deep.equal({
                    "advantage": 0,
                    "darkside": 0,
                    "despair": 0,
                    "failure": 1,
                    "lightside": 0,
                    "success": 0,
                    "threat": 0,
                    "triumph": 0,
                })
            })

            it("should normalized advantage and threat", () => {
                const r = new PoolResult([
                    new DieResult([DieSymbol.Advantage, DieSymbol.Advantage]),
                    new DieResult([DieSymbol.Threat]),
                ])

                expect(r.normalize()).to.deep.equal({
                    "advantage": 1,
                    "darkside": 0,
                    "despair": 0,
                    "failure": 0,
                    "lightside": 0,
                    "success": 0,
                    "threat": 0,
                    "triumph": 0,
                })
            })

            it("should normalized threat and advantage", () => {
                const r = new PoolResult([
                    new DieResult([DieSymbol.Threat, DieSymbol.Threat]),
                    new DieResult([DieSymbol.Advantage]),
                ])

                expect(r.normalize()).to.deep.equal({
                    "advantage": 0,
                    "darkside": 0,
                    "despair": 0,
                    "failure": 0,
                    "lightside": 0,
                    "success": 0,
                    "threat": 1,
                    "triumph": 0,
                })
            })

            it("should normalized triumph", () => {
                const r = new PoolResult([
                    new DieResult([DieSymbol.Success, DieSymbol.Triumph]),
                    new DieResult([DieSymbol.Failure]),
                ])

                expect(r.normalize()).to.deep.equal({

                    "advantage": 0,
                    "darkside": 0,
                    "despair": 0,
                    "failure": 0,
                    "lightside": 0,
                    "success": 1,
                    "threat": 0,
                    "triumph": 1,
                })
            })

            it("should normalized despair", () => {
                const r = new PoolResult([
                    new DieResult([DieSymbol.Failure, DieSymbol.Despair]),
                    new DieResult([DieSymbol.Success]),
                ])

                expect(r.normalize()).to.deep.equal({
                    "advantage": 0,
                    "darkside": 0,
                    "despair": 1,
                    "failure": 1,
                    "lightside": 0,
                    "success": 0,
                    "threat": 0,
                    "triumph": 0,
                })
            })
        })
    })
})
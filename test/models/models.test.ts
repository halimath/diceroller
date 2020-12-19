import {expect} from "chai"

import {Die, DieResult, Pool, PoolResult, Symbol} from "../../src/models"

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
                    new DieResult([Symbol.Success, Symbol.Success]),
                    new DieResult([Symbol.Failure]),
                ])

                expect(r.normalize()).to.deep.equal({
                    "success": 1,
                })
            })

            it("should normalized failure and success", () => {
                const r = new PoolResult([
                    new DieResult([Symbol.Failure, Symbol.Failure]),
                    new DieResult([Symbol.Success]),
                ])

                expect(r.normalize()).to.deep.equal({
                    "failure": 1,
                })
            })

            it("should normalized advantage and threat", () => {
                const r = new PoolResult([
                    new DieResult([Symbol.Advantage, Symbol.Advantage]),
                    new DieResult([Symbol.Threat]),
                ])

                expect(r.normalize()).to.deep.equal({
                    "advantage": 1,
                })
            })

            it("should normalized threat and advantage", () => {
                const r = new PoolResult([
                    new DieResult([Symbol.Threat, Symbol.Threat]),
                    new DieResult([Symbol.Advantage]),
                ])

                expect(r.normalize()).to.deep.equal({
                    "threat": 1,
                })
            })

            it("should normalized triumph", () => {
                const r = new PoolResult([
                    new DieResult([Symbol.Success, Symbol.Triumph]),
                    new DieResult([Symbol.Failure]),
                ])

                expect(r.normalize()).to.deep.equal({
                    "success": 1,
                    "triumph": 1,
                })
            })            

            it("should normalized despair", () => {
                const r = new PoolResult([
                    new DieResult([Symbol.Failure, Symbol.Despair]),
                    new DieResult([Symbol.Success]),
                ])

                expect(r.normalize()).to.deep.equal({
                    "failure": 1,
                    "despair": 1,
                })
            })            
        })
    })
})
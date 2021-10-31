import { expect } from "chai"

import { Die, DieResult, Pool, PoolResult, DieSymbol, DieKind } from "../../src/script/models"

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
        describe("addDie", () => {
            it("should add die to pool", () => {
                const pool = new Pool([]).addDie(Die.Ability)
                expect(pool.dice).to.deep.equal([Die.Ability])
            })
            it("should be sorted", () => {
                const pool = new Pool([])
                    .addDie(Die.Force)
                    .addDie(Die.Setback)
                    .addDie(Die.Difficulty)
                    .addDie(Die.Challange)
                    .addDie(Die.Boost)
                    .addDie(Die.Ability)
                    .addDie(Die.Proficiency)
                expect(pool.dice).to.deep.equal([
                    Die.Proficiency,
                    Die.Ability,
                    Die.Boost,
                    Die.Challange,
                    Die.Difficulty,
                    Die.Setback,
                    Die.Force
                ])
            })
        })
        describe("sort", () => {
            it("should sorted in custom order", () => {
                const pool = new Pool([Die.Proficiency, Die.Challange]).sort([DieKind.Challange, DieKind.Proficiency])
                expect(pool.dice).to.deep.equal([Die.Challange, Die.Proficiency])
            })
        })
    })

    describe("PoolResult", () => {
        describe("normalize", () => {
            it("should normalized success and failure", () => {
                const r = new PoolResult([
                    new DieResult(DieKind.Ability, [DieSymbol.Success, DieSymbol.Success]),
                    new DieResult(DieKind.Difficulty, [DieSymbol.Failure]),
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
                    new DieResult(DieKind.Ability, [DieSymbol.Failure, DieSymbol.Failure]),
                    new DieResult(DieKind.Difficulty, [DieSymbol.Success]),
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
                    new DieResult(DieKind.Ability, [DieSymbol.Advantage, DieSymbol.Advantage]),
                    new DieResult(DieKind.Difficulty, [DieSymbol.Threat]),
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
                    new DieResult(DieKind.Ability, [DieSymbol.Threat, DieSymbol.Threat]),
                    new DieResult(DieKind.Difficulty, [DieSymbol.Advantage]),
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
                    new DieResult(DieKind.Proficiency, [DieSymbol.Success, DieSymbol.Triumph]),
                    new DieResult(DieKind.Difficulty, [DieSymbol.Failure]),
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
                    new DieResult(DieKind.Challange, [DieSymbol.Failure, DieSymbol.Despair]),
                    new DieResult(DieKind.Ability, [DieSymbol.Success]),
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
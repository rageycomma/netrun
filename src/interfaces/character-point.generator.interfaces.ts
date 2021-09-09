import { Cyberpunk20202ndEdStatisticType } from "src/app/lib/enums/character.enums";
import { IRollResult } from "./Roll.interfaces";

/**
 * The generation parameters for making character points.
 *
 * @export
 * @interface ICharacterPointGenerationParameters
 */
export interface ICharacterPointGenerationParameters {
    statisticCategories: Array<string>;
    derivedStatisticCategories: Array<string>;
    runCategoryName: string;
    leapCategoryName: string;
    movementAllowanceCategoryName: string;
    defaultRollSide: number;
    defaultRollNumber: number;
    fastExcludeRollsBelow?: number;
    runMultiplier: number;
    leapDivisor: number;
}

/**
 * The result of the character generation.
 *
 * @export
 * @interface ICharacterPointGeneratorResult
 */
export interface ICharacterPointGeneratorResult {
    /**
     * The results which were achieved when trying to reach this outcome.s
     *
     * @type {Array<IRollResult>}
     * @memberof ICharacterPointGeneratorResult
     */
    rollResults: Array<IRollResult>;

    /**
     * The items which were assigned.
     *
     * @type {ICharacterPointGeneratorResultItems}
     * @memberof ICharacterPointGeneratorResult
     */
    assignedItems: { [key: string]: number };

    /**
     * The total number of character points.
     *
     * @type {number}
     * @memberof ICharacterPointGeneratorResult
     */
    totalCharacterPoints: number;
}
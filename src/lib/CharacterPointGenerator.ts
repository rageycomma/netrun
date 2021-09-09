import Roll from "roll";
import { CyberpunkCharacterPointGenerationType } from "../enums/CharacterPointGenerator.enums";
import { ICharacterPointGenerationParameters, ICharacterPointGeneratorResult } from "../interfaces/character-point.generator.interfaces";
import { IRollResult } from "../interfaces/Roll.interfaces";

export class CharacterPointGenerator {
    /**
     * Generates the character points for a given 
     *
     * @param {CyberpunkCharacterPointGenerationType} pointGenerationType
     * @memberof CharacterPointGenerator
     */
    public generateCharacterPoints(
        pointGenerationType: CyberpunkCharacterPointGenerationType,
        params: ICharacterPointGenerationParameters,
    ) {
        if (pointGenerationType === CyberpunkCharacterPointGenerationType.Fast) {
            return this.generateFast(params);
        } else if (pointGenerationType === CyberpunkCharacterPointGenerationType.Random) {
            return this.generateRandom(params);
        } else {
            // Unsupported generation type.
            throw new Error();
        }
    }

    /**
     * Generates a result for a roll.
     *
     * @protected
     * @param {number} sides
     * @param {number} quantity
     * @return {*}  {IRollResult}
     * @memberof CharacterPointGenerator
     */
    protected generateRollResult(
        sides: number,
        quantity: number,
        excludeRollsBelow?: number | undefined,
    ): IRollResult {

        const transformations: Array<any> = [];

        // If we want to exclude rolls below a figure, we need transform.
        if (excludeRollsBelow !== undefined) {
            transformations.push(
                (results: any) => 
                    results.filter((result: any) => result > excludeRollsBelow), 
            );
        }

        let isAboveResult: boolean = false;

        let finalResult: number;

        // 
        while(!isAboveResult) {
            // roll the result. 
            const roll: any = this.RollInstance.roll({
                sides,
                quantity,
                transformations,
            });

            isAboveResult = roll.result.length > 0; 

            if(isAboveResult) {
                finalResult = roll.result[0];
            }
        }

        return {
            sides,
            quantity,
            result: finalResult,
        };
    }


    /**
     * Generates a random roll.
     *
     * @protected
     * @param {Array<string>} statisticCategories
     * @param {number} rollSides
     * @param {number} rollNumber
     * @return {*}  {ICharacterPointGeneratorResult}
     * @memberof CharacterPointGenerator
     */
    protected generateRandom(
        {
            defaultRollNumber,
            defaultRollSide,
            statisticCategories,
            derivedStatisticCategories,
        }: ICharacterPointGenerationParameters,
    ): ICharacterPointGeneratorResult {

        const allRollResults: Array<IRollResult> = Array(
            statisticCategories.length + derivedStatisticCategories.length,
        ).fill(0).map(() => this.generateRollResult(
            defaultRollSide,
            defaultRollNumber,
        ));

        const totalCharacterPoints: number = this.getTotalPointsFromResults(allRollResults);

        return {
            rollResults: allRollResults,
            assignedItems: {},
            totalCharacterPoints,
        };
    }

    /**
     * Generates with exclusion below a value (usually 2)
     * Cyberpunk 2020, p25. "Getting Cyberpunk"
     * 
     *
     * @protected
     * @param {Array<string>} statisticCategories
     * @return {*}  {ICharacterPointGeneratorResult}
     * @memberof CharacterPointGenerator
     */
    protected generateFast(
        {
            defaultRollNumber,
            defaultRollSide,
            statisticCategories,
            fastExcludeRollsBelow,
            leapCategoryName,
            runCategoryName,
            runMultiplier,
            movementAllowanceCategoryName,
            leapDivisor,
        }: ICharacterPointGenerationParameters,
    ): ICharacterPointGeneratorResult {
            const fastGeneratedBase: Partial<ICharacterPointGeneratorResult> = statisticCategories.reduce((
                iter: Partial<ICharacterPointGeneratorResult>,
                n: string,
            ) => {
                // Generate the result.
                const roll: IRollResult = this.generateRollResult(
                    defaultRollSide,
                    defaultRollNumber,
                    fastExcludeRollsBelow,
                );

                iter.rollResults.push(roll);
                iter.assignedItems[n] = roll.result;
                return iter;
            }, {
                rollResults: [],
                assignedItems: {},
            });

            const totalCharacterPoints: number = this.getTotalPointsFromResults(fastGeneratedBase.rollResults);

            const remainingResults: { [key: string]: number} = this.generateFastDerivedPoints(
                fastGeneratedBase.assignedItems,
                movementAllowanceCategoryName,
                leapCategoryName,
                runCategoryName,
                runMultiplier,
                leapDivisor
            );

            fastGeneratedBase.assignedItems = {
                ...fastGeneratedBase.assignedItems,
                ...remainingResults,
            };

            return {
                ...fastGeneratedBase as ICharacterPointGeneratorResult,
                totalCharacterPoints,
            };
    }

    /**
     * Generates points which are derives from MA.
     *
     * @protected
     * @param {{ [key: string]: number}} generatedPoints
     * @param {string} movementAllowanceCategoryName
     * @param {string} leapCategoryName
     * @param {string} runCategoryName
     * @param {number} runMultiplier
     * @param {number} leapDivisor
     * @return {*}  {{ [key: string]: number }}
     * @memberof CharacterPointGenerator
     */
    protected generateFastDerivedPoints(
        generatedPoints: { [key: string]: number},
        movementAllowanceCategoryName: string,
        leapCategoryName: string,
        runCategoryName: string,
        runMultiplier: number,
        leapDivisor: number,
    ): { [key: string]: number } {

        // Get the movement allowance value.s
        const movementAllowance: number = generatedPoints[movementAllowanceCategoryName];

        const result: { [key: string]: number } = {};
        const runPoints: number = this.generateRunPoints(
            movementAllowance,
            runMultiplier,
        );
        result[runCategoryName] = runPoints;
        result[leapCategoryName] = this.generateLeapPoints(
            runPoints,
            leapDivisor,
        );
        return result;
    }
    /**
     * Generates the RUN points.
     *
     * @protected
     * @param {number} movementAllowanceAmount
     * @param {number} runMultiplier
     * @return {*}  {number}
     * @memberof CharacterPointGenerator
     */
    protected generateRunPoints(
        movementAllowanceAmount: number,
        runMultiplier: number,
    ): number {
        return movementAllowanceAmount * runMultiplier;
    }

    /**
     * Generates out the LEAP points.
     *
     * @protected
     * @param {number} runValue
     * @param {number} leapDivisor
     * @return {*}  {number}
     * @memberof CharacterPointGenerator
     */
    protected generateLeapPoints(
        runValue: number,
        leapDivisor: number
    ): number {
        return Math.floor(
            (runValue / leapDivisor),
        );
    }


    /**
     * Gets the total number of points.
     *
     * @protected
     * @param {Array<IRollResult>} results
     * @return {*}  {number}
     * @memberof CharacterPointGenerator
     */
    protected getTotalPointsFromResults(results: Array<IRollResult>): number {
        return results.reduce((
            iter: number,
            roll: IRollResult,
        ) => iter + roll.result, 0)
    }

    /**
     * Creates an instance of CharacterPointGenerator.
     * @param {Roll} RollInstance
     * @memberof CharacterPointGenerator
     */
    constructor(
        protected readonly RollInstance: Roll,
    ) {}
}

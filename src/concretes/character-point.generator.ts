import { CyberpunkCharacterPointGenerationType } from "src/app/lib/enums/character-point.generator.enums";
import { ICharacterPointGenerationParameters, ICharacterPointGeneratorResult } from "src/app/lib/interfaces/character-point.generator.interfaces";
import Roll from "roll";
import { IRollResult } from "src/app/lib/interfaces/Roll.interfaces";

export class CharacterPointGenerator {
    /**
     * Generates the character points for a given 
     *
     * @param {CyberpunkCharacterPointGenerationType} pointGenerationType
     * @memberof CharacterPointGenerator
     */
    public generateCharacterPoints(
        pointGenerationType: CyberpunkCharacterPointGenerationType,
        {
            defaultRollNumber,
            defaultRollSide,
            fastExcludeRollsBelow,
            statisticCategories,
        }: ICharacterPointGenerationParameters,
    ) {
        if (pointGenerationType === CyberpunkCharacterPointGenerationType.Fast) {
            return this.generateFast(
                statisticCategories,
                defaultRollSide,
                defaultRollNumber,
                fastExcludeRollsBelow,
            );
        } else if (pointGenerationType === CyberpunkCharacterPointGenerationType.Random) {
            return this.generateRandom(
                statisticCategories,
                defaultRollSide,
                defaultRollNumber,
            );
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
                    results.filter((result: any) => result < excludeRollsBelow), 
            );
        }

        // roll the result. 
        const roll: { result: number} = this.RollInstance.roll({
            sides,
            quantity,
            transformations,
        });

        return {
            sides,
            quantity,
            result: roll.result,
        }
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
        statisticCategories: Array<string>,
        rollSides: number,
        rollNumber: number,
    ): ICharacterPointGeneratorResult {
        return statisticCategories.reduce((
            iter: ICharacterPointGeneratorResult,
            n: string
        ) => { 
            const roll: IRollResult = this.generateRollResult(
                rollSides,
                rollNumber,
            );

            iter.rollResults.push(roll);
            iter.assignedItems[n] = roll.result;
            return iter;
        }, {
            rollResults: [],
            assignedItems: {},
        })
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
        statisticCategories: Array<string>,
        rollSides: number,
        rollNumber: number,
        excludeRollsBelow?: number,
    ): ICharacterPointGeneratorResult {
        
            return statisticCategories.reduce((
                iter: ICharacterPointGeneratorResult,
                n: string,
            ) => {
                // Generate the result.
                const roll: IRollResult = this.generateRollResult(
                    rollSides,
                    rollNumber,
                    excludeRollsBelow,
                );

                iter.rollResults.push(roll);
                iter.assignedItems[n] = roll.result;
                return iter;
            }, {
                rollResults: [],
                assignedItems: {},
            });
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

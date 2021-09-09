import { CyberpunkCharacterPointGenerationType } from "../src/enums/CharacterPointGenerator.enums";
import { CharacterPointGenerator } from "../src/lib/CharacterPointGenerator";
import {
    Cyberpunk20202ndEdCharacterEnums,
} from "../src/enums/Character.enums";
import Roll from "roll";
import { IRollResult } from "../src/interfaces/Roll.interfaces";
import { ICharacterPointGenerationParameters, ICharacterPointGeneratorResult } from "../src/interfaces/character-point.generator.interfaces";

const { 
    Cyberpunk20202ndEdStatisticType,
    Cyberpunk20202ndEdStatisticDerivedType,
} = Cyberpunk20202ndEdCharacterEnums;

describe("Character Point Generator - Cyberpunk 2020 2nd Ed.", () => {
    let fullyIntegratedGenerator: CharacterPointGenerator;
    let rollInstanceMock: any;
    let rollInstanceBelowTwo: any;
    let rollMock: jest.Mock;
    let cyberPunk20202ndEdParams: ICharacterPointGenerationParameters;
    beforeEach(() => {
        cyberPunk20202ndEdParams = {
            defaultRollNumber: 1,
            defaultRollSide: 10,
            fastExcludeRollsBelow: 2,
            statisticCategories: Object.values(Cyberpunk20202ndEdStatisticType),
            derivedStatisticCategories: Object.values(Cyberpunk20202ndEdStatisticDerivedType),
            runCategoryName: Cyberpunk20202ndEdStatisticDerivedType.Run,
            leapCategoryName: Cyberpunk20202ndEdStatisticDerivedType.Leap,
            movementAllowanceCategoryName: Cyberpunk20202ndEdStatisticType.MovementAllowance,
            runMultiplier: 3,
            leapDivisor: 4,
        };
        rollMock = jest.fn();
        rollInstanceMock = {
            roll: rollMock,
        }
        fullyIntegratedGenerator = new CharacterPointGenerator(
            new Roll(),
        );
    })

    it("p. 25 - Character Points - (2) 'Fast' - Roll 1D10 for each stat, re-rolling rolls of 2 or less.", () => {
        const points: ICharacterPointGeneratorResult = fullyIntegratedGenerator.generateCharacterPoints(
            CyberpunkCharacterPointGenerationType.Fast,
            cyberPunk20202ndEdParams,
        );

        const resultItems: Array<number> = Object.values(points.assignedItems);
        const rollItems: Array<number> = points.rollResults.map((item: IRollResult) => {
            return item.result;
        });

        expect(resultItems).not.toEqual(expect.arrayContaining([1,2]));
        expect(rollItems).not.toEqual(expect.arrayContaining([1,2]));
        expect(rollItems).not.toEqual(rollItems.every((item: number) => item < 10));
    });

    it("p. 26 - Statistics - RUN - Multiply MA by 3 ", () => {
        const points: ICharacterPointGeneratorResult = fullyIntegratedGenerator.generateCharacterPoints(
            CyberpunkCharacterPointGenerationType.Fast,
            cyberPunk20202ndEdParams,
        );

        const movementAllowance: number = points.assignedItems[Cyberpunk20202ndEdStatisticType.MovementAllowance];
        const run: number = points.assignedItems[Cyberpunk20202ndEdStatisticDerivedType.Run];
        expect(run).toEqual(3*movementAllowance);
    });
    it("p. 26 - Statistics - LEAP - Divide RUN by 4", () => {
        const points: ICharacterPointGeneratorResult = fullyIntegratedGenerator.generateCharacterPoints(
            CyberpunkCharacterPointGenerationType.Fast,
            cyberPunk20202ndEdParams,
        );

        const movementAllowance: number = points.assignedItems[Cyberpunk20202ndEdStatisticType.MovementAllowance];
        const run: number = points.assignedItems[Cyberpunk20202ndEdStatisticDerivedType.Run];
        const leap: number = points.assignedItems[Cyberpunk20202ndEdStatisticDerivedType.Leap];
        expect(leap).toEqual(Math.floor(run/4));
    });
})
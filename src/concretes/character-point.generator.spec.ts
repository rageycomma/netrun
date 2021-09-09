import { CyberpunkCharacterPointGenerationType } from "../enums/character-point.generator.enums";
import { Cyberpunk20202ndEdStatisticType } from "../enums/character.enums";
import { ICharacterPointGeneratorResult } from "../interfaces/character-point.generator.interfaces";
import { CharacterPointGenerator } from "./character-point.generator";


describe("Point Generator - Cyberpunk 2020 - 2nd Edition - Compliance Tests", () => {
    let successRollInstance: any;

    beforeAll(() => {
        successRollInstance = {
            roll: () => ({
                result: 1,
            }),
        }
    })

    it("Should correctly generate out a 'fast' generation of character points", () => {
        const generator: CharacterPointGenerator = new CharacterPointGenerator(
            successRollInstance,
        );

        const result: ICharacterPointGeneratorResult = generator.generateCharacterPoints(
            CyberpunkCharacterPointGenerationType.Fast,
            {
                defaultRollNumber: 10,
                defaultRollSide: 1,
                statisticCategories: Object.values(Cyberpunk20202ndEdStatisticType),
            },
        );

    });
});
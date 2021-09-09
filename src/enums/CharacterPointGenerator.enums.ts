/**
 * The type of point generation used for generating a character.
 *
 * @export
 * @enum {number}
 */
export enum CyberpunkCharacterPointGenerationType {
    Unknown = -1,
    Random,
    Fast,
}

/**
 * Types used for assignment of character points in "cinematic" type.
 *
 * @export
 * @enum {number}
 */
export enum CyberpunkCharacterPointCinematicType {
    MajorHero,
    MajorSupportingChar,
    MinorHero,
    MinorSupportingChar,
    Average,
}
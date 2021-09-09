/**
 * The type of the character statistic.
 *
 * @export
 * @enum {number}
 */
 export enum Cyberpunk20202ndEdStatisticType {
    Intelligence = "Intelligence",
    Reflexes = "Reflexes",
    Cool = "Cool",
    TechnicalAbility = "TechnicalAbility",
    Luck = "Luck",
    MovementAllowance = "MovementAllowance",
    Empathy = "Empathy",
}

/**
 * Statistics that derive from other statistics.
 *
 * @export
 * @enum {number}
 */
export enum Cyberpunk20202ndEdStatisticDerivedType {
    Run = "Run",
    Leap = "Leap",
}

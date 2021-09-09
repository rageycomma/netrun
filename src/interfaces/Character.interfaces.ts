
/**
 * A character role (i.e. Media, Rocker, etc.)
 *
 * @export
 * @interface ICharacterRole
 */
export interface ICharacterRole {
    /**
     * The name of the role.
     *
     * @type {string}
     * @memberof ICharacterRole
     */
    roleName: string;
}

/**
 * A character made with a character sheet.
 *
 * @export
 * @interface ICharacter
 */
export interface ICharacter<TRoleType> {
    /**
     * The name of the character.
     *
     * @type {string}
     * @memberof ICharacter
     */
    handle: string;

    /**
     * The role that the user maintains.
     *
     * @type {TRoleType}
     * @memberof ICharacter
     */
    role: TRoleType;
}
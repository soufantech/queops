/**
 * Union type of every property in a type.
 */
export type PropUnion<T> = T[keyof T];

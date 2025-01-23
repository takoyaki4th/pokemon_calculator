export type IntRange<
  N extends number,
  Result extends number = never, 
  C extends never[] = [], 
> = C['length'] extends N
  ? Result
  : IntRange<N, Result | C['length'], [...C, never]>;
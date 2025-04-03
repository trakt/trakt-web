export type InputWithStatus<TInput, TStatus> = TInput extends
  readonly [...infer U] ? { [K in keyof U]: U[K] & { status: TStatus } }
  : TInput & { status: TStatus };

export type RequestResponse<TInput> = InputWithStatus<TInput, number>;
export type SuccessResponse<TInput> = InputWithStatus<TInput, 200>;

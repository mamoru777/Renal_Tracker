interface UninitializedUserCtx {
  userId: undefined;
  initialized: false;
}
export interface InitializedUserCtx {
  userId: string | undefined;
  initialized: true;
}

export type UserCtx = UninitializedUserCtx | InitializedUserCtx;

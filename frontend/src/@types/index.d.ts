declare type Tokens = {
  accessToken: string;
  refreshToken: string;
};

declare type ServiceRequest<Rq = unknown, Rs = unknown> = {
  onSuccess?: (res: { data: Rs }) => void;
  signal?: AbortSignal;
} & ServiceRequestWithData<Rq>;

type ServiceRequestWithData<Rq = unknown> = Rq extends undefined
  ? { data?: never }
  : { data: Rq };

declare interface ActionCtx {
  signal?: AbortSignal;
}

type FilterParams =
  | "all"
  | "epochs"
  | "blocks"
  | "txs"
  | "tokens"
  | "stakes"
  | "addresses"
  | "delegations/pool-detail-header";

interface SearchParams {
  filter?: FilterParams;
  search?: string;
}

type NETWORKS = import("../commons/utils/constants").NETWORKS;

type ACCOUNT_ERROR = import("../commons/utils/constants").ACCOUNT_ERROR;

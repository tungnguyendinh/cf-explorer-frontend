import { Wallet } from "../../types/user";
import { EternlIcon, FlintIcon, NamiIcon, YoroiIcon } from "../resources";
import StorageUtils from "./storage";

export const STORAGE_KEYS = {
  THEME: "dark",
  USER_INFO: "user_info",
  NETWORK: "network",
};

export const SUPPORTED_WALLETS: Wallet[] = [
  { name: "Flint", icon: FlintIcon },
  { name: "Nami", icon: NamiIcon },
  { name: "Eternl", icon: EternlIcon },
  { name: "Yoroi", icon: YoroiIcon },
];

export enum EPOCH_STATUS {
  FINISHED = "Finished",
  REWARDING = "Rewarding",
  IN_PROGRESS = "In Progress",
}

export const MAX_SLOT_EPOCH = 432000;

export enum NETWORKS {
  mainnet = "mainnet",
  preprod = "preprod",
  preview = "preview",
  testnet = "testnet",
}

export enum NETWORK_NAMES {
  mainnet = "Mainnet",
  preprod = "Preprod",
  preview = "Preview",
  testnet = "Testnet",
}

export enum NETWORK_TYPES {
  mainnet = "MAIN_NET",
  preprod = "PRE_PROD",
  preview = "PREVIEW",
  testnet = "TEST_NET",
}

export const NETWORK: NETWORKS = StorageUtils.getNetwork();

export enum TRANSACTION_STATUS {
  SUCCESS = "SUCCESS",
  PENDDING = "PENDDING",
}
export enum CONFIRMATION_STATUS {
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  HIGH = "HIGH",
}

export enum STAKE_KEY_STATUS {
  ACTIVE = "ACTIVE",
  DEACTIVATED = "DEACTIVATED",
}

export const DEFAULT_URL = process.env.REACT_APP_API_URL;

export const TESTNET_API_URL = process.env.REACT_APP_TESTNET_API_URL;
export const PREVIEW_API_URL = process.env.REACT_APP_PREVIEW_API_URL;
export const PREPROD_API_URL = process.env.REACT_APP_PREPROD_API_URL;
export const MAINNET_API_URL = process.env.REACT_APP_MAINNET_API_URL;

export const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL;
export const COINGECKO_URL = "https://api.coingecko.com/api/v3/";

export const getApiUrl = () => {
  switch (NETWORK) {
    case NETWORKS.mainnet:
      return MAINNET_API_URL;
    case NETWORKS.preprod:
      return PREPROD_API_URL;
    case NETWORKS.preview:
      return PREVIEW_API_URL;
    default:
      return TESTNET_API_URL;
  }
};

export const API_URL = getApiUrl() || DEFAULT_URL;

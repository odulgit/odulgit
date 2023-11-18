import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const makeChain = (name: string, rpc: string, id: number) => {
  return {
    id: id,
    name: name,
    network: name,
    nativeCurrency: {
      decimals: 18,
      name: name,
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: [rpc],
      },
      public: {
        http: [rpc],
      }
    },
    testnet: true,
  }
}

export const formatString = (address: string, formatLength: number) => {
  if (!address) {
    return ""; // If the address is undefined, return an empty string
  }
  if (address.length <= formatLength) {
    return address; // If the address is shorter than 12 characters, return it as is
  } else {
    const prefix = address.slice(0, formatLength); // Get the first six characters
    const suffix = address.slice(-formatLength); // Get the last six characters
    return `${prefix}...${suffix}`; // Combine the first six, ..., and last six characters
  }
}

import { ethers } from 'ethers';
import Hojicha from '../contracts/Hojicha.json';
import { HOJICHA_CONTRACT_ADDRESS } from '../constants';

/**
 * Fetches the list of tokens created by a user's account.
 * @param {string} account - The user's wallet address.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of token objects created by the user.
 */
export async function fetchUserTokens(account) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      HOJICHA_CONTRACT_ADDRESS,
      Hojicha.abi,
      provider
    );

    // Call the getTokensByOwner function to fetch tokens created by the user
    const tokens = await contract.getTokensByOwner(account);

    // Extract full token information from the returned data
    return tokens.map((token) => ({
      tokenAddress: token.tokenAddress,
      name: token.name,
      symbol: token.symbol,
    }));
  } catch (error) {
    console.error('Error fetching user-created tokens:', error);
    return [];
  }
}
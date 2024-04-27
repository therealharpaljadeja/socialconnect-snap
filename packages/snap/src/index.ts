import type {
  OnNameLookupHandler,
  OnRpcRequestHandler,
} from '@metamask/snaps-sdk';
import { ChainDisconnectedError, panel, text } from '@metamask/snaps-sdk';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};

export const onNameLookup: OnNameLookupHandler = async ({
  chainId,
  domain,
  address,
}) => {
  if (domain && chainId === 'eip155:42220') {
    if (domain) {
      const resolvedAddress = '0xc0ffee254729296a45a3885639AC7E10F9d54979';
      return {
        resolvedAddresses: [
          { resolvedAddress, protocol: 'Unstoppable Domains' },
        ],
      };
    }

    if (address) {
      // Domain lookup is not possible in SocialConnect
      return null;
    }
  }

  return null;
};

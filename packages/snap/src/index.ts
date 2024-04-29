import type { OnNameLookupHandler } from '@metamask/snaps-sdk';

const E164_REGEX = /^\+[1-9][0-9]{1,14}$/;

export function isE164Number(phoneNumber: string | undefined) {
  if (phoneNumber) return E164_REGEX.test(phoneNumber);
  return false;
}

export const onNameLookup: OnNameLookupHandler = async ({
  chainId,
  domain,
  address,
}) => {
  if (domain && chainId === 'eip155:42220') {
    if (domain) {
      const domainSplit = domain.split(':');
      const issuer = domainSplit[0];
      const identifier = domainSplit[1];

      if (
        domainSplit.length > 1 &&
        issuer &&
        identifier &&
        identifier.length >= 12 &&
        isE164Number(identifier)
      ) {
        console.log('All good');

        console.log(identifier);

        console.log(JSON.stringify({ handle: identifier }));

        const response = await fetch(
          `https://minipay-lookup-service-react-app.vercel.app/api/socialconnect/lookup?handle=${encodeURIComponent(
            identifier,
          )}`,
        );

        const data = await response.json();

        const { accounts } = data;

        console.log(accounts);

        return {
          resolvedAddresses: [
            {
              resolvedAddress: accounts[0],
              protocol: 'MiniPay SocialConnect',
            },
          ],
        };
      } else {
        return null;
      }
    }

    if (address) {
      // Domain lookup is not possible in SocialConnect
      return null;
    }
  }

  return null;
};

import { createClient, dedupExchange, cacheExchange, fetchExchange } from 'urql'
import { authExchange } from '@urql/exchange-auth'

const client = createClient({
    url: '/api/graphql',
    exchanges: [
        dedupExchange,
        cacheExchange,
        authExchange({
            addAuthToOperation: ({
                authState,
                operation
            }) => {
        // the token isn't in the auth state, return the operation without changes
        if (!authState || !authState.token) {
          return operation;
        }

        // fetchOptions can be a function (See Client API) but you can simplify this based on usage
        const fetchOptions =
          typeof operation.context.fetchOptions === 'function'
            ? operation.context.fetchOptions()
            : operation.context.fetchOptions || {};

        return {
          ...operation,
          context: {
            ...operation.context,
            fetchOptions: {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                "Authorization": authState.token,
              },
            },
          },
        };
      },
      willAuthError: ({ authState }) => {
        if (!authState) return true;
        // e.g. check for expiration, existence of auth etc
        return false;
      },
      didAuthError: ({ error }) => {
        // check if the error was an auth error (this can be implemented in various ways, e.g. 401 or a special error code)
        return error.graphQLErrors.some(
          e => e.extensions?.code === 'FORBIDDEN',
        );
      },
      getAuth: async ({ authState, mutate }) => {
        // for initial launch, fetch the auth state from storage (local storage, async storage etc)
        if (!authState) {
          const token = localStorage.getItem('token');
          const refreshToken = localStorage.getItem('refreshToken');
          if (token && refreshToken) {
            return { token, refreshToken };
          }
          return null;
        }

        /**
         * the following code gets executed when an auth error has occurred
         * we should refresh the token if possible and return a new auth state
         * If refresh fails, we should log out
         **/

        // if your refresh logic is in graphQL, you must use this mutate function to call it
        // if your refresh logic is a separate RESTful endpoint, use fetch or similar
        const result = await mutate(refreshMutation, {
          token: authState!.refreshToken,
        });

        if (result.data?.refreshLogin) {
          // save the new tokens in storage for next restart
          localStorage.setItem('token', result.data.refreshLogin.token);
          localStorage.setItem('refreshToken', result.data.refreshLogin.refreshToken);

          // return the new tokens
          return {
            token: result.data.refreshLogin.token,
            refreshToken: result.data.refreshLogin.refreshToken,
          };
        }

        // otherwise, if refresh fails, log clear storage and log out
        localStorage.clear();

        // your app logout logic should trigger here
        logout();

        return null;
      },
        }),
        fetchExchange
    ],
});

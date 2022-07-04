import algoliasearch from 'algoliasearch'

  const algoliaClient = algoliasearch(
   process.env.NEXT_PUBLIC_ALGOLIAAPPLICATIONID,
    process.env.NEXT_PUBLIC_ALGOLIAADMINKEY
      );
      
export const createSearchResult = (user) => {
        return {
            objectID: user.address,
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
        }
  }
      
   export const syncUsersSearchIndex = async (users) => {
    
      try {
        const index = await algoliaClient.initIndex(
          'users'
        );
        await index.saveObjects(users, {autoGenerateObjectIDIfNotExist: true});    
      } catch (error) {
        console.log(error);
      }
    
    }
    
    
    export const search = async (username) => {
        try {
          const index = await algoliaClient.initIndex(
            'users'
          );
          const searchResponse = await index.search(username);
          const result = searchResponse.hits.map((user) => {return createSearchResult(user)});
          return result;
      } catch (error) {
            console.log(error)
            return null;
        }
    }
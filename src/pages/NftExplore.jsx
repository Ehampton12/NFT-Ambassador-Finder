import React, { useState, useEffect } from "react";
import Moralis from "moralis";
import { NftSearchBar } from "../components/Nfts/NftSearchBar";
import { NftCardContainer } from "../components/Nfts/NftCardContainer";

export const NftExplore = ({ settheme }) => {
  // 1. loading state
  const [loading, setLoading] = useState(false);

  // 2. The search query state
  const [searchQuery, setSearchQuery] = useState("");

  // 3. The chain state
  const [chain, setchain] = useState("eth");

  // 4. The search results state
  const [searchResult, setSearchResult] = useState(null);

  // 5. The search query handler
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 6. The search function
  const searchNFTs = async () => {
    try {
      // 6.1. Set the loading state to true
      setLoading(true);

      // 6.2. Search for the NFTs
      const options = {
        q: searchQuery || "bored",
        chain: chain,
        filter: "name",
        limit: "30",
      };

      // 6.3. Get the search results
      const NFTs = await Moralis.Web3API.token.searchNFTs(options);

      // 6.4. If there is a result
      if (NFTs.result) {
        // 6.4.1. Convert the result metadata to an array
        const convertMetadata = NFTs.result.map((nft) => {
          nft.metadata = JSON.parse(nft.metadata);
          return nft;
        });

        // 6.4.2. Set the search result state
        setSearchResult(convertMetadata);

        // 6.4.3. Set the loading state to false
        setLoading(false);
      }
    } catch (error) {
      // 6.4.4. If there is an error, alert the user
      alert(error);

      // 6.4.5. Set the loading state to false
      setLoading(false);
    }
  };

  // 7. Search for "bored" NFTs on mount
  useEffect(() => {
    searchNFTs();
  }, []);

  console.log(searchResult);

  return (
    <React.Fragment>
      {/* NFT search bar section */}
      <NftSearchBar
        searchQuery={searchQuery}
        searchNFTs={searchNFTs}
        handleChange={handleChange}
      />
      <NftCardContainer searchResult={searchResult} loading={loading} />
    </React.Fragment>
  );
};

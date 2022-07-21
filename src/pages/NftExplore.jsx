import React, { useState, useEffect } from "react";
import Moralis from "moralis";
import { NftSearchBar } from "../components/Nfts/NftSearchBar";
import { NftCardContainer } from "../components/Nfts/NftCardContainer";
import { NftChainRadio } from "../components/Nfts/NftChainRadio";
import { ThemeSwitch } from "../components/ThemeSwitch";

export const NftExplore = ({ settheme }) => {
  //  loading state
  const [loading, setLoading] = useState(false);

  //  The search query state
  const [searchQuery, setSearchQuery] = useState("");

  //  The chain state
  const [chain, setchain] = useState("eth");

  //  The search results state
  const [searchResult, setSearchResult] = useState(null);

  //  The search query handler
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectedChain = (e) => {
    setchain(e.target.value);
  };

  //  The search function
  const searchNFTs = async () => {
    try {
      //  Set the loading state to true
      setLoading(true);

      //  Search for the NFTs
      const options = {
        q: searchQuery || "bored",
        chain: chain,
        filter: "name",
        limit: "30",
      };

      //  Get the search results
      const NFTs = await Moralis.Web3API.token.searchNFTs(options);

      // If there is a result
      if (NFTs.result) {
        //  Convert the result metadata to an array
        const convertMetadata = NFTs.result.map((nft) => {
          nft.metadata = JSON.parse(nft.metadata);
          return nft;
        });

        //  Set the search result state
        setSearchResult(convertMetadata);

        //  Set the loading state to false
        setLoading(false);
      }
    } catch (error) {
      //    If there is an error, alert the user
      alert(error);

      //  Set the loading state to false
      setLoading(false);
    }
  };

  //  Search for "bored" NFTs on mount
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
      <ThemeSwitch settheme={settheme} />

      <NftChainRadio handleSelectedChain={handleSelectedChain} />
      <NftCardContainer searchResult={searchResult} loading={loading} />
      <NftCardContainer searchResult={searchResult} loading={loading} />
    </React.Fragment>
  );
};

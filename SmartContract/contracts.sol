// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TheCrayBongs is ERC721Enumerable, Ownable {
    using Strings for uint256;
    
    event TokenPriceChanged(uint256 _tokenPrice);
    event TreasuryChanged(address _treasury);
    event BaseURIChanged(string _baseURI);
    event SaleMint(address minter, uint256 count);

    uint256 public  nextTokenId;
    address payable public treasury;
    uint256 public  maxSupply = 7000;
    uint16          maxPurchaseCount = 10;
    uint256 public  tokenPrice = 0.03 ether;
    string  public  baseURIValue;
    
    mapping (uint256 => string) private _tokenURIs;
    
    constructor(
        
    ) ERC721("Dick Token", "Dick") {

    }

    // set token price
    function getTokenPrice() public view returns (uint256) {
        return tokenPrice;
    }

    function setTokenPrice(uint256 _tokenPrice) public onlyOwner {
        tokenPrice = _tokenPrice;
        emit TokenPriceChanged(_tokenPrice);
    }
    
    // set treasury
    function getTreasury() public view returns (address payable) {
        return treasury;
    }

    function setTreasury(address payable _treasury) public onlyOwner {
        treasury = _treasury;
        emit TreasuryChanged(_treasury);
    }
    
    // set base URI
    function _baseURI() internal view override returns (string memory) {
        return baseURIValue;
    }

    function getBaseURI() public view returns (string memory) {
        return _baseURI();
    }

    function setBaseURI(string memory newBase) public onlyOwner {
        baseURIValue = newBase;
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();
        
        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }
    
    // mint token
    modifier doesNotExceedMaxPurchaseCount(uint256 count) {
        require(
            count > 0  && count <= maxPurchaseCount,
            "Cannot mint more than 10 tokens at a time"
        );
        _;
    }

    modifier validatePurchasePrice(uint256 count) {
        require(
            tokenPrice * count < msg.value,
            "Ether value sent is not correct"
        );
        _;
    }
    
    function mintTokens(uint256 count, string[] memory tokenURIs_) 
        public 
        payable 
        doesNotExceedMaxPurchaseCount(count) 
        validatePurchasePrice(count)
    {
        // Gas optimization
        uint256 _nextTokenId = nextTokenId;

        // Make sure presale has been set up
        require(treasury != address(0), "Dick: treasury not set");
        require(tokenPrice > 0, "Dick: token price not set");
        require(count > 0  && count <= maxPurchaseCount, "Dick: invalid count");
        require(_nextTokenId + count <= maxSupply, "Dick: max supply exceeded");
        require(count == tokenURIs_.length, "Dick: mint count does not match the token count");

        // The contract never holds any Ether. Everything gets redirected to treasury directly.
        treasury.transfer(msg.value);

        for (uint256 ind = 0; ind < count; ind++) {
            _safeMint(msg.sender, _nextTokenId + ind);
            _tokenURIs[_nextTokenId + ind] = tokenURIs_[ind];
        }
        nextTokenId += count;

        emit SaleMint(msg.sender, count);
    }
}
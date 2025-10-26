//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title RealEstateFractional
 * @notice ERC-1155 contract for tokenizing real estate properties into fractional ownership
 * @dev Each property gets a unique tokenId, and shares (fractions) can be purchased
 * @author RealEstate Fractional Platform
 */
contract RealEstateFractional is ERC1155, AccessControl {
    using Strings for uint256;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    uint256 private _propertyIdCounter;
    
    struct Property {
        uint256 tokenId;
        string title;
        string location;
        uint256 totalPrice;         // Total price in wei
        uint256 totalShares;        // Total number of shares (fractions)
        uint256 sharePrice;         // Price per share in wei
        uint256 sharesSold;         // Number of shares sold
        uint256 proceedsWithdrawn;  // Amount of proceeds already withdrawn
        string metadataURI;         // IPFS URI or data URI with property details
        bool isActive;              // Whether property is available for purchase
        address creator;            // Address that created the property listing
    }
    
    mapping(uint256 => Property) public properties;
    mapping(address => uint256[]) public userOwnedProperties;
    
    event ProceedsWithdrawn(uint256 indexed tokenId, address indexed recipient, uint256 amount);
    
    event PropertyCreated(
        uint256 indexed tokenId,
        string title,
        string location,
        uint256 totalPrice,
        uint256 totalShares,
        uint256 sharePrice
    );
    
    event SharesPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 amount,
        uint256 totalCost
    );
    
    event PropertyStatusChanged(uint256 indexed tokenId, bool isActive);
    
    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @notice Create a new property listing
     * @param _title Property title
     * @param _location Property location
     * @param _totalPrice Total property price in wei
     * @param _totalShares Total number of shares to divide property into
     * @param _metadataURI URI containing property metadata (images, description, etc.)
     */
    function createProperty(
        string memory _title,
        string memory _location,
        uint256 _totalPrice,
        uint256 _totalShares,
        string memory _metadataURI
    ) external onlyRole(ADMIN_ROLE) returns (uint256) {
        require(_totalPrice > 0, "Price must be greater than 0");
        require(_totalShares > 0, "Total shares must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_totalPrice >= _totalShares, "Price must be at least equal to total shares");
        require(_totalPrice % _totalShares == 0, "Price must be evenly divisible by total shares");
        
        uint256 newPropertyId = _propertyIdCounter;
        _propertyIdCounter++;
        
        uint256 sharePrice = _totalPrice / _totalShares;
        require(sharePrice > 0, "Share price must be greater than 0");
        
        properties[newPropertyId] = Property({
            tokenId: newPropertyId,
            title: _title,
            location: _location,
            totalPrice: _totalPrice,
            totalShares: _totalShares,
            sharePrice: sharePrice,
            sharesSold: 0,
            proceedsWithdrawn: 0,
            metadataURI: _metadataURI,
            isActive: true,
            creator: msg.sender
        });
        
        emit PropertyCreated(
            newPropertyId,
            _title,
            _location,
            _totalPrice,
            _totalShares,
            sharePrice
        );
        
        return newPropertyId;
    }
    
    /**
     * @notice Purchase shares (fractions) of a property
     * @param _tokenId Property token ID
     * @param _amount Number of shares to purchase
     */
    function purchaseShares(uint256 _tokenId, uint256 _amount) external payable {
        Property storage property = properties[_tokenId];
        
        require(property.isActive, "Property is not active");
        require(_amount > 0, "Amount must be greater than 0");
        require(
            property.sharesSold + _amount <= property.totalShares,
            "Not enough shares available"
        );
        
        uint256 totalCost = property.sharePrice * _amount;
        require(msg.value >= totalCost, "Insufficient payment");
        
        property.sharesSold += _amount;
        
        _mint(msg.sender, _tokenId, _amount, "");
        
        if (balanceOf(msg.sender, _tokenId) == _amount) {
            userOwnedProperties[msg.sender].push(_tokenId);
        }
        
        emit SharesPurchased(_tokenId, msg.sender, _amount, totalCost);
        
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }
    
    /**
     * @notice Get property details
     * @param _tokenId Property token ID
     */
    function getProperty(uint256 _tokenId) external view returns (Property memory) {
        return properties[_tokenId];
    }
    
    /**
     * @notice Get total number of properties
     */
    function getTotalProperties() external view returns (uint256) {
        return _propertyIdCounter;
    }
    
    /**
     * @notice Get user's balance of specific property shares
     * @param _user User address
     * @param _tokenId Property token ID
     */
    function getUserPropertyBalance(address _user, uint256 _tokenId) 
        external 
        view 
        returns (uint256) 
    {
        return balanceOf(_user, _tokenId);
    }
    
    /**
     * @notice Get all property IDs owned by a user
     * @param _user User address
     */
    function getUserOwnedProperties(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userOwnedProperties[_user];
    }
    
    /**
     * @notice Toggle property active status
     * @param _tokenId Property token ID
     */
    function togglePropertyStatus(uint256 _tokenId) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        properties[_tokenId].isActive = !properties[_tokenId].isActive;
        emit PropertyStatusChanged(_tokenId, properties[_tokenId].isActive);
    }
    
    /**
     * @notice Withdraw available proceeds from property sales to property creator
     * @param _tokenId Property token ID
     */
    function withdrawPropertyProceeds(uint256 _tokenId) external {
        Property storage property = properties[_tokenId];
        require(msg.sender == property.creator || hasRole(ADMIN_ROLE, msg.sender), "Not authorized");
        
        uint256 totalProceeds = property.sharePrice * property.sharesSold;
        uint256 availableToWithdraw = totalProceeds - property.proceedsWithdrawn;
        
        require(availableToWithdraw > 0, "No proceeds available to withdraw");
        require(address(this).balance >= availableToWithdraw, "Insufficient contract balance");
        
        property.proceedsWithdrawn += availableToWithdraw;
        
        emit ProceedsWithdrawn(_tokenId, property.creator, availableToWithdraw);
        
        payable(property.creator).transfer(availableToWithdraw);
    }
    
    /**
     * @notice Emergency withdraw - only for admin in case of stuck funds
     */
    function emergencyWithdraw() external onlyRole(ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(msg.sender).transfer(balance);
    }
    
    /**
     * @notice Override uri function to return property metadata
     */
    function uri(uint256 _tokenId) public view override returns (string memory) {
        return properties[_tokenId].metadataURI;
    }
    
    /**
     * @notice Support for ERC1155 and AccessControl interfaces
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    receive() external payable {}
}

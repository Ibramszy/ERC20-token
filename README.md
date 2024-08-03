# IbramizyToken Contract

This Solidity program defines a simple ERC20 token contract named `IbramizyToken`. It demonstrates the basic functionalities of an ERC20 token with additional minting and burning capabilities.

## Description

The `IbramizyToken` contract extends the standard ERC20 token functionalities and includes features for minting new tokens, burning tokens, and transferring tokens. It inherits from OpenZeppelin's `ERC20`, `ERC20Burnable`, and `Ownable` contracts, which provide standard ERC20 functionality, token burning capabilities, and ownership control, respectively.

### Code Breakdown

1. Import Statements:
   ```solidity
    import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
    import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";
   ```

   These lines import essential contracts from the OpenZeppelin library:
   `ERC20`: Provides the standard ERC20 token implementation.
   `ERC20Burnable`: Adds the ability to burn tokens.
   `Ownable`: Provides ownership control to manage who can mint new tokens.

2. Contract Declaration:
   ```solidity
   contract IbramizyToken is ERC20, ERC20Burnable, Ownable {
   ```

   The `IbramizyToken` contract inherits from `ERC20`, `ERC20Burnable`, and `Ownable`, combining their functionalities into one token contract.

3. Constructor:
   ```solidity
    constructor() ERC20("IbramizyToken", "IBTK") {
    _mint(msg.sender, 10 * 10 ** decimals());
    }
   ```

   The constructor initializes the token with the name `IbramizyToken` and the symbol `IBTK`. It also mints an initial supply of tokens `(10 tokens)` to the address deploying the contract.

4. Mint Function:
   ```solidity
   function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
    }
   ```

   This function allows the owner of the contract to mint new tokens and send them to a specified address. Only the owner (deployer) can call this function.

5. Burn Function:
   ```solidity
     function burn(uint256 amount) public override {
        _burn(_msgSender(), amount);
     }
   ```

   This function allows token holders to burn (destroy) tokens from their own balance. It overrides the `burn` function from `ERC20Burnable`

6. Transfer Function:
   ```solidity
   function transfer(address recipient, uint256 amount) public override returns (bool) {
      _transfer(_msgSender(), recipient, amount);
      return true;
   }
   ```

   This function allows token holders to transfer tokens to another address. It overrides the `transfer` function from `ERC20` to ensure that tokens are moved from the caller’s address to the recipient’s address.

## Authors

Ibrahim Salihu  
[@metacraftersio](https://twitter.com/metacraftersio)


## License

This project is licensed under the MIT License - see the LICENSE.md file for details

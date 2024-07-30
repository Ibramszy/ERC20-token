// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IERC20.sol";

contract IbramizyToken is IERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 private _totalSupply;
    address public owner;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can mint tokens");
        _;
    }

    constructor() {
        owner = msg.sender;
        name = "Ibramizy Token";
        symbol = "IBT";
        decimals = 18;
        _totalSupply = 1000;
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(
        address account
    ) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(
        address _owner,
        address spender
    ) external view override returns (uint256) {
        return _allowances[_owner][spender];
    }

    function approve(
        address spender,
        uint256 amount
    ) external override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        require(_balances[sender] >= amount, "Insufficient balance");
        require(
            _allowances[sender][msg.sender] >= amount,
            "Allowance exceeded"
        );
        _balances[sender] -= amount;
        _balances[recipient] += amount;
        _allowances[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(address to, uint256 amount) external override onlyOwner {
        require(to != address(0), "Invalid address");
        _totalSupply += amount;
        _balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function burn(uint256 amount) external override {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _totalSupply -= amount;
        _balances[msg.sender] -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}

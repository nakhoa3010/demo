// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./RequestResponseConsumerFulfill.sol";
import "./libraries/Orakl.sol";

contract MockAIInference is RequestResponseConsumerFulfillBool, Ownable {
    using Orakl for Orakl.Request;

    // Store the last received response for testing
    bool public lastResponse;
    uint256 public lastRequestId;
    uint256 public wethAmountForTrade = 1000000000000000; // 0.001 WETH
    uint256 public usdcAmountForTrade = 10000000; // 10 USDC - decimals 6
    address public usdcTokenAddress;

    event DataRequested(uint256 indexed requestId);
    event DataFulfilled(uint256 indexed requestId, bytes response);
    event TradeSuccess(uint256 indexed requestId, uint256 amountIn, bool isBuy);

    address public immutable WETH;
    IV3SwapRouter public swapRouter;

    constructor(
        address _coordinator,
        address _weth,
        address _swapRouter,
        address _usdcTokenAddress
    ) RequestResponseConsumerBase(_coordinator) Ownable(msg.sender) {
        WETH = _weth;
        swapRouter = IV3SwapRouter(_swapRouter);
        usdcTokenAddress = _usdcTokenAddress;
    }

    function setWethAmountForTrade(uint256 amount) external onlyOwner {
        wethAmountForTrade = amount;
    }

    function setUsdcAmountForTrade(uint256 amount) external onlyOwner {
        usdcAmountForTrade = amount;
    }

    function setSwapRouter(address _swapRouter) external onlyOwner {
        swapRouter = IV3SwapRouter(_swapRouter);
    }

    function swapToken(uint256 requestId, bool result) internal {
        // Execute trade through Uniswap V3
        if (!result) {
            // buy usdc with eth
            IERC20(WETH).approve(address(swapRouter), wethAmountForTrade);
            swapRouter.exactInputSingle(
                IV3SwapRouter.ExactInputSingleParams({
                    tokenIn: WETH,
                    tokenOut: usdcTokenAddress,
                    fee: 3000,
                    recipient: address(this),
                    amountIn: wethAmountForTrade,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                })
            );

            emit TradeSuccess(requestId, wethAmountForTrade, true);
        } else {
            // sell usdc for eth
            // First approve router to spend our tokens
            IERC20(usdcTokenAddress).approve(
                address(swapRouter),
                usdcAmountForTrade
            );

            swapRouter.exactInputSingle(
                IV3SwapRouter.ExactInputSingleParams({
                    tokenIn: usdcTokenAddress, // usdc token
                    tokenOut: WETH, // eth
                    fee: 3000, // 0.3% fee tier
                    recipient: address(this),
                    amountIn: usdcAmountForTrade,
                    amountOutMinimum: 0, // Set minimum amount out to 0 (should use proper slippage in production)
                    sqrtPriceLimitX96: 0
                })
            );
            emit TradeSuccess(requestId, usdcAmountForTrade, false);
        }
    }

    // request for bool
    function requestPredictPrice(
        uint64 accId,
        uint32 callbackGasLimit,
        uint8 numSubmission,
        string memory adapterId,
        string memory predictionType // 5m/8h
    ) public onlyOwner returns (uint256 requestId) {
        bytes32 jobId = keccak256(abi.encodePacked("bool"));
        Orakl.Request memory req = buildRequest(jobId);
        req.add("inference_adapter", adapterId);
        req.add("input_coinName", "eth");
        req.add("input_predictionType", predictionType);
        req.add("path", "isBuy");

        requestId = COORDINATOR.requestData(
            req,
            callbackGasLimit,
            accId,
            numSubmission
        );
    }

    function fulfillDataRequest(
        uint256 requestId,
        bool response
    ) internal override {
        lastResponse = response;
        swapToken(requestId, response);
    }

    receive() external payable {}

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawToken(address token) external onlyOwner {
        IERC20(token).transfer(owner(), IERC20(token).balanceOf(address(this)));
    }
}

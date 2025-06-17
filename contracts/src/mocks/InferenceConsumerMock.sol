// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "../RequestResponseConsumerFulfill.sol";
import "../RequestResponseConsumerBase.sol";

contract InferenceConsumerMock is RequestResponseConsumerFulfillBool {
    using Orakl for Orakl.Request;
    bool public sResponseBool;

    address private sOwner;

    error OnlyOwner(address notOwner);

    modifier onlyOwner() {
        if (msg.sender != sOwner) {
            revert OnlyOwner(msg.sender);
        }
        _;
    }

    constructor(address coordinator) RequestResponseConsumerBase(coordinator) {
        sOwner = msg.sender;
    }

    // Receive remaining payment from requestDataPayment
    receive() external payable {}

    // request for bool
    function requestPredictPrice(
        uint64 accId,
        uint32 callbackGasLimit,
        uint8 numSubmission, // eth/btc/sol
        string memory adapterId,
        string memory symbol,
        string memory predictionType // 5m/8h
    ) public onlyOwner returns (uint256 requestId) {
        bytes32 jobId = keccak256(abi.encodePacked("bool"));
        Orakl.Request memory req = buildRequest(jobId);
        req.add("inference_adapter", adapterId);
        req.add("input_coinName", symbol);
        req.add("input_predictionType", predictionType);
        req.add("path", "isBuy");

        requestId = COORDINATOR.requestData(req, callbackGasLimit, accId, numSubmission);
    }

    function requestPredictPriceDirectPayment(
        uint32 callbackGasLimit,
        uint8 numSubmission, // eth/btc/sol
        string memory adapterId,
        string memory symbol,
        string memory predictionType // 5m/8h
    ) public payable onlyOwner returns (uint256 requestId) {
        bytes32 jobId = keccak256(abi.encodePacked("bool"));
        Orakl.Request memory req = buildRequest(jobId);
        req.add("inference_adapter", adapterId);
        req.add("input_coinName", symbol);
        req.add("input_predictionType", predictionType);
        req.add("path", "isBuy");

        requestId = COORDINATOR.requestData{value: msg.value}(
            req,
            callbackGasLimit,
            numSubmission,
            msg.sender
        );
    }

    function fulfillDataRequest(uint256 /*requestId*/, bool response) internal override {
        sResponseBool = response;
    }

    function cancelRequest(uint256 requestId) external onlyOwner {
        COORDINATOR.cancelRequest(requestId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DecisionLog {
    event DecisionLogged(bytes32 decisionHash, uint256 ts, uint8 roomClass, uint8 tier, uint16 pscoreBps);

    function logDecision(bytes32 decisionHash, uint8 roomClass, uint8 tier, uint16 pscoreBps) external {
        emit DecisionLogged(decisionHash, block.timestamp, roomClass, tier, pscoreBps);
    }
}

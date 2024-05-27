// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

interface IETHOracle {
	function sendRequest(
		bytes memory encryptedSecretsUrls,
		uint8 donHostedSecretsSlotID,
		uint64 donHostedSecretsVersion,
		string[] memory args,
		bytes[] memory bytesArgs,
		uint64 subscriptionId,
		uint32 gasLimit,
		bytes32 donID
	) external returns (bytes32 requestId);

	function didPriceIncrease(
		uint256 fromTimestamp,
		uint256 toTimestamp
	) external view returns (bool priceIncreased, bool isSet);
}

contract FlipTheCoin {
	IETHOracle public oracle;
	uint64 public subscriptionId;
	bytes32 donID = "fun-ethereum-sepolia-1";

	uint256 public constant FLIP_FEE_PERCENTAGE = 3;
	uint256 public constant MAX_BET_PERCENTAGE = 90;
	uint256 public constant WIN_MULTIPLIER = 150;
	uint256 public constant LOSS_MULTIPLIER = 50;
	uint256 public reserve = 0;

	struct Bet {
		uint256 amount;
		bool prediction;
		uint256 betTimestamp;
		bool resolved;
		bool win;
	}

	mapping(address => Bet[]) public betsByAddress;

	event BetPlaced(
		address indexed bettor,
		uint256 indexed betIndex,
		uint256 amount,
		bool prediction,
		uint256 betTimestamp
	);

	event BetResolved(
		address indexed bettor,
		uint256 indexed betIndex,
		bool win,
		uint256 payout
	);

	constructor(address oracleAddress, uint64 _subscriptionId) payable {
		oracle = IETHOracle(oracleAddress);
		subscriptionId = _subscriptionId;
		reserve += msg.value;
	}

	function getMaxBetAmount() public view returns (uint256) {
		return (reserve * MAX_BET_PERCENTAGE) / 100;
	}

	function getNumberOfBets(address bettor) public view returns (uint) {
		return betsByAddress[bettor].length;
	}

	function placeBet(
		bool _prediction,
		uint256 _amount,
		uint256 _betTimestamp
	) public payable {
		require(msg.value == _amount, "Incorrect value sent");
		require(
			_amount <= (reserve * MAX_BET_PERCENTAGE) / 100,
			"Bet amount exceeds maximum allowed"
		);

		uint256 fee = (_amount * FLIP_FEE_PERCENTAGE) / 100;
		uint256 betAmount = _amount - fee;
		reserve += fee;

		betsByAddress[msg.sender].push(
			Bet(betAmount, _prediction, _betTimestamp, false, false)
		);

		string[] memory args = new string[](2);
		bytes[] memory bytesArgs = new bytes[](0);

		args[0] = Strings.toString(_betTimestamp);
		uint256 conclusionTimestamp = _betTimestamp + 60;
		args[1] = Strings.toString(conclusionTimestamp);

		oracle.sendRequest(
			"",
			0,
			0,
			args,
			bytesArgs,
			subscriptionId,
			300000,
			donID
		);
		emit BetPlaced(
			msg.sender,
			betsByAddress[msg.sender].length - 1,
			betAmount,
			_prediction,
			_betTimestamp
		);
	}

	function resolveBet(uint256 _betIndex) public {
		require(
			_betIndex < betsByAddress[msg.sender].length,
			"Bet index out of range"
		);

		Bet storage bet = betsByAddress[msg.sender][_betIndex];
		require(!bet.resolved, "Bet already resolved");

		(bool priceIncreased, bool isSet) = oracle.didPriceIncrease(
			bet.betTimestamp,
			bet.betTimestamp + 60
		);

		require(isSet, "Oracle response not yet set");

		bool win = (priceIncreased == bet.prediction);

		uint256 payout = win
			? (bet.amount * WIN_MULTIPLIER) / 100
			: (bet.amount * LOSS_MULTIPLIER) / 100;

		require(reserve >= payout, "Insufficient reserve");

		payable(msg.sender).transfer(payout);
		reserve -= payout;

		bet.resolved = true;
		bet.win = win;

		emit BetResolved(msg.sender, _betIndex, win, payout);
	}

	function addSixtySeconds(uint256 timestamp) public pure returns (uint256) {
		return timestamp + 60;
	}
}

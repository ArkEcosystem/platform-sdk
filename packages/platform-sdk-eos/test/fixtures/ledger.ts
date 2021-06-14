export const ledger = {
	appVersion: {
		record: `
            => d406000000
            <= 000103019000
        `,
		result: "1.3.1",
	},
	bip44: {
		path: "44'/194'/0'/0/0",
	},
	publicKey: {
		record: `
            => d402000015058000002c800000c2800000000000000000000000
            <= 4104cf4efd3a258a4a330885525477a332b404d7f723dbff8a4a94c110c2fc2bdd028392ceb6e29dabe37e3a3cce8790907c288cbcbaafed9fbd5fc344ad8e8bd99a35454f5336546e6d6b53446378664358754c4e4b64786b6a314731537253474b696336337744614b34655639384d69505646474b58719000
        `,
		result: "04cf4efd3a258a4a330885525477a332b404d7f723dbff8a4a94c110c2fc2bdd028392ceb6e29dabe37e3a3cce8790907c288cbcbaafed9fbd5fc344ad8e8bd99a",
	},
	transaction: {
		record: `
            => d404000096058000002c800000c28000000000000000000000000420e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c414730404b116e35e04028d250404824e367e040100040100040100040100040101040800a6823403ea30550408000000572d3ccdcd04010104089003724ba5aa54c4040800000000a8ed323204012104219003724ba5aa54c4a0229bfa4d37a98b
            <= 9000
            => d404800036640000000000000004454f53000000000004010004200000000000000000000000000000000000000000000000000000000000000000
            <= 2068fab4c01f470310b0693b41a5b5fa4124fb32350c762ec63b6e013ae40337dd64dd6580afa5d6de7c1db88bc78a6572c905f167241d94f10cead090844834399000
        `,
		payload:
			"0420e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c414730404b116e35e04028d250404824e367e040100040100040100040100040101040800a6823403ea30550408000000572d3ccdcd04010104089003724ba5aa54c4040800000000a8ed323204012104219003724ba5aa54c4a0229bfa4d37a98b640000000000000004454f53000000000004010004200000000000000000000000000000000000000000000000000000000000000000",
		result: "2068fab4c01f470310b0693b41a5b5fa4124fb32350c762ec63b6e013ae40337dd64dd6580afa5d6de7c1db88bc78a6572c905f167241d94f10cead09084483439",
	},
};

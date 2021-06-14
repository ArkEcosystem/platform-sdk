export const ledger = {
	appVersion: {
		record: `
            => 5500000000
            <= 00020c0000311000049000
        `,
		result: "2.12.0",
	},
	bip44: {
		path: "44'/118'/0'/0/0",
	},
	publicKey: {
		record: `
            => 5500000000
            <= 00020c0000311000049000
            => 550400001b06636f736d6f732c00008076000080000000800000000000000000
            <= 0386b39760b417b960afbadb129bb14245938116770462bc7dac14c93840371cff636f736d6f73316d38747865366a306438326d6c6876677830757a6133646b77727a33716d66776a717968336b9000
        `,
		result: "0386b39760b417b960afbadb129bb14245938116770462bc7dac14c93840371cff",
	},
	transaction: {
		record: `
            => 5500000000
            <= 00020c0000311000049000
            => 55020100fa7b226163636f756e745f6e756d626572223a2236353731222c22636861696e5f6964223a22636f736d6f736875622d32222c22666565223a7b22616d6f756e74223a5b7b22616d6f756e74223a2235303030222c2264656e6f6d223a227561746f6d227d5d2c22676173223a22323030303030227d2c226d656d6f223a2244656c6567617465642077697468204c65646765722066726f6d20756e696f6e2e6d61726b6574222c226d736773223a5b7b2274797065223a22636f736d6f732d73646b2f4d736744656c6567617465222c2276616c7565223a7b22616d6f756e74223a7b22616d6f756e74223a2231303030303030222c2264656e
            <= 9000
            => 55020200ae6f6d223a227561746f6d227d2c2264656c656761746f725f61646472657373223a22636f736d6f73313032687479306a76327332396c7963347530747639377a39763239386532347433767774706c222c2276616c696461746f725f61646472657373223a22636f736d6f7376616c6f70657231677267656c796e67327636763374387a383777753373786774396d3573303378667974767a37227d7d5d2c2273657175656e6365223a2230227d
            <= 3045022100edac0d5d791e3512cca0c33fbf2aad190b03e6ca82f248b59354aa71ae26d5e7022072dedf96b9cabb6b7f972bb03f2e862c29ae2c02ca51955526c989c93045e7279000
        `,
		payload:
			'{"account_number":"6571","chain_id":"cosmoshub-2","fee":{"amount":[{"amount":"5000","denom":"uatom"}],"gas":"200000"},"memo":"Delegated with Ledger from union.market","msgs":[{"type":"cosmos-sdk/MsgDelegate","value":{"amount":{"amount":"1000000","denom":"uatom"},"delegator_address":"cosmos102hty0jv2s29lyc4u0tv97z9v298e24t3vwtpl","validator_address":"cosmosvaloper1grgelyng2v6v3t8z87wu3sxgt9m5s03xfytvz7"}}],"sequence":"0"}',
		result: "3045022100edac0d5d791e3512cca0c33fbf2aad190b03e6ca82f248b59354aa71ae26d5e7022072dedf96b9cabb6b7f972bb03f2e862c29ae2c02ca51955526c989c93045e727",
	},
};

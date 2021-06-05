const AppearancePositions = require("./AppearancePositions");

class MaleAppearancePositions extends AppearancePositions {
	constructor() {
		super();
		this.hair = {
			x: -36,
			y: -242
		};
		this.helmet = {
			x: -30,
			y: -158
		};

		this.armor = {
			upper_right: {
				x: 210,
				y: 205
			},
			lower_right: {
				x: 250,
				y: 375
			},
			upper_left: {
				x: -32,
				y: 205
			},
			lower_left: {
				x: -24,
				y: 395
			},
			body: {
				x: 25,
				y: 155
			},
			neck: {
				x: 105,
				y: 90
			},
		};

		this.gloves = {
			right: {
				wrist: {
					x: 237,
					y: 379
				},
				hand: {
					x: 262,
					y: 530
				}
			},
			left: {
				wrist: {
					x: -30,
					y: 386
				},
				hand: {
					x: -15,
					y: 548
				}
			}
		};

		this.pants = {
			upper_right: {
				x: -54,
				y: 490
			},
			lower_right: {
				x: -46,
				y: 785
			},
			upper_left: {
				x: -198,
				y: 490
			},
			lower_left: {
				x: -240,
				y: 790
			},
			hip: {
				x: -188,
				y: 445
            }
		};

		this.boots = {
			lower_left: {
				x: -238,
				y: 800
			},
			foot_left: {
				x: 0,
				y: 1053
			},
			lower_right: {
				x: -42,
				y: 780
			},
			foot_right: {
				x: 4,
				y: 1053
			}
		};
		this.eyes = {
			x: -35,
			y: 62
		};

		this.mouth = {
			teeths: {
				x: -30,
				y: 130
			},
			lips: {
				x: -30,
				y: 136
			}
		};

		this.facialHair = {
			x: 97,
			y: 15
		};

		this.ear = {
			x: -188,
			y: -20
		};

		this.nose = {
			x: -42,
			y: 64
		};

	}
}

module.exports = new MaleAppearancePositions();

const AppearancePositions = require("./AppearancePositions");

class FemaleAppearancePositions extends AppearancePositions {
	constructor() {
		super();
		this.hair = {
			x: -36,
			y: -203
		};
		this.helmet = {
			x: -30,
			y: -119
		};

		this.armor = {
			upper_right: {
				x: 200,
				y: 205 + 21,
				rotation: -4
			},
			lower_right: {
				x: 250,
				y: 375 + 40,
				rotation: -10
			},
			upper_left: {
				x: -20 + 3,
				y: 205 + 26,
				rotation: 10
			},
			lower_left: {
				x: 2,
				y: 395 + 32,
				rotation: -7
			},
			body: {
				x: 25 + 5,
				y: 155 + 28
			},
			neck: {
				x: 105 - 3,
				y: 90 + 37
			},
		};

		this.gloves = {
			scale: 0.95,
			right: {
				wrist: {
					x: 246,
					y: 420,
					rotation: -10
				},
				hand: {
					x: 268,
					y: 570,
					rotation: -12
				}
			},
			left: {
				wrist: {
					x: -5,
					y: 400,
					rotation: 0
				},
				hand: {
					x: 12,
					y: 552,
					rotation: -11
				}
			}
		};

		this.pants = {
			upper_right: {
				x: -62,
				y: 490,
				rotation: -7
			},
			lower_right: {
				x: -53,
				y: 785,
				rotation: 0
			},
			upper_left: {
				x: -202,
				y: 490,
				rotation: 10
			},
			lower_left: {
				x: -238,
				y: 790,
				rotation: 6
			},
			hip: {
				x: -184,
				y: 445 + 36
			}
		};

		this.boots = {
			scale: 0.82,
			lower_left: {
				x: -238 + 25,
				y: 800,
				rotation: 7
			},
			foot_left: {
				x: 0 + 23,
				y: 1050,
				rotation: 0
			},
			lower_right: {
				x: -42 + 18,
				y: 780,
				rotation: 0
			},
			foot_right: {
				x: 4 + 12,
				y: 1048 ,
				rotation: 0
			}
		};

		this.eyes = {
			x: -35,
			y: 101
		};

		this.mouth = {
			teeths: {
				x: -30,
				y: 173
			},
			lips: {
				x: -30,
				y: 175
			}
		};

		this.facialHair = {
			x: 97,
			y: 54
		};

		this.ear = {
			x: -188,
			y: 19
		};

		this.nose = {
			x: -42,
			y: 103
		};

	}
}

module.exports = new FemaleAppearancePositions();

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
				x: 225,
				y: 375 + 30,
				rotation: -9.5
			},
			upper_left: {
				x: -20 + 3 - 24,
				y: 185 + 26,
				rotation: 10
			},
			lower_left: {
				x: 2 - 18,
				y: 375 + 20,
				rotation: -5
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
			scale: 0.9,
			wristScale: 0.85,
			right: {
				wrist: {
					x: 246 + 10,
					y: 420 + 30,
					rotation: -8
				},
				hand: {
					x: 268 + 5,
					y: 570 + 9,
					rotation: -14
				}
			},
			left: {
				wrist: {
					x: -5 + 9,
					y: 400 + 18,
					rotation: 0
				},
				hand: {
					x: 12 + 4,
					y: 552  + 7,
					rotation: -11
				}
			}
		};

		this.pants = {
			upper_right: {
				x: -92,
				y: 490,
				rotation: -7
			},
			lower_right: {
				x: -53,
				y: 785,
				rotation: 0
			},
			upper_left: {
				x: -202 - 39,
				y: 470,
				rotation: 10
			},
			lower_left: {
				x: -257,
				y: 780,
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
				x: -238 + 22,
				y: 800,
				rotation: 10
			},
			foot_left: {
				x: 0 + 21,
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
			x: 95,
			y: 60
		};

		this.ear = {
			x: -188,
			y: 19
		};

		this.nose = {
			x: -42,
			y: 103
		};

		this.weapon = {
			main: {
				x: -220,
				y: 375,
				rotation: 100,
			},
			offhand: {
				x: 35,
				y: 305,
				rotation: 80,
			}
			,
			bow: {
				x: -180,
				y: 305,
				rotation: 80,
			}
		};

	}
}

module.exports = new FemaleAppearancePositions();

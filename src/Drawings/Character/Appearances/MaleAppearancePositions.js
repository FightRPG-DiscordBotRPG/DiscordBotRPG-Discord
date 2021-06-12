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
				y: 205,
				rotation: 1
			},
			lower_right: {
				x: 220,
				y: 375,
				rotation: -12
			},
			upper_left: {
				x: -62,
				y: 185,
				rotation: 13
			},
			lower_left: {
				x: -36,
				y: 395,
				rotation: -5
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
			scale: 1,
			right: {
				wrist: {
					x: 237,
					y: 379,
					rotation: -10
				},
				hand: {
					x: 262,
					y: 530,
					rotation: -12
				}
			},
			left: {
				wrist: {
					x: -30,
					y: 386,
					rotation: 0
				},
				hand: {
					x: -15,
					y: 548,
					rotation: -11
				}
			}
		};

		this.pants = {
			upper_right: {
				x: -84,
				y: 490,
				rotation: -7
			},
			lower_right: {
				x: -52,
				y: 784,
				rotation: -2
			},
			upper_left: {
				x: -237,
				y: 470,
				rotation: 10
			},
			lower_left: {
				x: -258,
				y: 780,
				rotation: 6
			},
			hip: {
				x: -184,
				y: 450
            }
		};

		this.boots = {
			scale: 1,
			lower_left: {
				x: -238,
				y: 800,
				rotation:7 
			},
			foot_left: {
				x: 0,
				y: 1053,
				rotation: 0
			},
			lower_right: {
				x: -42,
				y: 780,
				rotation: 0
			},
			foot_right: {
				x: 4,
				y: 1053,
				rotation: 0
			}
		};

		this.eyes = {
			x: -35,
			y: 62
		};

		this.mouth = {
			teeths: {
				x: -30,
				y: 134
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

		this.weapon = {
			main: {
				x: -188,
				y: 445,
				rotation: 90,
			},
			offhand: {
				x: 0,
				y: 0,
				rotation: 90,
			}
		};

	}
}

module.exports = new MaleAppearancePositions();

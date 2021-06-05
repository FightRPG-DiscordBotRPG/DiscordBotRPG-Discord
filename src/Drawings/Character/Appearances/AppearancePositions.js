class AppearancePositions {
	constructor() {

		this.hair = {
			x: 0,
			y: 0
		};
		this.helmet = {
			x: 0,
			y: 0
		};

		this.armor = {
			upper_right: {
				x: 0,
				y: 0,
				rotation: 0
			},
			lower_right: {
				x: 0,
				y: 0,
				rotation: 0
			},
			upper_left: {
				x: 0,
				y: 0,
				rotation: 0
			},
			lower_left: {
				x: 0,
				y: 0,
				rotation: 0
			},
			body: {
				x: 0,
				y: 0
			},
			neck: {
				x: 0,
				y: 0
			},
		};

		this.gloves = {
			scale: 1,
			right: {
				wrist: {
					x: 0,
					y: 0,
					rotation: 0
				},
				hand: {
					x: 0,
					y: 0,
					rotation: 0
				}
			},
			left: {
				wrist: {
					x: 0,
					y: 0,
					rotation: 0
				},
				hand: {
					x: 0,
					y: 0,
					rotation: 0
				}
			}
		};

		this.pants = {
			upper_right: {
				x: 0,
				y: 0,
				rotation: 0
			},
			lower_right: {
				x: 0,
				y: 0,
				rotation: 0
			},
			upper_left: {
				x: 0,
				y: 0,
				rotation: 0
			},
			lower_left: {
				x: 0,
				y: 0,
				rotation: 0
			},
			hip: {
				x: 0,
				y: 0,
            }
		};

		this.boots = {
			scale: 1,
			lower_left: {
				x: 0,
				y: 0,
				rotation: 0
			},
			foot_left: {
				x: 0,
				y: 0,
				rotation: 0
			},
			lower_right: {
				x: 0,
				y: 0,
				rotation: 0
			},
			foot_right: {
				x: 0,
				y: 0,
				rotation: 0
			}
		};
		this.eyes = {
			x: 0,
			y: 0
		};

		this.mouth = {
			teeths: {
				x: 0,
				y: 0
			},
			lips: {
				x: 0,
				y: 0
			}
		};

		this.facialHair = {
			x: 0,
			y: 0
		};

		this.ear = {
			x: 0,
			y: 0
		};
		this.nose = {
			x: 0,
			y: 0
		};

	}
}

module.exports = AppearancePositions;

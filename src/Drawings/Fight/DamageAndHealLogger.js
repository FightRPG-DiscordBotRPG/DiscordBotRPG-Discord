class DamageAndHealLogger {
    constructor() {
        this.hpDamage = 0;
        this.mpDamage = 0;
        this.energyDamage = 0;
        this.hpRegen = 0;
        this.mpRegen = 0;
        this.energyRegen = 0;
    }

    /**
     * 
     * @param {DamageAndHealLogger} log1
     * @param {DamageAndHealLogger} log2
     */
    static add(log1, log2) {
        log1.energyDamage += log2.energyDamage;
        log1.hpDamage += log2.hpDamage;
        log1.mpDamage += log2.mpDamage;
        log1.hpRegen += log2.hpRegen;
        log1.mpRegen += log2.mpRegen;
        log1.energyRegen += log2.energyRegen;
    }
}

module.exports = DamageAndHealLogger
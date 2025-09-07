// Equipment data structure
class Equipment {
    constructor(name, stats, maxScrollUses = 10) {
        this.name = name;
        this.stats = { ...stats };
        this.originalStats = { ...stats }; // Save original values
        this.maxScrollUses = maxScrollUses;
        this.currentScrollUses = maxScrollUses;
        this.zeroStats = {}; // Record which values have dropped to 0
    }

    // Update stats (+5 to -5 random change, minimum 0, won't increase after dropping to 0)
    updateStats() {
        const statNames = Object.keys(this.stats);
        const changes = {};
        const oldStats = { ...this.stats }; // Save values before update
        
        statNames.forEach(stat => {
            // If this value has dropped to 0, no more changes
            if (this.zeroStats[stat]) {
                changes[stat] = {
                    oldValue: oldStats[stat],
                    newValue: oldStats[stat],
                    change: 0
                };
                return;
            }
            
            // Only change attributes that originally had values (original value > 0)
            if (this.originalStats[stat] > 0) {
                const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
                const newValue = Math.max(0, this.stats[stat] + change);
                
                // If new value is 0, mark this value as dropped to 0
                if (newValue === 0) {
                    this.zeroStats[stat] = true;
                }
                
                changes[stat] = {
                    oldValue: oldStats[stat],
                    newValue: newValue,
                    change: newValue - oldStats[stat]
                };
                this.stats[stat] = newValue;
            } else {
                // If original value is 0, no change
                changes[stat] = {
                    oldValue: oldStats[stat],
                    newValue: oldStats[stat],
                    change: 0
                };
            }
        });
        
        return changes;
    }

    // Update stats (VL CS specific: +2 to -2 random change, minimum 0, won't increase after dropping to 0)
    updateStatsVL() {
        const statNames = Object.keys(this.stats);
        const changes = {};
        const oldStats = { ...this.stats }; // Save values before update
        
        statNames.forEach(stat => {
            // If this value has dropped to 0, no more changes
            if (this.zeroStats[stat]) {
                changes[stat] = {
                    oldValue: oldStats[stat],
                    newValue: oldStats[stat],
                    change: 0
                };
                return;
            }
            
            // Only change attributes that originally had values (original value > 0)
            if (this.originalStats[stat] > 0) {
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                const newValue = Math.max(0, this.stats[stat] + change);
                
                // If new value is 0, mark this value as dropped to 0
                if (newValue === 0) {
                    this.zeroStats[stat] = true;
                }
                
                changes[stat] = {
                    oldValue: oldStats[stat],
                    newValue: newValue,
                    change: newValue - oldStats[stat]
                };
                this.stats[stat] = newValue;
            } else {
                // If original value is 0, no change
                changes[stat] = {
                    oldValue: oldStats[stat],
                    newValue: oldStats[stat],
                    change: 0
                };
            }
        });
        
        return changes;
    }

    // Reduce scroll uses
    useScroll() {
        if (this.currentScrollUses > 0) {
            this.currentScrollUses--;
            return true;
        }
        return false;
    }

    // Check if scroll uses are available
    canUseScroll() {
        return this.currentScrollUses > 0;
    }
}

// Scroll class
class Scroll {
    constructor(name, successRate, type) {
        this.name = name;
        this.successRate = successRate;
        this.type = type;
    }

    // Attempt to use scroll
    attemptUse() {
        // If it's a 100% success rate scroll, return true directly
        if (this.successRate >= 1.0) {
            return true;
        }
        return Math.random() < this.successRate;
    }
}

// Game Manager
class GameManager {
    constructor() {
        // Get custom initial values, use default if none
        this.customStats = this.getCustomStats();
        this.equipment = new Equipment('Blackfist Cloak', this.customStats, 5);
        
        this.chaosScroll = new Scroll('Chaos Scroll', 0.6, 'chaos');
        this.vlChaosScroll = new Scroll('VL Chaos Scroll', 1.0, 'vl-chaos');
        this.whiteScroll = new Scroll('White Scroll', 1.0, 'white');
        
        this.currentDragScroll = null;
        this.statistics = {
            csUsed: 0,
            vlCsUsed: 0,
            wsUsed: 0
        };
        this.initializeEventListeners();
        this.updateDisplay();
    }

    // Get custom stat values
    getCustomStats() {
        const stats = {};
        
        // Get all possible stat input values
        const statInputs = [
            'custom-hp', 'custom-weapon-attack', 'custom-weapon-defence', 
            'custom-magic-defence', 'custom-str', 'custom-dex', 'custom-int', 'custom-luk', 'custom-speed'
        ];
        
        statInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input && input.value !== '' && parseInt(input.value) >= 0) {
                let statName = inputId.replace('custom-', '');
                // Handle special attribute name mapping
                if (statName === 'weapon-attack') statName = 'weaponAttack';
                if (statName === 'weapon-defence') statName = 'weaponDefence';
                if (statName === 'magic-defence') statName = 'magicDefence';
                stats[statName] = parseInt(input.value);
            }
        });
        
        return stats;
    }

    // Update custom stat input values
    updateCustomStatsInputs(equipmentName) {
        const defaultStats = this.getDefaultStatsForEquipment(equipmentName);
        
        // First clear all input fields
        const allStatInputs = [
            'custom-hp', 'custom-weapon-attack', 'custom-weapon-defence', 
            'custom-magic-defence', 'custom-str', 'custom-dex', 'custom-int', 'custom-luk', 'custom-speed'
        ];
        
        allStatInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = 0; // Set to 0 first
            }
        });
        
        // Then set the default values for this equipment
        Object.keys(defaultStats).forEach(statKey => {
            // Handle special attribute name mapping
            let inputId = statKey;
            if (statKey === 'weaponAttack') inputId = 'weapon-attack';
            if (statKey === 'weaponDefence') inputId = 'weapon-defence';
            if (statKey === 'magicDefence') inputId = 'magic-defence';
            
            const input = document.getElementById(`custom-${inputId}`);
            if (input) {
                input.value = defaultStats[statKey];
            }
        });
        
        // Update upgrade count
        const defaultScrollUses = this.getDefaultScrollUsesForEquipment(equipmentName);
        const scrollUsesInput = document.getElementById('custom-scroll-uses');
        if (scrollUsesInput) {
            scrollUsesInput.value = defaultScrollUses;
        }
    }

    // Get equipment default stats
    getDefaultStatsForEquipment(equipmentName) {
        switch(equipmentName) {
            case 'blackfist-cloak':
                return { hp: 120, weaponAttack: 10, weaponDefence: 43, magicDefence: 48 };
            case 'vl-shoes':
                return { weaponAttack: 2, weaponDefence: 90, magicDefence: 26 };
            case 'bwg':
                return { weaponAttack: 3 };
            case 'roa':
                return { str: 1, dex: 1, int: 1, luk: 1 };
            case 'spectrum-goggles':
                return { str: 1, dex: 1, speed: 1 };
            case 'stormcaster-gloves':
                return { weaponAttack: 5, weaponDefence: 5, magicDefence: 5 };
            case 'von-leon-belt':
                return { str: 2, dex: 2, int: 2, luk: 2, weaponAttack: 2, weaponDefence: 150, magicDefence: 30 };
            case 'red-christmas-sock':
                return { weaponAttack: 1, weaponDefence: 14, magicDefence: 6 };
            default:
                return { hp: 120, weaponAttack: 10, weaponDefence: 43, magicDefence: 48 };
        }
    }

    // Get equipment default upgrade count
    getDefaultScrollUsesForEquipment(equipmentName) {
        switch(equipmentName) {
            case 'blackfist-cloak':
                return 5;
            case 'vl-shoes':
                return 6;
            case 'bwg':
                return 6;
            case 'roa':
                return 1;
            case 'spectrum-goggles':
                return 5;
            case 'stormcaster-gloves':
                return 5;
            case 'von-leon-belt':
                return 4;
            case 'red-christmas-sock':
                return 7;
            default:
                return 5;
        }
    }

    // Get custom upgrade count
    getCustomScrollUses() {
        const input = document.getElementById('custom-scroll-uses');
        if (input && input.value) {
            const value = parseInt(input.value);
            return Math.max(0, Math.min(50, value)); // Limit between 0-50
        }
        return 5; // Default value
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Scroll drag events
        const scrollItems = document.querySelectorAll('.scroll-item');
        scrollItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.currentDragScroll = e.target.id;
                e.target.classList.add('dragging');
            });

            item.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
                this.currentDragScroll = null;
            });
        });

        // Equipment drag events - only support drag usage
        this.setupDragEvents();

        // Remove click functionality, only keep drag functionality

        // Modal events
        document.getElementById('confirm-yes').addEventListener('click', () => {
            this.useScroll();
            this.hideModal();
        });

        document.getElementById('confirm-no').addEventListener('click', () => {
            this.hideModal();
        });

        // Click modal background to close
        document.getElementById('confirm-modal').addEventListener('click', (e) => {
            if (e.target.id === 'confirm-modal') {
                this.hideModal();
            }
        });

        // Custom stats apply button
        document.getElementById('apply-custom-stats').addEventListener('click', () => {
            this.applyCustomStats();
        });

        // Reset statistics button
        document.getElementById('reset-stats').addEventListener('click', () => {
            this.resetStatistics();
        });
    }

    // Show confirmation modal
    showConfirmModal() {
        const modal = document.getElementById('confirm-modal');
        const message = document.getElementById('modal-message');
        const useWhiteScroll = document.getElementById('use-white-scroll');
        
        // Show different messages based on current dragged scroll
        if (this.currentDragScroll === 'vl-chaos-scroll') {
            message.textContent = 'Use VL Chaos Scroll?';
        } else {
            message.textContent = 'Use Chaos Scroll?';
        }
        
        useWhiteScroll.checked = false;
        modal.style.display = 'block';
    }

    // Hide modal
    hideModal() {
        document.getElementById('confirm-modal').style.display = 'none';
    }

    // Setup drag events
    setupDragEvents() {
        const equipmentSlot = document.getElementById('equipment-slot');
        const equipmentItem = document.getElementById('blackfist-cloak');
        
        console.log('Setup drag events, equipment slot:', equipmentSlot, 'equipment:', equipmentItem);
        
        // Add drag events for both equipment slot and equipment itself
        [equipmentSlot, equipmentItem].forEach(element => {
            if (element) {
                element.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    equipmentSlot.classList.add('drag-over');
                    console.log('Drag over equipment area');
                });

                element.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    equipmentSlot.classList.remove('drag-over');
                    console.log('Drag leave equipment area');
                });

                element.addEventListener('drop', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    equipmentSlot.classList.remove('drag-over');
                    console.log('Drag drop, current scroll:', this.currentDragScroll);
                    
                    // Handle chaos scroll and VL chaos scroll drag
                    if (this.currentDragScroll === 'chaos-scroll') {
                        console.log('Show confirmation dialog');
                        this.showConfirmModal();
                    } else if (this.currentDragScroll === 'vl-chaos-scroll') {
                        console.log('VL Chaos Scroll - handled by setupDragEvents');
                        // VL CS handled by setupDirectDragEvents, not here
                    } else {
                        console.log('Not a chaos scroll, ignore');
                    }
                });
            }
        });
    }

    // Direct scroll use (VL CS specific, no white scroll prompt)
    useScrollDirect() {
        if (!this.equipment.canUseScroll()) {
            this.addLog('Equipment cannot use more scrolls!', 'failure');
            return;
        }

        const isVlChaosScroll = this.currentDragScroll === 'vl-chaos-scroll';
        
        if (isVlChaosScroll) {
            // VL CS 100% success, direct use
            const changes = this.equipment.updateStatsVL();
            const oldScrollUses = this.equipment.currentScrollUses;
            this.equipment.useScroll();
            const newScrollUses = this.equipment.currentScrollUses;
            
            // Record statistics
            this.statistics.vlCsUsed++;
            
            this.addLog('VL Chaos Scroll used successfully! Equipment stats changed:', 'success');
            this.logStatChanges(changes);
            
            // Only show success when upgrade count decreases by 1
            if (oldScrollUses - newScrollUses === 1) {
                this.showSuccessEffect();
            } else {
                this.showFailureEffect(false);
            }
        } else {
            // Regular CS, use original logic
            const scrollToUse = this.chaosScroll;
            const isSuccess = scrollToUse.attemptUse();
            
            if (isSuccess) {
                // Successfully used scroll
                const changes = this.equipment.updateStats();
                const oldScrollUses = this.equipment.currentScrollUses;
                this.equipment.useScroll();
                const newScrollUses = this.equipment.currentScrollUses;
                
                // Record statistics
                this.statistics.csUsed++;
                
                this.addLog('Chaos Scroll used successfully! Equipment stats changed:', 'success');
                this.logStatChanges(changes);
                
                // Only show success when upgrade count decreases by 1
                if (oldScrollUses - newScrollUses === 1) {
                    this.showSuccessEffect();
                } else {
                    this.showFailureEffect(false);
                }
            } else {
                // Failed
                this.statistics.csUsed++;
                
                const oldScrollUses = this.equipment.currentScrollUses;
                this.equipment.useScroll();
                const newScrollUses = this.equipment.currentScrollUses;
                
                this.addLog('Chaos Scroll failed, upgrade count -1', 'failure');
                
                // Only show success when upgrade count decreases by 1, otherwise show failure
                if (oldScrollUses - newScrollUses === 1) {
                    this.showSuccessEffect();
                } else {
                    this.showFailureEffect(true);
                }
            }
        }

        this.updateDisplay();
        this.updateStatistics();
    }

    // Use scroll
    useScroll() {
        if (!this.equipment.canUseScroll()) {
            this.addLog('Equipment cannot use more scrolls!', 'failure');
            return;
        }

        const useWhiteScroll = document.getElementById('use-white-scroll').checked;
        const isVlChaosScroll = this.currentDragScroll === 'vl-chaos-scroll';
        
        // Choose which scroll to use
        const scrollToUse = isVlChaosScroll ? this.vlChaosScroll : this.chaosScroll;
        const isSuccess = scrollToUse.attemptUse();
        
        if (isSuccess) {
            // Successfully used scroll
            const changes = isVlChaosScroll ? this.equipment.updateStatsVL() : this.equipment.updateStats();
            const oldScrollUses = this.equipment.currentScrollUses;
            this.equipment.useScroll();
            const newScrollUses = this.equipment.currentScrollUses;
            
            // Record statistics
            if (isVlChaosScroll) {
                this.statistics.vlCsUsed++;
            } else {
                this.statistics.csUsed++;
            }
            if (useWhiteScroll) {
                this.statistics.wsUsed++;
            }
            
            const scrollName = isVlChaosScroll ? 'VL Chaos Scroll' : 'Chaos Scroll';
            this.addLog(`${scrollName} used successfully! Equipment stats changed:`, 'success');
            this.logStatChanges(changes);
            
            // Only show success when upgrade count decreases by 1
            if (oldScrollUses - newScrollUses === 1) {
                this.showSuccessEffect();
            } else {
                this.showFailureEffect(false);
            }
            
            if (useWhiteScroll) {
                this.addLog('White Scroll protected the upgrade count!', 'info');
            }
        } else {
            // Failed (only regular CS can fail, VL CS has 100% success rate)
            // Record statistics (also record CS use on failure)
            this.statistics.csUsed++;
            if (useWhiteScroll) {
                this.statistics.wsUsed++;
            }
            
            if (useWhiteScroll) {
                this.addLog('Chaos Scroll failed, but White Scroll protected the upgrade count!', 'info');
                // Failed but protected, only show brief failure effect
                this.showFailureEffect(false);
            } else {
                const oldScrollUses = this.equipment.currentScrollUses;
                this.equipment.useScroll();
                const newScrollUses = this.equipment.currentScrollUses;
                
                this.addLog('Chaos Scroll failed, upgrade count -1', 'failure');
                
                // Only show success when upgrade count decreases by 1, otherwise show failure
                if (oldScrollUses - newScrollUses === 1) {
                    this.showSuccessEffect();
                } else {
                    this.showFailureEffect(true);
                }
            }
        }

        this.updateDisplay();
        this.updateStatistics();
    }

    // Update statistics display
    updateStatistics() {
        document.getElementById('cs-count').textContent = this.statistics.csUsed;
        document.getElementById('vl-cs-count').textContent = this.statistics.vlCsUsed;
        document.getElementById('ws-count').textContent = this.statistics.wsUsed;
        document.getElementById('total-scrolls').textContent = this.statistics.csUsed + this.statistics.vlCsUsed + this.statistics.wsUsed;
    }

    // Reset statistics
    resetStatistics() {
        this.statistics = {
            csUsed: 0,
            vlCsUsed: 0,
            wsUsed: 0
        };
        this.updateStatistics();
        this.addLog('Statistics reset to zero', 'info');
    }

    // Log stat changes
    logStatChanges(changes) {
        const statNames = {
            hp: 'HP',
            weaponAttack: 'Weapon Attack',
            weaponDefence: 'Weapon Defence',
            magicDefence: 'Magic Defence',
            str: 'STR',
            dex: 'DEX',
            int: 'INT',
            luk: 'LUK',
            speed: 'Speed'
        };

        Object.keys(changes).forEach(stat => {
            const changeData = changes[stat];
            
            if (changeData.change === 0 && this.equipment.zeroStats[stat]) {
                // If value has dropped to 0, show special message
                this.addLog(`  ${statNames[stat]}: ${changeData.oldValue} (reached 0, cannot increase)`, 'info');
            } else if (changeData.newValue === 0) {
                // If value drops to 0, show hidden message
                this.addLog(`  ${statNames[stat]}: ${changeData.oldValue} → 0 (hidden)`, 'info');
            } else {
                const changeText = changeData.change > 0 ? `+${changeData.change}` : changeData.change.toString();
                this.addLog(`  ${statNames[stat]}: ${changeData.oldValue} → ${changeData.newValue} (${changeText})`, 'info');
            }
        });
    }

    // Show result flash
    showResultFlash(text, type) {
        const resultFlash = document.getElementById('result-flash');
        const resultText = document.getElementById('result-text');
        
        resultText.textContent = text;
        resultText.className = `result-text ${type}`;
        
        resultFlash.classList.add('show');
        
        setTimeout(() => {
            resultFlash.classList.remove('show');
        }, 500);
    }

    // Add log
    addLog(message, type = 'info') {
        const logContainer = document.getElementById('log-container');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        logContainer.insertBefore(logEntry, logContainer.firstChild);
        
        // Limit log count
        const logs = logContainer.querySelectorAll('.log-entry');
        if (logs.length > 50) {
            logContainer.removeChild(logs[logs.length - 1]);
        }
    }

    // Show success effect
    showSuccessEffect() {
        const equipmentItem = document.getElementById('blackfist-cloak');
        
        // Remove previous state classes
        equipmentItem.classList.remove('failure', 'burned', 'enhanced');
        
        // Add success effect
        equipmentItem.classList.add('success');
        
        // Completely restore normal state after animation
        setTimeout(() => {
            equipmentItem.classList.remove('success');
            // No longer add persistent effects, let equipment return to normal state
        }, 100);
        
        // Show success flash
        this.showResultFlash('SUCCESS', 'success');
    }

    // Show failure effect
    showFailureEffect(isBurned = false) {
        const equipmentItem = document.getElementById('blackfist-cloak');
        
        // Remove previous state classes
        equipmentItem.classList.remove('success', 'enhanced', 'burned');
        
        if (isBurned) {
            // Burned effect
            equipmentItem.classList.add('failure');
            
            // Restore normal state after animation
            setTimeout(() => {
                equipmentItem.classList.remove('failure');
                // No longer add persistent burned state, let equipment return to normal
            }, 2000);
            
            // Show failure flash
            this.showResultFlash('FAIL', 'failure');
        } else {
            // Brief failure effect (when protected)
            equipmentItem.classList.add('failure');
            
            setTimeout(() => {
                equipmentItem.classList.remove('failure');
            }, 1000);
        }
    }

    // Update display
    updateDisplay() {
        // Dynamically generate equipment stat display
        this.generateStatsDisplay();
        
        // Update scroll use count
        document.getElementById('scroll-uses').textContent = this.equipment.currentScrollUses;
        
        // Update equipment background color
        this.updateEquipmentBackground();
        
        // Update statistics display
        this.updateStatistics();
        
        // Add update animation
        const equipmentItem = document.getElementById('blackfist-cloak');
        equipmentItem.classList.add('updated');
        setTimeout(() => {
            equipmentItem.classList.remove('updated');
        }, 600);
    }

    // Update equipment background color
    updateEquipmentBackground() {
        const equipmentItem = document.getElementById('blackfist-cloak');
        if (!equipmentItem) return;
        
        const weaponAttack = this.equipment.stats.weaponAttack || 0;
        const equipmentName = this.equipment.name;
        
        // Remove all background color classes
        equipmentItem.classList.remove('equipment-blue', 'equipment-purple', 'equipment-gold');
        
        // Add corresponding background color based on equipment type and weapon attack value
        if (equipmentName === 'Blackfist Cloak') {
            // Blackfist Cloak color rules
            if (weaponAttack >= 22) {
                equipmentItem.classList.add('equipment-gold');
            } else if (weaponAttack >= 15) {
                equipmentItem.classList.add('equipment-purple');
            } else if (weaponAttack >= 8) {
                equipmentItem.classList.add('equipment-blue');
            }
        } else if (equipmentName === 'VL Shoes') {
            // VL Shoes color rules
            if (weaponAttack >= 20) {
                equipmentItem.classList.add('equipment-gold');
            } else if (weaponAttack >= 13) {
                equipmentItem.classList.add('equipment-purple');
            } else if (weaponAttack >= 6) {
                equipmentItem.classList.add('equipment-blue');
            }
        } else if (equipmentName === 'Stormcaster Gloves') {
            // Stormcaster Gloves color rules
            if (weaponAttack >= 23) {
                equipmentItem.classList.add('equipment-gold');
            } else if (weaponAttack >= 16) {
                equipmentItem.classList.add('equipment-purple');
            } else if (weaponAttack >= 10) {
                equipmentItem.classList.add('equipment-blue');
            }
        } else if (equipmentName === 'Von Leon\'s Belt') {
            // Von Leon's Belt color rules
            if (weaponAttack >= 8) {
                equipmentItem.classList.add('equipment-gold');
            } else if (weaponAttack >= 5) {
                equipmentItem.classList.add('equipment-purple');
            } else if (weaponAttack >= 3) {
                equipmentItem.classList.add('equipment-blue');
            }
        } else if (equipmentName === 'Red Christmas Sock') {
            // Red Christmas Sock color rules
            if (weaponAttack >= 19) {
                equipmentItem.classList.add('equipment-gold');
            } else if (weaponAttack >= 12) {
                equipmentItem.classList.add('equipment-purple');
            } else if (weaponAttack >= 5) {
                equipmentItem.classList.add('equipment-blue');
            }
        } else if (equipmentName === 'BWG') {
            // BWG color rules
            if (weaponAttack >= 18) {
                equipmentItem.classList.add('equipment-gold');
            } else if (weaponAttack >= 11) {
                equipmentItem.classList.add('equipment-purple');
            } else if (weaponAttack >= 3) {
                equipmentItem.classList.add('equipment-blue');
            }
        } else if (equipmentName === 'Spectrum Goggles') {
            // Spectrum Goggles color rules: based on sum of four attributes
            const str = this.equipment.stats.str || 0;
            const dex = this.equipment.stats.dex || 0;
            const int = this.equipment.stats.int || 0;
            const luk = this.equipment.stats.luk || 0;
            const totalStats = str + dex + int + luk;
            
            if (totalStats >= 36) {
                equipmentItem.classList.add('equipment-gold');
            } else if (totalStats >= 22) {
                equipmentItem.classList.add('equipment-purple');
            } else if (totalStats >= 6) {
                equipmentItem.classList.add('equipment-blue');
            }
        }
    }

    // Generate stat display
    generateStatsDisplay() {
        const statsContainer = document.getElementById('equipment-stats');
        const stats = this.equipment.stats;
        
        // Clear existing content
        statsContainer.innerHTML = '';
        
        // Stat name mapping
        const statNames = {
            hp: 'HP',
            weaponAttack: 'Weapon Attack',
            weaponDefence: 'Weapon Defence',
            magicDefence: 'Magic Defence',
            str: 'STR',
            dex: 'DEX',
            int: 'INT',
            luk: 'LUK',
            speed: 'Speed'
        };
        
        // Dynamically generate display based on equipment stats, only show non-zero stats
        Object.keys(stats).forEach(statKey => {
            if (stats[statKey] !== undefined && stats[statKey] > 0) {
                const statDiv = document.createElement('div');
                statDiv.className = 'stat';
                statDiv.innerHTML = `${statNames[statKey]}: <span id="${statKey}">${stats[statKey]}</span>`;
                statsContainer.appendChild(statDiv);
            }
        });
    }

    // Update single stat display
    updateStatDisplay(statId, value) {
        const element = document.getElementById(statId);
        if (!element) return;
        
        element.textContent = value;
        
        // If value is 0, hide the stat
        if (value === 0) {
            const statDiv = element.parentElement;
            if (statDiv && statDiv.classList.contains('stat')) {
                statDiv.style.display = 'none';
            }
        } else {
            // If value is not 0, show the stat
            const statDiv = element.parentElement;
            if (statDiv && statDiv.classList.contains('stat')) {
                statDiv.style.display = '';
            }
            
            // If value has dropped to 0, add special style
            if (this.equipment.zeroStats[statId]) {
                element.style.color = '#999';
                element.style.textDecoration = 'line-through';
                element.title = 'This stat reached 0, cannot increase';
            } else {
                element.style.color = '';
                element.style.textDecoration = '';
                element.title = '';
            }
        }
    }

    // Apply custom stats
    applyCustomStats() {
        const newStats = this.getCustomStats();
        const newScrollUses = this.getCustomScrollUses();
        
        // Validate input values
        if (!this.validateCustomStats(newStats)) {
            return;
        }
        
        // Create new equipment instance
        this.equipment = new Equipment('Blackfist Cloak', newStats, newScrollUses);
        this.updateDisplay();
        this.addLog(`Custom stats applied successfully! Upgrades available: ${newScrollUses}`, 'success');
        
        // Show success effect
        this.showSuccessEffect();
    }

    // Validate custom stats
    validateCustomStats(stats) {
        const statNames = {
            hp: 'HP',
            weaponAttack: 'Weapon Attack',
            weaponDefence: 'Weapon Defence',
            magicDefence: 'Magic Defence',
            str: 'STR',
            dex: 'DEX',
            int: 'INT',
            luk: 'LUK',
            speed: 'Speed'
        };
        
        for (const [statKey, value] of Object.entries(stats)) {
            if (value < 0 || value > 999) {
                this.addLog(`Invalid ${statNames[statKey] || statKey} value: ${value}. Must be between 0-999.`, 'failure');
                return false;
            }
        }
        
        return true;
    }

    // Reset equipment (for testing)
    resetEquipment() {
        // Get currently selected equipment
        const equipmentSelect = document.getElementById('equipment-select');
        const currentEquipment = equipmentSelect ? equipmentSelect.value : 'blackfist-cloak';
        
        // Reset to custom stats or default values
        const resetStats = this.getCustomStats();
        const resetScrollUses = this.getCustomScrollUses();
        
        // Create new equipment instance based on current equipment
        const equipmentName = this.getEquipmentDisplayName(currentEquipment);
        this.equipment = new Equipment(equipmentName, resetStats, resetScrollUses);
        this.updateDisplay();
        this.addLog(`${equipmentName} reset to initial state, all stats restored. Upgrades available: ${resetScrollUses}`, 'info');
    }

    // Get equipment display name
    getEquipmentDisplayName(equipmentValue) {
        const nameMap = {
            'blackfist-cloak': 'Blackfist Cloak',
            'vl-shoes': 'VL Shoes',
            'bwg': 'BWG',
            'roa': 'ROA',
            'spectrum-goggles': 'Spectrum Goggles',
            'stormcaster-gloves': 'Stormcaster Gloves',
            'von-leon-belt': 'Von Leon\'s Belt',
            'red-christmas-sock': 'Red Christmas Sock'
        };
        return nameMap[equipmentValue] || 'Blackfist Cloak';
    }

    // Add new equipment (expansion feature)
    addEquipment(name, stats, maxScrollUses = 10) {
        // Here you can implement the logic for adding new equipment
        this.addLog(`New equipment ${name} added!`, 'info');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
    
    // Direct setup drag events (ensure setup immediately after page load)
    setTimeout(() => {
        setupDirectDragEvents();
    }, 200);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' && e.ctrlKey) {
            e.preventDefault();
            window.gameManager.resetEquipment();
        }
    });
    
    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Equipment (Ctrl+R)';
    resetButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 15px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    resetButton.addEventListener('click', () => {
        window.gameManager.resetEquipment();
    });
    
    resetButton.addEventListener('mouseenter', () => {
        resetButton.style.transform = 'translateY(-2px)';
        resetButton.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
    });
    
    resetButton.addEventListener('mouseleave', () => {
        resetButton.style.transform = 'translateY(0)';
        resetButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    });
    
    document.body.appendChild(resetButton);
});

// Direct setup drag events function
function setupDirectDragEvents() {
    console.log('Start setting up direct drag events');
    
    const equipmentSlot = document.getElementById('equipment-slot');
    const equipmentItem = document.getElementById('blackfist-cloak');
    const chaosScroll = document.getElementById('chaos-scroll');
    
    console.log('Element check:', {
        equipmentSlot: equipmentSlot,
        equipmentItem: equipmentItem,
        chaosScroll: chaosScroll
    });
    
    if (!equipmentSlot || !equipmentItem || !chaosScroll) {
        console.error('Cannot find necessary elements');
        return;
    }
    
    // Setup scroll drag start event
    chaosScroll.addEventListener('dragstart', (e) => {
        console.log('Start dragging chaos scroll');
        window.currentDragScroll = 'chaos-scroll';
        if (window.gameManager) {
            window.gameManager.currentDragScroll = 'chaos-scroll';
        }
        e.target.classList.add('dragging');
    });
    
    chaosScroll.addEventListener('dragend', (e) => {
        console.log('End dragging chaos scroll');
        e.target.classList.remove('dragging');
        window.currentDragScroll = null;
        if (window.gameManager) {
            window.gameManager.currentDragScroll = null;
        }
    });
    
    // Setup VL chaos scroll drag event
    const vlChaosScroll = document.getElementById('vl-chaos-scroll');
    if (vlChaosScroll) {
        vlChaosScroll.addEventListener('dragstart', (e) => {
            console.log('Start dragging VL chaos scroll');
            window.currentDragScroll = 'vl-chaos-scroll';
            if (window.gameManager) {
                window.gameManager.currentDragScroll = 'vl-chaos-scroll';
            }
            e.target.classList.add('dragging');
        });
        
        vlChaosScroll.addEventListener('dragend', (e) => {
            console.log('End dragging VL chaos scroll');
            e.target.classList.remove('dragging');
            window.currentDragScroll = null;
            if (window.gameManager) {
                window.gameManager.currentDragScroll = null;
            }
        });
    }
    
    // Setup equipment drag event
    [equipmentSlot, equipmentItem].forEach(element => {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            equipmentSlot.classList.add('drag-over');
            console.log('Drag over equipment area');
        });
        
        element.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            equipmentSlot.classList.remove('drag-over');
            console.log('Drag leave equipment area');
        });
        
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            equipmentSlot.classList.remove('drag-over');
            console.log('Drag drop, current scroll:', window.currentDragScroll);
            
            if (window.currentDragScroll === 'chaos-scroll') {
                console.log('Show confirmation dialog');
                if (window.gameManager && window.gameManager.showConfirmModal) {
                    window.gameManager.showConfirmModal();
                } else {
                    console.error('gameManager or showConfirmModal does not exist');
                }
            } else if (window.currentDragScroll === 'vl-chaos-scroll') {
                console.log('Direct use VL Chaos Scroll');
                if (window.gameManager && window.gameManager.useScrollDirect) {
                    window.gameManager.useScrollDirect();
                } else {
                    console.error('gameManager or useScrollDirect does not exist');
                }
            }
        });
    });
    
    console.log('Direct drag events setup complete');
}

class STAExtendedTaskSheetGMJerry extends ActorSheet {
	innerSheetData = new STAExtendedTaskInfo();

	/** @override */
	static get defaultOptions() {
        if (game.user.isGM)
        {
            return mergeObject(super.defaultOptions, {
                classes: ['sta', 'sheet', 'actor', 'extendedtask'],
                template: "modules/sta-gmjerry-extended-task/templates/extended-task-sheet-gmjerry.html",
                width: 800,
                height: 600
            });
        } else {
            return mergeObject(super.defaultOptions, {
                classes: ['sta', 'sheet', 'actor', 'extendedtask'],
                template: "modules/sta-gmjerry-extended-task/templates/extended-task-sheet-summary.html",
                width: 600,
                height: 300
            });
        }
    }

	_onClickControlButton(event) {
		const button = event.currentTarget;
		const action = button.dataset.action;

		switch (action) {
			case "hide-description":
				this._hideDescription();
				break;
		}
	}

	_hideDescription() {
		let sheetData = this.object;

		if (sheetData.system.extendedTaskDescriptionDisplayButton == 'fa-minus') {
			sheetData.system.extendedTaskDescriptionDisplayButton = 'fa-plus'
			sheetData.system.extendedTaskDescriptionDisplay = 'none !important';
		} else {
			sheetData.system.extendedTaskDescriptionDisplayButton = 'fa-minus'
			sheetData.system.extendedTaskDescriptionDisplay = '';
		}

		this.render();
	}

	/* -------------------------------------------- */
	/** @override 
	get template() {
        if (game.user.isGM)
        {
            return `modules/sta-gmjerry-extended-task/templates/extended-task-sheet-gmjerry.html`;
        }

        return `modules/sta-gmjerry-extended-task/templates/extended-task-sheet-summary.html`;
	}

	/* -------------------------------------------- */

	/** @override */
	getData() {
		const context = super.getData();

		if (context?.actor?.type != 'extendedtask') {
			return context;
		}
		
		let sheetData = context.actor;

		this.object.dtypes = ['String', 'Number', 'Boolean'];

		if (sheetData.system.magnitude <= 0) sheetData.system.magnitude = 10;
		if (sheetData.system.resistance <= 0) sheetData.system.resistance = 0;
		if (sheetData.system.difficulty <= 0) sheetData.system.difficulty = 2;
		if (sheetData.system.breakthroughCount <= 0) sheetData.system.breakthroughCount = 0;
		if (sheetData.system.breakthroughThreshold <= 0) sheetData.system.breakthroughThreshold = 0;
		if (sheetData.system.complicationRange <= 0) sheetData.system.complicationRange = 0;
		if (sheetData.system.workCount <= 0) sheetData.system.workCount = 0;

		if (sheetData.system.workProgress <= 0) sheetData.system.workProgress = 0;
		if (sheetData.system.breakthroughProgress <= 0) sheetData.system.breakthroughProgress = 0;

		if (!sheetData.system.extendedTaskDescriptionDisplayButton) {
			sheetData.system.extendedTaskDescriptionDisplayButton = 'fa-plus';
			sheetData.system.extendedTaskDescriptionDisplay = 'none !important';
		}

		if (!game.user.isGM && this.actor.limited) return sheetData;

		// CALCULATIONS
		const magnitude = sheetData.system.magnitude;
		const difficulty = sheetData.system.difficulty;
		const resistance = sheetData.system.resistance;
		const workCount = Math.ceil(magnitude * difficulty);
		const breakthroughCount = magnitude;
		const breakthroughThreshold = (difficulty + resistance) + 5;

		sheetData.system.criticalFail = 20 - sheetData.system.complicationRange;
		sheetData.system.criticalSuccess = 1;
		sheetData.system.workCount = workCount;
		sheetData.system.breakthroughCount = breakthroughCount;
		sheetData.system.breakthroughThreshold = breakthroughThreshold;

		this.innerSheetData = sheetData;

		return sheetData;
	}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

        if (game.user.isGM || !this.actor.limited) {
		    html
                .find("button.hide")
			    .on("click", this._onClickControlButton.bind(this));
        }

		let _this = this;

		function renderExtendedWorkTracks(TYPE, boxType, buttonCount, workProgress) {

			const fulldiv1 = document.createElement('div');
			const cellCount = 10;
			fulldiv1.style = 'width: 100%;';
			fulldiv1.className = 'bar extendedtask';

			for (let i = 0; i < buttonCount; i++) {
				// build a row of numbers for the extended task track
				const rowdiv = document.createElement('div');
				rowdiv.className = 'row2';
				rowdiv.style = 'width: 100%;';
				for (let j = 0; j < cellCount; j++) {
					const inputdiv = document.createElement('div');
					if (i * cellCount + j + 1 <= buttonCount) {
						inputdiv.id = 'box' + boxType + '-' + (i * cellCount + j + 1);
						inputdiv.className = 'box box' + boxType + ' extendedtask';
						inputdiv.innerHTML = (i * cellCount + j + 1);
					}
					if (i * cellCount + j + 1 <= workProgress) {
						inputdiv.className += " selected";
						inputdiv.setAttribute("data-selected", true);
					}
					inputdiv.style = 'width: calc(100% / ' + cellCount + ');';
					rowdiv.appendChild(inputdiv);
				}
				// append to the div that will be put in the renderer div on extended-task-sheet.html
				fulldiv1.appendChild(rowdiv);
			}

			html.find('#renderer' + TYPE)[0].innerHTML = '';
			html.find('#renderer' + TYPE)[0].appendChild(fulldiv1);
		}
		renderExtendedWorkTracks('WORK', 'Work', _this.innerSheetData.system.workCount,         _this.innerSheetData.system.workProgress);
		renderExtendedWorkTracks('BT',   'Bt',   _this.innerSheetData.system.breakthroughCount, _this.innerSheetData.system.btProgress);

        if (game.user.isGM) {
            function selectBoxes(boxType, boxHidden) {
                html.find('[id^="box' + boxType + '"]').click((ev) => {
                    // If the player has limited access to the actor, they should not click this.
                    //if (!game.user.isGM && this.actor.limited) return;

                    let total = '';
                    const newTotalObject = $(ev.currentTarget)[0];
                    const newTotal = newTotalObject.id.replace(/\D/g, '');
                    if (newTotalObject.getAttribute('data-selected') === 'true') {
                        const nextCheck = 'box' + boxType + '-' + (parseInt(newTotal) + 1);
                        if (!html.find('#' + nextCheck)[0] || html.find('#' + nextCheck)[0].getAttribute('data-selected') != 'true') {
                            html.find('#' + boxHidden + '-progress')[0].value = html.find('#' + boxHidden + '-progress')[0].value - 1;
                            _this.submit();
                        } else {
                            total = html.find('#' + boxHidden + '-progress')[0].value;
                            if (total != newTotal) {
                                html.find('#' + boxHidden + '-progress')[0].value = newTotal;
                                _this.submit();
                            }
                        }
                    } else {
                        total = html.find('#' + boxHidden + '-progress')[0].value;
                        if (total != newTotal) {
                            html.find('#' + boxHidden + '-progress')[0].value = newTotal;
                            _this.submit();
                        }
                    }
                });
            }

            selectBoxes('Work', 'work');
            selectBoxes('Bt', 'bt');
        }
	}
}

Actors.registerSheet('sta', STAExtendedTaskSheetGMJerry, { types: ['extendedtask'] });

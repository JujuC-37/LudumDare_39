// -----------------------------------------------------------------------------
// ---------------------------------  Display ----------------------------------
// -----------------------------------------------------------------------------

// ----- initial -----
displayToolsList();
displayMap();
displayInitialInformationsCity();

// ----- game -----
updateDisplayPerFrequency(performance.now());


// -----------------------------------------------------------------------------
// ----------------------------------  Events ----------------------------------
// -----------------------------------------------------------------------------

let toolsList = document.getElementsByClassName('selectableTool');
let tilesMap = document.getElementsByClassName('tileMap');
let idChosenTool;
let idReadTool;
let idChosenTile;

const $townhallPopup = document.getElementById('townhallPopup');
let $closeTownhallPopup = document.getElementById('closeTownhallPopup');

$closeTownhallPopup.addEventListener('click', function(event) {
    $townhallPopup.classList.add('hidden');
}, true);

for(let tool of toolsList) {
    // ----- Click -----
    tool.addEventListener('click', function(event) {
        event.stopPropagation(); 
        idChosenTool = tool.id;
        
        chosenTool = document.getElementById(idChosenTool);
        // reset style for all tools
        for(let t of toolsList){
            t.classList.remove('selectedTool');
        }
        // add style for selected tool
        chosenTool.classList.add('selectedTool');

        displayInformationsTool(idChosenTool);
    });

    // ----- Mouseover -----
    tool.addEventListener('mouseover', function(event){
        event.stopPropagation();
        idReadTool = tool.id;
        displayInformationsTool(idReadTool);
    });

    // ----- Mouseout -----
    tool.addEventListener('mouseout', function(event) {
        event.stopPropagation();
        deleteInformationsTool();

        if(idChosenTool){
            displayInformationsTool(idChosenTool);
        }
    })
}

for(let tile of tilesMap) {
    tile.addEventListener('click', function(event){
        event.stopPropagation();
        idChosenTile = tile.id.split('_')[1];

        if(idChosenTool) {
            if (idChosenTool === "removeTool") removeBuilding(tile, idChosenTile);
            else constructBuilding(tile, idChosenTile, idChosenTool);
        }
        else{
            displayInformationsTile(idChosenTile);
        }
    })
}

document.addEventListener('click', function(event){
    idChosenTool = null;
    deleteInformationsTool();

    for(let tool of toolsList){
        tool.classList.remove('selectedTool');
    }
});
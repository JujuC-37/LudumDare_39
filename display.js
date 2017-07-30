
// ----------------------------  Display ----------------------------

createToolsList();
createMap();
createInformationsCityBar();

displayInformationsPerFrequency(performance.now());

// ----------------------------  Events ----------------------------

let displayedToolsList = document.getElementsByClassName('selectable');
let displayedTiles = document.getElementsByClassName('tile');
let idChosenTool;
let idChosenTile;

for(let tool of displayedToolsList) {
    tool.addEventListener('click', function(event) {
        event.stopPropagation(); 
        idChosenTool = tool.id;
    });

    tool.addEventListener('mouseover', function(event){
        event.stopPropagation();
        idChosenTool = tool.id;
        displayInformationsTool(idChosenTool);
    });

    tool.addEventListener('mouseout', function(event) {
        event.stopPropagation();
        idChosenTool = tool.id;
        deleteInformationsTool(idChosenTool);
    })
}

for(let tile of displayedTiles) {
    tile.addEventListener('click', function(event){
        event.stopPropagation();
        idChosenTile = tile.id.split('_')[1];

        if(idChosenTool) {
            if (idChosenTool === "removeTool") removeBuilding(tile, idChosenTile);
            else constructBuilding(tile, idChosenTile, idChosenTool);
        }
        else{
            alert("In development");
        }
    })
}

document.addEventListener('click', function(event){
    idChosenTool = null;
});
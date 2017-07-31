
// ----------------------------  Display ----------------------------

createToolsList();
createMap();
createInformationsCityBar();

displayInformationsPerFrequency(performance.now());

// ----------------------------  Events ----------------------------

let toolsList = document.getElementsByClassName('selectableTool');
let tilesMap = document.getElementsByClassName('tileMap');
let idChosenTool;
let idChosenTile;

for(let tool of toolsList) {
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

for(let tile of tilesMap) {
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
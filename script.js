const widthMap = 5;
const heightMap = 5;

const buildings = [
    {id: 'farm', class: 'building', name: 'Farm', picture: 'building_farm.svg'},
    {id: 'hunter', class: 'building', name: 'Hunter', picture: 'building_hunter.svg'},
    {id: 'fishery', class: 'building', name: 'Fishery', picture: 'building_fishery.svg'},
    {id: 'windmill', class: 'building', name: 'Windmill', picture: 'building_windmill.svg'},
    {id: 'warehouse', class: 'building', name: 'Warehouse', picture: 'building_warehouse.svg'},
];

/* ----------------------------------- Display ----------------------------------- */

buildings.forEach(function(building){
    var divBuilding = document.createElement('div');
    divBuilding.setAttribute('id', building.id);
    divBuilding.setAttribute('class', building.class);

    document.getElementById('buildingsList').appendChild(divBuilding);

    var imgBuilding = document.createElement('img');
    imgBuilding.src = 'images/' + building.picture;
    imgBuilding.alt = building.name;
    imgBuilding.title = building.name;

    document.getElementById(building.id).appendChild(imgBuilding);
})

for(var i = 0; i < widthMap*heightMap; i++){
    var divTile = document.createElement('div');
    divTile.setAttribute('id', 'tile_' + i);
    divTile.setAttribute('class', 'tile');

    document.getElementById('map').appendChild(divTile);
}